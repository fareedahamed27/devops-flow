# RelationSync — CI/CD Deployment Documentation

A production-style CI/CD pipeline for a 3-tier Node.js + Postgres application, built with Jenkins, Docker, AWS ECR, EC2, Nginx, Let's Encrypt, and Slack notifications. Dev and prod environments run in parallel on shared infrastructure with independent triggers, security scanning, and a manual approval gate for production.

> DNS for `tippu.dpdns.org` and all subdomains is managed via **Cloudflare**.

---

## 1. Architecture Overview

```
Local Machine
     │  git push (develop or main)
     ▼
GitHub (fareedahamed27/devops-flow)
     │  webhook → http://16.16.172.90:8080/github-webhook/
     ▼
EC2 #1 — Jenkins Server (jen.tippu.dpdns.org)
     │  1. Checkout
     │  2. Branch Guard (skip if wrong branch)
     │  3. Build backend + frontend images
     │  4. Trivy scan (dev: report-only · prod: blocking)
     │  5. [prod only] Manual approval via Jenkins input, announced in Slack
     │  6. Push to Amazon ECR
     │  7. SSH deploy trigger → EC2 #2
     ▼
Amazon ECR (eu-north-1)
     002191735381.dkr.ecr.eu-north-1.amazonaws.com/backend
     002191735381.dkr.ecr.eu-north-1.amazonaws.com/frontend
     ▼
EC2 #2 — Nginx / Deployment Server
     docker compose pull + up -d (dev or prod services)
     ▼
Nginx (reverse proxy, SSL termination)
     dev.tippu.dpdns.org  → dev containers
     prod.tippu.dpdns.org → prod containers
     ▼
Public Internet — two live, independently deployable environments
```

Every stage posts a status update to Slack (`#all-relationsync`), so the whole pipeline is observable without watching the Jenkins UI.

---

## 2. Environments & Branch Strategy

| Branch | Triggers | Jenkins Job | Approval Required |
|---|---|---|---|
| `develop` | Dev pipeline | `dev` | No — auto-deploys |
| `main` | Prod pipeline | `prod` | Yes — manual Jenkins approval, 30 min timeout |

The GitHub webhook fires on **every push**, regardless of branch, and notifies both Jenkins jobs. Each `Jenkinsfile` contains a **Branch Guard** stage that checks `env.GIT_BRANCH` and exits cleanly (posting a "skipped" Slack message) if the push isn't for its target branch. This is what makes "push once, only the right pipeline actually runs" work without needing separate webhooks per branch.

---

## 3. Infrastructure

