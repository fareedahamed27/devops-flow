export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  relationshipStatus: 'dating' | 'married' | 'separated';
  profilePicture?: string;
  createdAt: string;
  questionnaireTaken: boolean;
  reportGenerated: boolean;
}

export interface QuestionnaireResponse {
  id: string;
  userId: string;
  questionId: string;
  answer: string;
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'scale';
  options?: string[];
  category: 'communication' | 'intimacy' | 'trust' | 'conflict' | 'future' | 'emotional' | 'family' | 'gender_roles' | 'financial';
}

export interface AIReport {
  id: string;
  userId: string;
  emotionalVulnerabilityIndex: number;
  painPoints: string[];
  communicationStyle: string;
  compatibilityScore?: number;
  recommendations: string[];
  generatedAt: string;
}

export interface PairRequest {
  id: string;
  requesterId: string;
  targetEmail: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface CoupleProfile {
  id: string;
  partner1Id: string;
  partner2Id: string;
  combinedReport?: CombinedReport;
  createdAt: string;
}

export interface CombinedReport {
  compatibilityScore: number;
  conflictAreas: string[];
  strengths: string[];
  actionItems: ActionItem[];
  reflections: PartnerReflection[];
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: 'communication' | 'activity' | 'reflection';
  completed: boolean;
}

export interface PartnerReflection {
  id: string;
  forPartnerId: string;
  message: string;
  category: string;
}

export interface WeeklySync {
  id: string;
  coupleId: string;
  week: number;
  responses: SyncResponse[];
  syncScore: number;
  createdAt: string;
}

export interface SyncResponse {
  questionId: string;
  partnerId: string;
  answer: string;
}