### EC2 #1 — Jenkins Server
| Item | Value |
|---|---|
| Role | CI orchestration — build, scan, gate, push, trigger deploy |
| Public IP | `16.16.172.90` |
| Domain | `jen.tippu.dpdns.org` (points to this IP via Cloudflare DNS) |
| OS | Ubuntu |
| Software | Jenkins (native, via apt), Docker (`docker.io`), AWS CLI v2, Trivy |
| IAM Role attached | `jenkins-ecr-push-role` (`AmazonEC2ContainerRegistryPowerUser`) |
| Security group inbound | `22` (SSH, admin IP only) · `8080` (Jenkins UI + GitHub webhook — open to `0.0.0.0/0` for webhook delivery, or restrict to GitHub's published IP ranges) |
| Swap | 2 GB swap file added (`/swapfile`) — required for Jenkins' built-in node health monitor |

### EC2 #2 — Nginx / Deployment Server
| Item | Value |
|---|---|
| Role | Runs all 6 containers, terminates SSL, reverse-proxies to both environments |
| Public IP | `13.61.6.120` |
| OS | Ubuntu |
| Software | Docker (`docker.io`), Docker Compose plugin, AWS CLI v2, Nginx, Certbot |
| IAM Role attached | `nginx-ecr-pull-role` (`AmazonEC2ContainerRegistryReadOnly`) |
| Security group inbound | `22` (SSH, admin IP only) · `80` (`0.0.0.0/0`) · `443` (`0.0.0.0/0`) |
| Deployment path | `~/relationsync/devops-flow` |

**IAM design note:** Neither instance stores AWS access keys. Each has an instance profile (IAM role) attached directly, so credentials are automatic, temporary, and never appear in a config file, env var, or Jenkins credential store. Jenkins gets push-level ECR access; the deployment server gets pull-only — least privilege between the two roles.

---

## 4. Containers Running on EC2 #2

```
CONTAINER        IMAGE                                    PORT MAPPING           PURPOSE
frontend-prod     .../frontend:prod-latest                 8081 → 80              Prod UI, built + served via Nginx (in-container)
backend-prod      .../backend:prod-latest                  5000 → 5000            Prod API
postgres (prod)   postgres:17                               5432 → 5432            Prod database
frontend-dev      .../frontend:dev-latest                   5174 → 5173            Dev UI, live Vite dev server
backend-dev       .../backend:dev-latest                    5001 → 5000            Dev API
postgres-dev      postgres:17                               5433 → 5432            Dev database
```

Postgres is never built or pushed by the pipeline — it's the official image, started once, and stays running continuously across redeploys. Backend/frontend containers reconnect to it by service name over the Docker network on every redeploy.

None of the app/DB ports (`8081`, `5000`, `5174`, `5001`, `5432`, `5433`) are opened in the security group — Nginx reaches them via `localhost` on the same host, so they're never exposed to the public internet directly.

---

## 5. Docker Images

| Service | Dev Dockerfile | Prod Dockerfile |
|---|---|---|
| Backend | `backend/Dockerfile.dev` — `npm install`, `npm run dev` | `backend/Dockerfile.prod` — `npm ci --omit=dev`, runs `node server.js` |
| Frontend | `frontend/Dockerfile.dev` — live Vite dev server (`--host`) | `frontend/Dockerfile.prod` — multi-stage: build static assets, then serve via `nginx:alpine` |

**Compose files — two purposes, kept strictly separate:**

| File | Used where | Builds from |
|---|---|---|
| `docker-compose.dev.yml` / `docker-compose.prod.yml` | Local machine only | `build: context:` (local source) |
| `docker-compose.ec2.dev.yml` / `docker-compose.ec2.prod.yml` | EC2 #2 only | `image:` (pulled from ECR) |

EC2 never runs `docker build` — Jenkins is the single source of truth for what's actually deployed.

---

## 6. Amazon ECR

| Repo | Region | Tags used |
|---|---|---|
| `002191735381.dkr.ecr.eu-north-1.amazonaws.com/backend` | `eu-north-1` | `dev-<git-sha>`, `dev-latest`, `prod-<git-sha>`, `prod-latest` |
| `002191735381.dkr.ecr.eu-north-1.amazonaws.com/frontend` | `eu-north-1` | same tagging convention |

One repo per service; environment lives entirely in the tag, not in separate repos.

---

## 7. Jenkins Pipelines

### `Jenkinsfile.dev` (branch: `develop`)
1. Checkout + Slack "started" notice
2. Branch Guard — skips if not `develop`
3. Build backend + frontend dev images (`--no-cache`, `--pull`)
4. Trivy scan — `HIGH,CRITICAL`, `--ignore-unfixed`, **non-blocking** (`exit-code 0`)
5. Push `dev-<sha>` and `dev-latest` to ECR
6. SSH into EC2 #2 → `docker compose -f docker-compose.ec2.dev.yml pull && up -d`
7. Slack: deployed / failed

### `Jenkinsfile.prod` (branch: `main`)
1. Checkout + Slack "started" notice
2. Branch Guard — skips if not `main`
3. Build backend + frontend prod images
4. Trivy scan — **blocking** (`exit-code 1`) — a HIGH/CRITICAL CVE fails the build
5. Slack: "awaiting approval" with a direct link to the build
6. **Manual approval** — Jenkins `input` step, 30-minute timeout, aborts safely (no deploy) if unanswered
7. Push `prod-<sha>` and `prod-latest` to ECR
8. SSH into EC2 #2 → `docker compose -f docker-compose.ec2.prod.yml pull && up -d`
9. Slack: deployed / failed / rejected-or-timed-out

### Jenkins Job Configuration
| Job | Definition | Branch specifier | Script Path | Trigger |
|---|---|---|---|---|
| `dev` | Pipeline script from SCM | `*/develop` | `Jenkinsfile.dev` | GitHub hook trigger for GITScm polling |
| `prod` | Pipeline script from SCM | `*/main` | `Jenkinsfile.prod` | GitHub hook trigger for GITScm polling |

### Jenkins Credentials Store
| ID | Kind | Purpose |
|---|---|---|
| `ec2-ssh-key` | SSH Username with private key | Jenkins → EC2 #2, for deploy stage |
| `slack-webhook-url` | Secret text | Slack **Bot Token** (`xoxb-...`) — despite the ID name, holds a bot token, not a legacy webhook URL |

No AWS keys are stored in Jenkins — auth is via the instance's IAM role.

---

## 8. Security Scanning (Trivy)

| Environment | Command flags | Behavior |
|---|---|---|
| Dev | `--severity HIGH,CRITICAL --ignore-unfixed --exit-code 0` | Scans and reports, never blocks — keeps dev iteration fast |
| Prod | `--severity HIGH,CRITICAL --ignore-unfixed --exit-code 1` | Fails the build on any HIGH/CRITICAL CVE — a real gate, not a formality |

All four built images (backend/frontend × dev/prod) are scanned on every run. Postgres is out of scope — it's an unmodified official image, not built or owned by this pipeline.

---

## 9. Slack Integration

| Setting | Value |
|---|---|
| Workspace | `relationsync` |
| Channel | `#all-relationsync` |
| Auth method | Bot Token (`xoxb-...`) via OAuth scope `chat:write` — **not** an Incoming Webhook URL |
| Jenkins plugin | Slack Notification |

Notifications fire at: pipeline start, branch-skip, images built, scan complete, ECR push, awaiting-approval (prod), deploy success, deploy failure, approval timeout/rejection.

The Slack app's bot must be invited into the target channel (`/invite @relationsync`) — token validity alone isn't sufficient for the bot to post.

---

## 10. Domains, DNS & SSL

DNS is managed via **Cloudflare**. A records point each subdomain at the relevant EC2's public IP:

| Domain | A record → | Purpose |
|---|---|---|
| `prod.tippu.dpdns.org` | `13.61.6.120` (EC2 #2) | Prod site, routed by Nginx to frontend-prod (`:8081`) and `/api/` → backend-prod (`:5000`) |
| `dev.tippu.dpdns.org` | `13.61.6.120` (EC2 #2) | Dev site, routed by Nginx to frontend-dev (`:5174`) and `/api/` → backend-dev (`:5001`) |
| `jen.tippu.dpdns.org` | `16.16.172.90` (EC2 #1) | Jenkins UI access, in addition to the raw IP |

> If Cloudflare's proxy (orange cloud) is enabled on any of these records, keep in mind it terminates its own TLS in front of your origin cert — for a Jenkins/webhook endpoint in particular, consider setting that record to **DNS only** (grey cloud) so GitHub's webhook and direct admin access aren't affected by Cloudflare's proxy layer.

**Certificate:** Single Let's Encrypt **wildcard cert** (`*.tippu.dpdns.org`), issued via DNS-01 challenge, covering both subdomains from one cert:
```
/etc/letsencrypt/live/tippu.dpdns.org/fullchain.pem
/etc/letsencrypt/live/tippu.dpdns.org/privkey.pem
```

Nginx redirects all HTTP (`:80`) traffic to HTTPS (`:443`) for both domains.

> **Renewal caveat:** Wildcard certs require DNS-01 validation, which certbot's default auto-renewal cannot complete unless a DNS-provider plugin (e.g. Cloudflare, Route 53) or renewal hook is configured. Run `sudo certbot renew --dry-run` periodically to confirm auto-renewal will actually work before the cert's ~90-day expiry — otherwise plan to renew manually.

### Nginx config summary (`/etc/nginx/sites-available/relationsync`)
- Two domains, each with an HTTP→HTTPS redirect block and an HTTPS server block
- `proxy_pass` to `localhost` + container port for both root and `/api/` paths
- Standard proxy headers (`Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`) forwarded to containers

---

## 11. Secrets & Environment Files

Five env files, deliberately kept **out of Git** (`.gitignore`'d) and living only on the local machine and EC2 #2 — Jenkins never sees or manages them:

| File | Contains |
|---|---|
| `.env` (root) | `DEV_DB_USER/PASSWORD/NAME`, `PROD_DB_USER/PASSWORD/NAME` |
| `backend/.env.dev` | Dev DB connection, dev secrets/keys |
| `backend/.env.prod` | Prod DB connection, prod secrets/keys |
| `frontend/.env.dev` | Dev API base URL |
| `frontend/.env.prod` | Prod API base URL |

**Design principle:** application secrets and CI/infrastructure secrets are fully separated. Env files hold app-level secrets and live only where the app runs. Jenkins credentials (`ec2-ssh-key`, Slack bot token) are infrastructure-level and live only in Jenkins' credential store. AWS auth uses IAM instance roles, so no AWS key exists anywhere in either category.

**Important, frontend-specific:** Vite bakes env values into the compiled JS at *build time* for production builds. Changing `frontend/.env.prod` after the fact does nothing until the image is rebuilt — this is why prod frontend changes must go through the pipeline (or a manual rebuild), never just a container restart.

---

## 12. GitHub Configuration

| Setting | Value |
|---|---|
| Repo | `https://github.com/fareedahamed27/devops-flow` |
| Webhook payload URL | `http://16.16.172.90:8080/github-webhook/` (or `http://jen.tippu.dpdns.org:8080/github-webhook/` if that record is DNS-only) |
| Webhook content type | `application/json` |
| Webhook events | Just the push event |

---

## 13. End-to-End Flow (What Actually Happens on a Push)

1. Developer commits and pushes to `develop` or `main` from their local machine
2. GitHub webhook notifies Jenkins; both `dev` and `prod` jobs are pinged
3. The job matching the pushed branch proceeds; the other exits at its Branch Guard stage
4. Images build, get scanned, and (for prod) wait on human approval — all narrated in Slack
5. Approved/passed images are pushed to ECR under the correct tag
6. Jenkins SSHes into EC2 #2, which pulls the new image and restarts only that service
7. Nginx continues routing traffic to whichever containers are currently running — no nginx config changes needed per deploy
8. The relevant domain (`dev.` or `prod.tippu.dpdns.org`) reflects the new build within seconds of approval/deploy

---

## 14. Key Design Decisions Worth Remembering

- **One ECR repo per service, tags carry environment** — not four separate repos.
- **Trivy scans all four built images**, but only blocks the pipeline in prod — dev stays fast for iteration.
- **Manual approval is a Jenkins `input` step**, not a GitHub PR — appropriate for a single-branch-per-environment setup without PR-based promotion.
- **IAM roles over access keys**, on both EC2 instances — nothing to leak because there's nothing stored.
- **Postgres is never rebuilt or scanned** — it's an unmodified upstream image, persistent across every app redeploy via a named Docker volume.
- **Local and EC2 compose files are intentionally different** (`build:` vs `image:`) — this is what enforces "Jenkins builds, EC2 only runs what Jenkins approved."
