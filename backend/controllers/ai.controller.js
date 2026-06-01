
// // // // OLD NOW NEW 
// // const pool = require('../db');

// // const axios = require('axios');
// // const dotenv = require('dotenv');

// // dotenv.config();

// // const API_KEY = process.env.GEMINI_API_KEY;

// // const generateEnhancedMockAnalysis = async (responses) => {
// //   const emotionalTags = [];
// //   const painPoints = [];
// //   const strengths = [];
// //   const recommendations = [];
// //   const redFlags = [];
// //   const deepInsights = [];
// //   const culturalInsights = [];
// //   const counselorNotes = [];

// //   // Initialize scoring with realistic baselines
// //   let communicationScore = 6.5;
// //   let emotionalBurdenScore = 5.5;
// //   let trustScore = 7.0;
// //   let intimacyScore = 6.0;
// //   let conflictResolutionScore = 6.2;
// //   let futureAlignmentScore = 6.8;
// //   let familyInfluenceScore = 7.0;
// //   let culturalAdaptationScore = 6.5;

// //   // Separate text-based and rating/choice-based responses
// //   const textResponses = responses.filter(r => r.type === 'text' && r.answer_text);
// //   const ratingChoiceResponses = responses.filter(r => r.selected_option_id || (r.type === 'scale' && r.answer_text));

// //   // Decision tree for rating/choice-based answers
// //   ratingChoiceResponses.forEach(response => {
// //     if (response.selected_option_id && response.answer_text) {
// //       const scaleValue = parseInt(response.answer_text) || 5;
// //       const questionId = parseInt(response.question_id);

// //       // Family influence scale (Question 6)
// //       if (questionId === 6) {
// //         familyInfluenceScore = scaleValue;
// //         if (scaleValue >= 8) {
// //           culturalInsights.push('Family has very strong influence on your relationship decisions.');
// //         } else if (scaleValue <= 3) {
// //           culturalInsights.push('You maintain strong independence from family influence.');
// //         }
// //       }

// //       // Communication effectiveness
// //       if ([1, 5].includes(questionId)) {
// //         if (scaleValue <= 3) {
// //           painPoints.push('Low communication effectiveness.');
// //           communicationScore -= 1.5;
// //         } else if (scaleValue >= 8) {
// //           strengths.push('Strong communication foundation.');
// //           communicationScore += 1.0;
// //         }
// //       }

// //       // Trust levels
// //       if ([18].includes(questionId)) {
// //         if (scaleValue <= 4) {
// //           redFlags.push('Significant trust and security deficits.');
// //           trustScore -= 2.0;
// //         }
// //       }

// //       // Emotional connection
// //       if ([15, 21, 25].includes(questionId)) {
// //         if (scaleValue <= 3) {
// //           painPoints.push('Low emotional intimacy.');
// //           intimacyScore -= 1.5;
// //         }
// //       }
// //     }
// //   });

// //   // Ensure scores stay within realistic bounds
// //   communicationScore = Math.max(1, Math.min(10, communicationScore));
// //   emotionalBurdenScore = Math.max(1, Math.min(10, emotionalBurdenScore));
// //   trustScore = Math.max(1, Math.min(10, trustScore));
// //   intimacyScore = Math.max(1, Math.min(10, intimacyScore));
// //   conflictResolutionScore = Math.max(1, Math.min(10, conflictResolutionScore));
// //   futureAlignmentScore = Math.max(1, Math.min(10, futureAlignmentScore));
// //   familyInfluenceScore = Math.max(1, Math.min(10, familyInfluenceScore));
// //   culturalAdaptationScore = Math.max(1, Math.min(10, culturalAdaptationScore));

// //   // Fallback keyword analysis for text responses (used if AI fails)
// //   const fallbackTextAnalysis = () => {
// //     textResponses.forEach(response => {
// //       const text = response.answer_text.toLowerCase();
// //       const questionId = parseInt(response.question_id);

// //       if ([6, 7, 8, 9, 10].includes(questionId)) {
// //         if (text.includes('family pressure') || text.includes('expectations') || text.includes('tradition')) {
// //           painPoints.push('Feeling caught between family expectations and personal desires.');
// //           culturalInsights.push('Family expectations shape your relationship decisions.');
// //           emotionalBurdenScore += 1.5;
// //         }
// //         if (text.includes('boundaries') || text.includes('independent')) {
// //           strengths.push('Healthy boundary-setting with family.');
// //           culturalAdaptationScore += 1.0;
// //         }
// //       }

// //       if ([26, 27, 28].includes(questionId)) {
// //         if (text.includes('traditional') && text.includes('tension')) {
// //           painPoints.push('Traditional gender roles create friction.');
// //           culturalInsights.push('Redefining gender roles is challenging.');
// //           conflictResolutionScore -= 1.0;
// //         }
// //         if (text.includes('balance') || text.includes('equal')) {
// //           strengths.push('Navigating egalitarian partnership.');
// //           culturalAdaptationScore += 1.5;
// //         }
// //       }

// //       if ([1, 2, 3, 4, 5].includes(questionId)) {
// //         if (text.includes('misunderstood') || text.includes('not heard')) {
// //           painPoints.push('Feeling unheard and misunderstood.');
// //           communicationScore -= 1.5;
// //           counselorNotes.push('Communication style may stem from family patterns.');
// //         }
// //         if (text.includes('fine') && questionId === 5) {
// //           painPoints.push('The "I\'m fine" pattern prevents intimacy.');
// //           deepInsights.push('Saying "I\'m fine" is a learned behavior.');
// //           emotionalTags.push('emotional_suppression');
// //         }
// //       }

// //       if ([16, 17, 18, 19, 20].includes(questionId)) {
// //         if (text.includes('betrayed') || text.includes('lied') || text.includes('cheated')) {
// //           trustScore -= 3.0;
// //           redFlags.push('Trust violations need attention.');
// //           counselorNotes.push('Betrayal carries cultural shame.');
// //         }
// //         if (text.includes('check phone') || text.includes('suspicious')) {
// //           trustScore -= 2.0;
// //           redFlags.push('Surveillance indicates threat detection.');
// //           deepInsights.push('Checking phones increases anxiety.');
// //         }
// //       }

// //       if ([11, 12, 13, 14, 15].includes(questionId)) {
// //         if (text.includes('lonely') || text.includes('disconnected')) {
// //           intimacyScore -= 2.0;
// //           emotionalTags.push('emotional_isolation');
// //           painPoints.push('Emotional loneliness despite presence.');
// //         }
// //         if (text.includes('hide') || text.includes('mask')) {
// //           intimacyScore -= 1.5;
// //           painPoints.push('Hiding prevents authentic love.');
// //           counselorNotes.push('Hiding blocks deep connection.');
// //         }
// //         if (text.includes('fear') && (text.includes('leaving') || text.includes('abandonment'))) {
// //           emotionalTags.push('anxious_attachment');
// //           deepInsights.push('Fear of abandonment may push partner away.');
// //         }
// //       }

// //       if ([29, 30, 31, 32, 33].includes(questionId)) {
// //         if (text.includes('shut down') || text.includes('withdraw')) {
// //           conflictResolutionScore -= 2.0;
// //           painPoints.push('Emotional shutdown during conflict.');
// //           deepInsights.push('Shutdown is a protective response.');
// //         }
// //         if (text.includes('eggshells') || text.includes('avoid')) {
// //           conflictResolutionScore -= 1.5;
// //           painPoints.push('Walking on eggshells limits voice.');
// //           deepInsights.push('Avoiding truth kills intimacy.');
// //         }
// //       }

// //       if ([34, 35].includes(questionId)) {
// //         if (text.includes('fight') || text.includes('stress')) {
// //           painPoints.push('Financial stress affects security.');
// //           culturalInsights.push('Financial pressures include family expectations.');
// //           emotionalBurdenScore += 1.0;
// //         }
// //       }

// //       if (text.includes('support') || text.includes('understand')) {
// //         strengths.push('Capacity for emotional support.');
// //         communicationScore += 0.5;
// //       }
// //       if (text.includes('love') || text.includes('care')) {
// //         strengths.push('Maintains emotional connection.');
// //         futureAlignmentScore += 0.5;
// //       }
// //     });
// //   };

// //   // Run fallback analysis to populate initial data
// //   fallbackTextAnalysis();

// //   // Prepare context for Gemini AI (text responses only)
// //   const textResponseSummary = textResponses.map(r => ({
// //     question: r.question_text,
// //     answer: r.answer_text,
// //     category: r.category,
// //   }));

// //   const scoresSummary = {
// //     communication_score: communicationScore,
// //     emotional_burden_score: emotionalBurdenScore,
// //     trust_score: trustScore,
// //     intimacy_score: intimacyScore,
// //     conflict_resolution_score: conflictResolutionScore,
// //     future_alignment_score: futureAlignmentScore,
// //     family_influence_score: familyInfluenceScore,
// //     cultural_adaptation_score: culturalAdaptationScore,
// //   };

// //   // Gemini AI prompt for text-based answers
// //   const prompt = `
// // You are an AI relationship assistant for RelationSync, a platform focused on enhancing relationships with deep understanding of Indian cultural context. Analyze the following text-based questionnaire responses to generate a comprehensive relationship report. Provide empathetic, practical, and culturally sensitive insights for Indian relationship dynamics (e.g., family influence, gender roles, emotional expression). Use the provided scores as context but do not alter them. Return only text-based outputs.

// // **Text Responses**:
// // ${JSON.stringify(textResponseSummary, null, 2)}

// // **Scores (for context)**:
// // ${JSON.stringify(scoresSummary, null, 2)}

// // **Instructions**:
// // 1. **Emotional Summary**: Write a concise, empathetic summary (100-150 words) reflecting the emotional state of the relationship based on text responses and scores. Use a counselor-like tone, incorporating Indian cultural nuances.
// // 2. **Pain Points**: Generate up to 8 specific pain points (short sentences) highlighting challenges from text responses, with psychological and cultural depth.
// // 3. **Strengths**: Generate up to 6 strengths (short sentences) highlighting positive aspects from text responses.
// // 4. **Recommendations**: Generate up to 12 actionable recommendations (short sentences) tailored to text responses and Indian context.
// // 5. **Red Flags**: Generate up to 5 critical issues (short sentences) requiring immediate attention from text responses.
// // 6. **Deep Insights**: Generate up to 6 psychological insights (short sentences) explaining underlying dynamics from text responses, with Indian cultural factors.
// // 7. **Cultural Insights**: Generate up to 4 insights (short sentences) specific to Indian relationship dynamics from text responses.
// // 8. **Counselor Notes**: Generate up to 4 notes (short sentences) as if written by a therapist, offering guidance based on text responses.

// // **Output Format**:
// // Return a JSON object with: emotional_summary, pain_points, strengths, recommendations, red_flags, deep_insights, cultural_insights, counselor_notes.
// // `;

// //   // Call Gemini API with retry logic
// //   let aiAnalysis;
// //   let attempts = 0;
// //   const maxAttempts = 3;
// //   while (attempts < maxAttempts) {
// //     try {
// //       const response = await axios.post(
// //         `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
// //         {
// //           contents: [{ role: 'user', parts: [{ text: prompt }] }],
// //         },
// //         {
// //           headers: { 'Content-Type': 'application/json' },
// //         }
// //       );

// //       const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
// //       if (!responseText) {
// //         throw new Error('No response from Gemini API');
// //       }

// //       aiAnalysis = JSON.parse(responseText);
// //       break;
// //     } catch (error) {
// //       console.error('Gemini API error:', error);
// //       if (error.response?.status === 429) {
// //         attempts++;
// //         if (attempts === maxAttempts) {
// //           console.error('Max retry attempts reached for Gemini API');
// //           aiAnalysis = {
// //             emotional_summary: 'Unable to generate AI analysis due to API limits. Your relationship shows commitment but faces challenges.',
// //             pain_points: painPoints.slice(0, 8),
// //             strengths: strengths.slice(0, 6),
// //             recommendations: [
// //               'Practice active listening to improve communication.',
// //               'Set clear boundaries with family members.',
// //               'Schedule weekly check-ins to discuss feelings.',
// //               'Address trust issues with open conversations.',
// //               'Seek professional help for persistent conflicts.',
// //               'Prioritize quality time to build intimacy.',
// //               'Create a shared vision for your future.',
// //               'Respect cultural traditions while maintaining autonomy.',
// //               'Use "I" statements to express emotions.',
// //               'Practice forgiveness to heal past hurts.',
// //               'Learn each other’s emotional triggers.',
// //               'Balance individual and couple goals.',
// //             ].slice(0, 12),
// //             red_flags: redFlags.slice(0, 5),
// //             deep_insights: deepInsights.slice(0, 6),
// //             cultural_insights: culturalInsights.slice(0, 4),
// //             counselor_notes: counselorNotes.slice(0, 4),
// //           };
// //           break;
// //         }
// //         await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
// //       } else {
// //         throw error;
// //       }
// //     }
// //   }

// //   // Fallback if AI fails
// //   if (!aiAnalysis) {
// //     aiAnalysis = {
// //       emotional_summary: 'Unable to generate AI analysis. Your relationship shows commitment but faces challenges.',
// //       pain_points: painPoints.slice(0, 8),
// //       strengths: strengths.slice(0, 6),
// //       recommendations: [
// //         'Practice active listening to improve communication.',
// //         'Set clear boundaries with family members.',
// //         'Schedule weekly check-ins to discuss feelings.',
// //         'Address trust issues with open conversations.',
// //         'Seek professional help for persistent conflicts.',
// //         'Prioritize quality time to build intimacy.',
// //         'Create a shared vision for your future.',
// //         'Respect cultural traditions while maintaining autonomy.',
// //         'Use "I" statements to express emotions.',
// //         'Practice forgiveness to heal past hurts.',
// //         'Learn each other’s emotional triggers.',
// //         'Balance individual and couple goals.',
// //       ].slice(0, 12),
// //       red_flags: redFlags.slice(0, 5),
// //       deep_insights: deepInsights.slice(0, 6),
// //       cultural_insights: culturalInsights.slice(0, 4),
// //       counselor_notes: counselorNotes.slice(0, 4),
// //     };
// //   }

// //   // Add default recommendations based on scores
// //   const allRecommendations = [
// //     'Practice the "Speaker-Listener Technique" for better communication.',
// //     'Create a daily "connection ritual" of 15 minutes.',
// //     'Use "I" statements instead of accusations.',
// //     'Rebuild trust through consistent small actions.',
// //     'Set respectful boundaries with family.',
// //     'Create a united front for family pressures.',
// //     'Try the "Daily Appreciation Practice".',
// //     'Practice "Emotional Mirroring" in conversations.',
// //     'Learn to "Take a Break" during conflicts.',
// //     'Practice "Fighting Fair" without past issues.',
// //     'Schedule monthly "Vision Meetings" for goals.',
// //     'Celebrate progress together as a couple.',
// //   ];

// //   if (communicationScore < 6) recommendations.push(...allRecommendations.slice(0, 3));
// //   if (trustScore < 6) recommendations.push(...allRecommendations.slice(3, 4));
// //   if (familyInfluenceScore > 7.5 || culturalAdaptationScore < 6) recommendations.push(...allRecommendations.slice(4, 6));
// //   if (intimacyScore < 6) recommendations.push(...allRecommendations.slice(6, 8));
// //   if (conflictResolutionScore < 6) recommendations.push(...allRecommendations.slice(8, 10));
// //   if (futureAlignmentScore < 6) recommendations.push(...allRecommendations.slice(10, 12));

// //   // Add default cultural insights if none
// //   if (culturalInsights.length === 0) {
// //     culturalInsights.push('Navigating modern Indian relationships involves balancing tradition and personal choice.');
// //   }

// //   // Add default strengths if none
// //   if (strengths.length === 0) {
// //     strengths.push('Your willingness to examine your relationship shows maturity.');
// //   }

// //   // Generate love language
// //   const loveLanguages = ['Words of Affirmation', 'Quality Time', 'Physical Touch', 'Acts of Service', 'Receiving Gifts'];
// //   const loveLanguage = loveLanguages[Math.floor(Math.random() * loveLanguages.length)];

// //   // Merge AI and decision tree outputs
// //   return {
// //     emotional_summary: aiAnalysis.emotional_summary,
// //     emotional_tags: [...new Set(emotionalTags)],
// //     communication_score: Math.round(communicationScore * 10) / 10,
// //     emotional_burden_score: Math.round(emotionalBurdenScore * 10) / 10,
// //     trust_score: Math.round(trustScore * 10) / 10,
// //     intimacy_score: Math.round(intimacyScore * 10) / 10,
// //     conflict_resolution_score: Math.round(conflictResolutionScore * 10) / 10,
// //     future_alignment_score: Math.round(futureAlignmentScore * 10) / 10,
// //     family_influence_score: Math.round(familyInfluenceScore * 10) / 10,
// //     cultural_adaptation_score: Math.round(culturalAdaptationScore * 10) / 10,
// //     love_language_estimate: loveLanguage,
// //     pain_points: aiAnalysis.pain_points.slice(0, 8),
// //     strengths: [...new Set([...strengths, ...aiAnalysis.strengths])].slice(0, 6),
// //     recommendations: [...new Set([...recommendations, ...aiAnalysis.recommendations])].slice(0, 12),
// //     red_flags: aiAnalysis.red_flags.slice(0, 5),
// //     deep_insights: aiAnalysis.deep_insights.slice(0, 6),
// //     cultural_insights: [...new Set([...culturalInsights, ...aiAnalysis.cultural_insights])].slice(0, 4),
// //     counselor_notes: aiAnalysis.counselor_notes.slice(0, 4),
// //   };
// // };

// // const generateCoupleAnalysis = async (userReport, partnerReport) => {
// //   // Calculate compatibility scores
// //   const compatibilityScore = Math.round(((
// //     (userReport.communication_score + partnerReport.communication_score) / 2 +
// //     (userReport.trust_score + partnerReport.trust_score) / 2 +
// //     (userReport.intimacy_score + partnerReport.intimacy_score) / 2 +
// //     (userReport.conflict_resolution_score + partnerReport.conflict_resolution_score) / 2 +
// //     (userReport.future_alignment_score + partnerReport.future_alignment_score) / 2
// //   ) / 5) * 10) / 10;

// //   const communicationHarmony = Math.round(((userReport.communication_score + partnerReport.communication_score) / 2) * 10) / 10;
// //   const trustAlignment = Math.round(((userReport.trust_score + partnerReport.trust_score) / 2) * 10) / 10;
// //   const intimacyBalance = Math.round(((userReport.intimacy_score + partnerReport.intimacy_score) / 2) * 10) / 10;
// //   const conflictResolutionStyle = Math.round(((userReport.conflict_resolution_score + partnerReport.conflict_resolution_score) / 2) * 10) / 10;
// //   const futureVisionAlignment = Math.round(((userReport.future_alignment_score + partnerReport.future_alignment_score) / 2) * 10) / 10;
// //   const culturalAdaptationSync = Math.round(((userReport.cultural_adaptation_score + partnerReport.cultural_adaptation_score) / 2) * 10) / 10;

// //   // Determine compatibility level
// //   let compatibilityLevel = 'Good';
// //   if (compatibilityScore >= 8.5) compatibilityLevel = 'Excellent';
// //   else if (compatibilityScore >= 7.5) compatibilityLevel = 'Very Good';
// //   else if (compatibilityScore >= 6.5) compatibilityLevel = 'Good';
// //   else if (compatibilityScore >= 5.5) compatibilityLevel = 'Fair';
// //   else compatibilityLevel = 'Needs Work';

// //   // Prepare data for Gemini AI
// //   const coupleData = {
// //     partner_a: {
// //       emotional_summary: userReport.emotional_summary,
// //       emotional_tags: userReport.emotional_tags,
// //       pain_points: userReport.pain_points,
// //       strengths: userReport.strengths,
// //       recommendations: userReport.recommendations,
// //       red_flags: userReport.red_flags,
// //       deep_insights: userReport.deep_insights,
// //       cultural_insights: userReport.cultural_insights,
// //       counselor_notes: userReport.counselor_notes,
// //       scores: {
// //         communication_score: userReport.communication_score,
// //         emotional_burden_score: userReport.emotional_burden_score,
// //         trust_score: userReport.trust_score,
// //         intimacy_score: userReport.intimacy_score,
// //         conflict_resolution_score: userReport.conflict_resolution_score,
// //         future_alignment_score: userReport.future_alignment_score,
// //         family_influence_score: userReport.family_influence_score,
// //         cultural_adaptation_score: userReport.cultural_adaptation_score,
// //       }
// //     },
// //     partner_b: {
// //       emotional_summary: partnerReport.emotional_summary,
// //       emotional_tags: partnerReport.emotional_tags,
// //       pain_points: partnerReport.pain_points,
// //       strengths: partnerReport.strengths,
// //       recommendations: partnerReport.recommendations,
// //       red_flags: partnerReport.red_flags,
// //       deep_insights: partnerReport.deep_insights,
// //       cultural_insights: partnerReport.cultural_insights,
// //       counselor_notes: partnerReport.counselor_notes,
// //       scores: {
// //         communication_score: partnerReport.communication_score,
// //         emotional_burden_score: partnerReport.emotional_burden_score,
// //         trust_score: partnerReport.trust_score,
// //         intimacy_score: partnerReport.intimacy_score,
// //         conflict_resolution_score: partnerReport.conflict_resolution_score,
// //         future_alignment_score: partnerReport.future_alignment_score,
// //         family_influence_score: partnerReport.family_influence_score,
// //         cultural_adaptation_score: partnerReport.cultural_adaptation_score,
// //       }
// //     },
// //     couple_scores: {
// //       compatibility_score,
// //       communication_harmony,
// //       trust_alignment,
// //       intimacy_balance,
// //       conflict_resolution_style,
// //       future_vision_alignment,
// //       cultural_adaptation_sync
// //     }
// //   };

// //   // Gemini AI prompt for couple analysis
// //   const prompt = `
// // You are an AI relationship assistant for RelationSync, a platform focused on enhancing relationships with deep understanding of Indian cultural context. Analyze the following reports for two partners to generate a comprehensive couple relationship report. Provide empathetic, practical, and culturally sensitive insights for Indian relationship dynamics (e.g., family influence, gender roles, emotional expression). Use the provided couple scores and individual reports as context to create realistic, dynamic insights.

// // **Couple Data**:
// // ${JSON.stringify(coupleData, null, 2)}

// // **Instructions**:
// // 1. **Couple Summary**: Write a concise, empathetic summary (100-150 words) reflecting the couple's relationship dynamics based on both partners' reports and couple scores. Use a counselor-like tone, incorporating Indian cultural nuances.
// // 2. **Shared Strengths**: Generate up to 6 strengths (short sentences) highlighting positive aspects of the couple's relationship, based on both partners' reports.
// // 3. **Growth Areas**: Generate up to 6 growth areas (short sentences) identifying challenges the couple faces, with psychological and cultural depth.
// // 4. **Couple Recommendations**: Generate up to 10 actionable recommendations (short sentences) tailored to the couple's dynamics and Indian context.
// // 5. **Relationship Insights**: Generate up to 6 psychological insights (short sentences) explaining underlying couple dynamics, with Indian cultural factors.
// // 6. **Partner Messages**: Generate two messages (50-70 words each), one from Partner A to Partner B and one from Partner B to Partner A, expressing empathy and commitment based on their reports.

// // **Output Format**:
// // Return a JSON object with: couple_summary, shared_strengths, growth_areas, couple_recommendations, relationship_insights, partner_messages (object with to_partner_a and to_partner_b).
// // `;

// //   // Call Gemini API with retry logic
// //   let aiCoupleAnalysis;
// //   let attempts = 0;
// //   const maxAttempts = 3;
// //   while (attempts < maxAttempts) {
// //     try {
// //       const response = await axios.post(
// //         `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
// //         {
// //           contents: [{ role: 'user', parts: [{ text: prompt }] }],
// //         },
// //         {
// //           headers: { 'Content-Type': 'application/json' },
// //         }
// //       );

// //       const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
// //       if (!responseText) {
// //         throw new Error('No response from Gemini API');
// //       }

// //       aiCoupleAnalysis = JSON.parse(responseText);
// //       break;
// //     } catch (error) {
// //       console.error('Gemini API error for couple analysis:', error);
// //       if (error.response?.status === 429) {
// //         attempts++;
// //         if (attempts === maxAttempts) {
// //           console.error('Max retry attempts reached for Gemini API (couple analysis)');
// //           // Fallback to static arrays
// //           aiCoupleAnalysis = {
// //             couple_summary: 'Your relationship shows commitment but faces challenges due to API limits. Please try again later.',
// //             shared_strengths: [
// //               'Both partners show commitment to understanding and improving the relationship',
// //               'You share similar values about the importance of emotional connection',
// //               'There\'s mutual respect for each other\'s perspectives and feelings',
// //               'Both of you are willing to work on personal growth for the relationship',
// //               'You have complementary strengths that balance each other well',
// //               'Strong foundation of care and affection despite current challenges'
// //             ],
// //             growth_areas: [
// //               'Developing more effective communication patterns during disagreements',
// //               'Building stronger emotional intimacy through vulnerability and openness',
// //               'Creating better work-life balance to prioritize relationship time',
// //               'Aligning expectations about family involvement and boundaries',
// //               'Improving conflict resolution skills to prevent escalation',
// //               'Strengthening trust through consistent actions and transparency'
// //             ],
// //             couple_recommendations: [
// //               'Schedule weekly "relationship meetings" to discuss both appreciations and concerns in a structured way',
// //               'Practice the "5:1 ratio" - for every criticism or complaint, share five positive observations about your partner',
// //               'Create a "relationship vision board" together - visualize your shared future and goals as a couple',
// //               'Implement a "24-hour rule" for major decisions - discuss important choices together before acting',
// //               'Establish "his time, her time, and our time" - balance individual needs with couple connection',
// //               'Practice "emotional check-ins" - ask "How are you feeling about us?" regularly',
// //               'Create rituals for connection: daily appreciation, weekly dates, monthly relationship reviews',
// //               'Learn each other\'s "emotional triggers" and develop strategies to support during difficult moments',
// //               'Practice "repair attempts" during conflicts - use humor, affection, or acknowledgment to de-escalate',
// //               'Develop a "couple mission statement" - define your shared values and purpose together'
// //             ],
// //             relationship_insights: [
// //               'Your relationship patterns show both individual growth needs and couple dynamics that can be transformed with awareness',
// //               'The cultural context of your relationship adds both richness and complexity - honoring tradition while creating your own path',
// //               'Your different communication styles can become a strength when you learn to bridge the gap with understanding',
// //               'The emotional patterns you\'ve developed are protective but may be limiting your capacity for deeper intimacy',
// //               'Your relationship has the potential for profound growth when both partners feel safe to be vulnerable',
// //               'The family influences in your relationship require careful navigation to maintain both respect and autonomy'
// //             ],
// //             partner_messages: {
// //               to_partner_a: 'I see how much you care about our relationship and how hard you\'re trying. I want you to know that your efforts don\'t go unnoticed, and I\'m committed to growing together with you. Let\'s create the love story we both deserve.',
// //               to_partner_b: 'Your patience and understanding mean everything to me. I know I\'m not perfect, but I want to be the partner you need. Thank you for believing in us and for being willing to work through our challenges together.'
// //             }
// //           };
// //           break;
// //         }
// //         await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
// //       } else {
// //         throw error;
// //       }
// //     }
// //   }

// //   // Fallback if AI fails
// //   if (!aiCoupleAnalysis) {
// //     aiCoupleAnalysis = {
// //       couple_summary: 'Your relationship shows commitment but faces challenges due to API limits. Please try again later.',
// //       shared_strengths: [
// //         'Both partners show commitment to understanding and improving the relationship',
// //         'You share similar values about the importance of emotional connection',
// //         'There\'s mutual respect for each other\'s perspectives and feelings',
// //         'Both of you are willing to work on personal growth for the relationship',
// //         'You have complementary strengths that balance each other well',
// //         'Strong foundation of care and affection despite current challenges'
// //       ],
// //       growth_areas: [
// //         'Developing more effective communication patterns during disagreements',
// //         'Building stronger emotional intimacy through vulnerability and openness',
// //         'Creating better work-life balance to prioritize relationship time',
// //         'Aligning expectations about family involvement and boundaries',
// //         'Improving conflict resolution skills to prevent escalation',
// //         'Strengthening trust through consistent actions and transparency'
// //       ],
// //       couple_recommendations: [
// //         'Schedule weekly "relationship meetings" to discuss both appreciations and concerns in a structured way',
// //         'Practice the "5:1 ratio" - for every criticism or complaint, share five positive observations about your partner',
// //         'Create a "relationship vision board" together - visualize your shared future and goals as a couple',
// //         'Implement a "24-hour rule" for major decisions - discuss important choices together before acting',
// //         'Establish "his time, her time, and our time" - balance individual needs with couple connection',
// //         'Practice "emotional check-ins" - ask "How are you feeling about us?" regularly',
// //         'Create rituals for connection: daily appreciation, weekly dates, monthly relationship reviews',
// //         'Learn each other\'s "emotional triggers" and develop strategies to support during difficult moments',
// //         'Practice "repair attempts" during conflicts - use humor, affection, or acknowledgment to de-escalate',
// //         'Develop a "couple mission statement" - define your shared values and purpose together'
// //       ],
// //       relationship_insights: [
// //         'Your relationship patterns show both individual growth needs and couple dynamics that can be transformed with awareness',
// //         'The cultural context of your relationship adds both richness and complexity - honoring tradition while creating your own path',
// //         'Your different communication styles can become a strength when you learn to bridge the gap with understanding',
// //         'The emotional patterns you\'ve developed are protective but may be limiting your capacity for deeper intimacy',
// //         'Your relationship has the potential for profound growth when both partners feel safe to be vulnerable',
// //         'The family influences in your relationship require careful navigation to maintain both respect and autonomy'
// //       ],
// //       partner_messages: {
// //         to_partner_a: 'I see how much you care about our relationship and how hard you\'re trying. I want you to know that your efforts don\'t go unnoticed, and I\'m committed to growing together with you. Let\'s create the love story we both deserve.',
// //         to_partner_b: 'Your patience and understanding mean everything to me. I know I\'m not perfect, but I want to be the partner you need. Thank you for believing in us and for being willing to work through our challenges together.'
// //       }
// //     };
// //   }

// //   return {
// //     compatibility_score: compatibilityScore,
// //     communication_harmony: communicationHarmony,
// //     trust_alignment: trustAlignment,
// //     intimacy_balance: intimacyBalance,
// //     conflict_resolution_style: conflictResolutionStyle,
// //     future_vision_alignment: futureVisionAlignment,
// //     cultural_adaptation_sync: culturalAdaptationSync,
// //     compatibility_level: compatibilityLevel,
// //     shared_strengths: aiCoupleAnalysis.shared_strengths.slice(0, 6),
// //     growth_areas: aiCoupleAnalysis.growth_areas.slice(0, 6),
// //     couple_recommendations: aiCoupleAnalysis.couple_recommendations.slice(0, 10),
// //     relationship_insights: aiCoupleAnalysis.relationship_insights.slice(0, 6),
// //     partner_messages: aiCoupleAnalysis.partner_messages,
// //     couple_summary: aiCoupleAnalysis.couple_summary
// //   };
// // };

// // const generateReport = async (req, res) => {
// //   try {
// //     const { sessionId } = req.params;
// //     const userId = req.user.id;

// //     // Verify session belongs to user and is completed
// //     const sessionResult = await pool.query(
// //       'SELECT id, status FROM user_questionnaire_sessions WHERE id = $1 AND user_id = $2 AND status = $3',
// //       [sessionId, userId, 'completed']
// //     );

// //     if (sessionResult.rows.length === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Completed questionnaire session not found'
// //       });
// //     }

// //     // Check if report already exists
// //     const existingReport = await pool.query(
// //       'SELECT id FROM ai_reports WHERE session_id = $1',
// //       [sessionId]
// //     );

// //     if (existingReport.rows.length > 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Report already generated for this session'
// //       });
// //     }

// //     // Get all responses for this session with question details
// //     const responsesResult = await pool.query(
// //       `SELECT qr.*, q.question_text, q.type, qc.name as category, qo.option_text
// //        FROM question_responses qr
// //        JOIN questions q ON qr.question_id = q.id
// //        JOIN question_categories qc ON q.category_id = qc.id
// //        LEFT JOIN question_options qo ON qr.selected_option_id = qo.id
// //        WHERE qr.session_id = $1
// //        ORDER BY q.priority`,
// //       [sessionId]
// //     );

// //     const responses = responsesResult.rows;

// //     if (responses.length === 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'No responses found for this session'
// //       });
// //     }

// //     console.log('🧠 Generating enhanced psychological analysis with Indian cultural context');
// //     const analysis = await generateEnhancedMockAnalysis(responses);

// //     const communicationScoreInt = Math.round(analysis.communication_score);
// //     const emotionalBurdenScoreInt = Math.round(analysis.emotional_burden_score);

// //     const reportResult = await pool.query(
// //       `INSERT INTO ai_reports (
// //         session_id, user_id, emotional_summary, emotional_tags,
// //         communication_score, emotional_burden_score, love_language_estimate,
// //         report_json
// //       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
// //       RETURNING id, created_at`,
// //       [
// //         sessionId,
// //         userId,
// //         analysis.emotional_summary,
// //         analysis.emotional_tags,
// //         communicationScoreInt,
// //         emotionalBurdenScoreInt,
// //         analysis.love_language_estimate,
// //         JSON.stringify({
// //           trust_score: analysis.trust_score,
// //           intimacy_score: analysis.intimacy_score,
// //           conflict_resolution_score: analysis.conflict_resolution_score,
// //           future_alignment_score: analysis.future_alignment_score,
// //           family_influence_score: analysis.family_influence_score,
// //           cultural_adaptation_score: analysis.cultural_adaptation_score,
// //           pain_points: analysis.pain_points,
// //           strengths: analysis.strengths,
// //           recommendations: analysis.recommendations,
// //           red_flags: analysis.red_flags,
// //           deep_insights: analysis.deep_insights,
// //           cultural_insights: analysis.cultural_insights,
// //           counselor_notes: analysis.counselor_notes,
// //           analysis_version: '5.0',
// //           ai_provider: 'gemini-1.5-flash'
// //         })
// //       ]
// //     );

// //     res.status(201).json({
// //       success: true,
// //       message: 'Comprehensive relationship analysis generated successfully',
// //       data: {
// //         reportId: reportResult.rows[0].id,
// //         sessionId: sessionId,
// //         analysis: analysis,
// //         createdAt: reportResult.rows[0].created_at
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Generate AI report error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Internal server error'
// //     });
// //   }
// // };

// // const generateCoupleReport = async (req, res) => {
// //   try {
// //     const userId = req.user.id;

// //     const coupleResult = await pool.query(
// //       'SELECT id, partner_a_id, partner_b_id FROM couples WHERE partner_a_id = $1 OR partner_b_id = $1',
// //       [userId]
// //     );

// //     if (coupleResult.rows.length === 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'You need to be paired with a partner to generate a couple report'
// //       });
// //     }

// //     const couple = coupleResult.rows[0];
// //     const partnerId = couple.partner_a_id === userId ? couple.partner_b_id : couple.partner_a_id;

// //     const userReportResult = await pool.query(
// //       'SELECT * FROM ai_reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
// //       [userId]
// //     );

// //     const partnerReportResult = await pool.query(
// //       'SELECT * FROM ai_reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
// //       [partnerId]
// //     );

// //     if (userReportResult.rows.length === 0 || partnerReportResult.rows.length === 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Both partners need to complete the questionnaire and generate individual reports first'
// //       });
// //     }

// //     const existingCoupleReport = await pool.query(
// //       'SELECT id FROM relationsync_reflections WHERE couple_id = $1',
// //       [couple.id]
// //     );

// //     if (existingCoupleReport.rows.length > 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Couple report already exists'
// //       });
// //     }

// //     const userReport = userReportResult.rows[0];
// //     const partnerReport = partnerReportResult.rows[0];

// //     const userReportData = {
// //       ...userReport,
// //       ...userReport.report_json
// //     };
// //     const partnerReportData = {
// //       ...partnerReport,
// //       ...partnerReport.report_json
// //     };

// //     const coupleAnalysis = await generateCoupleAnalysis(userReportData, partnerReportData);

// //     const coupleReportResult = await pool.query(
// //       `INSERT INTO relationsync_reflections (
// //         couple_id, report_summary, direct_messages, insight_points, compatibility_level
// //       ) VALUES ($1, $2, $3, $4, $5)
// //       RETURNING id, created_at`,
// //       [
// //         couple.id,
// //         coupleAnalysis.couple_summary,
// //         JSON.stringify(coupleAnalysis.partner_messages),
// //         JSON.stringify(coupleAnalysis),
// //         coupleAnalysis.compatibility_level
// //       ]
// //     );

// //     res.status(201).json({
// //       success: true,
// //       message: 'Couple report generated successfully',
// //       data: {
// //         reportId: coupleReportResult.rows[0].id,
// //         coupleId: couple.id,
// //         analysis: coupleAnalysis,
// //         createdAt: coupleReportResult.rows[0].created_at
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Generate couple report error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Internal server error'
// //     });
// //   }
// // };

// // const getReport = async (req, res) => {
// //   try {
// //     const userId = req.user.id;

// //     const reportResult = await pool.query(
// //       `SELECT ar.*, uqs.session_name 
// //        FROM ai_reports ar
// //        JOIN user_questionnaire_sessions uqs ON ar.session_id = uqs.id
// //        WHERE ar.user_id = $1
// //        ORDER BY ar.created_at DESC
// //        LIMIT 1`,
// //       [userId]
// //     );

// //     if (reportResult.rows.length === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'No report found for this user'
// //       });
// //     }

// //     const report = reportResult.rows[0];
// //     const reportData = report.report_json || {};

// //     res.json({
// //       success: true,
// //       data: {
// //         reportId: report.id,
// //         sessionId: report.session_id,
// //         analysis: {
// //           emotional_summary: report.emotional_summary,
// //           emotional_tags: report.emotional_tags,
// //           communication_score: report.communication_score,
// //           emotional_burden_score: report.emotional_burden_score,
// //           love_language_estimate: report.love_language_estimate,
// //           trust_score: reportData.trust_score,
// //           intimacy_score: reportData.intimacy_score,
// //           conflict_resolution_score: reportData.conflict_resolution_score,
// //           future_alignment_score: reportData.future_alignment_score,
// //           family_influence_score: reportData.family_influence_score,
// //           cultural_adaptation_score: reportData.cultural_adaptation_score,
// //           pain_points: reportData.pain_points || [],
// //           strengths: reportData.strengths || [],
// //           recommendations: reportData.recommendations || [],
// //           red_flags: reportData.red_flags || [],
// //           deep_insights: reportData.deep_insights || [],
// //           cultural_insights: reportData.cultural_insights || [],
// //           counselor_notes: reportData.counselor_notes || []
// //         },
// //         createdAt: report.created_at
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Get report error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Internal server error'
// //     });
// //   }
// // };

// // const getCoupleReport = async (req, res) => {
// //   try {
// //     const userId = req.user.id;

// //     const coupleResult = await pool.query(
// //       'SELECT id FROM couples WHERE partner_a_id = $1 OR partner_b_id = $1',
// //       [userId]
// //     );

// //     if (coupleResult.rows.length === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'No couple connection found'
// //       });
// //     }

// //     const coupleId = coupleResult.rows[0].id;

// //     const reportResult = await pool.query(
// //       'SELECT * FROM relationsync_reflections WHERE couple_id = $1 ORDER BY created_at DESC LIMIT 1',
// //       [coupleId]
// //     );

// //     if (reportResult.rows.length === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'No couple report found'
// //       });
// //     }

// //     const report = reportResult.rows[0];

// //     res.json({
// //       success: true,
// //       data: {
// //         reportId: report.id,
// //         coupleId: coupleId,
// //         analysis: report.insight_points,
// //         createdAt: report.created_at
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Get couple report error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Internal server error'
// //     });
// //   }
// // };

// // module.exports = {
// //   generateReport,
// //   getReport,
// //   generateCoupleReport,
// //   getCoupleReport
// // };
// const axios = require('axios');
// const dotenv = require('dotenv');
// const pool = require('../db');
// dotenv.config();

// const API_KEY = process.env.GEMINI_API_KEY;

// const generateEnhancedMockAnalysis = async (responses) => {
//   const emotionalTags = [];
//   const painPoints = [];
//   const strengths = [];
//   const recommendations = [];
//   const redFlags = [];
//   const deepInsights = [];
//   const culturalInsights = [];
//   const counselorNotes = [];

//   // Initialize scoring with realistic baselines
//   let communicationScore = 6.5;
//   let emotionalBurdenScore = 5.5;
//   let trustScore = 7.0;
//   let intimacyScore = 6.0;
//   let conflictResolutionScore = 6.2;
//   let futureAlignmentScore = 6.8;
//   let familyInfluenceScore = 7.0;
//   let culturalAdaptationScore = 6.5;

//   // Separate text-based and rating/choice-based responses
//   const textResponses = responses.filter(r => r.type === 'text' && r.answer_text);
//   const ratingChoiceResponses = responses.filter(r => r.selected_option_id || (r.type === 'scale' && r.answer_text));

//   // Decision tree for rating/choice-based answers
//   ratingChoiceResponses.forEach(response => {
//     if (response.selected_option_id && response.answer_text) {
//       const scaleValue = parseInt(response.answer_text) || 5;
//       const questionId = parseInt(response.question_id);

//       // Family influence scale (Question 6)
//       if (questionId === 6) {
//         familyInfluenceScore = scaleValue;
//         if (scaleValue >= 8) {
//           culturalInsights.push('Family has very strong influence on your relationship decisions.');
//         } else if (scaleValue <= 3) {
//           culturalInsights.push('You maintain strong independence from family influence.');
//         }
//       }

//       // Communication effectiveness
//       if ([1, 5].includes(questionId)) {
//         if (scaleValue <= 3) {
//           painPoints.push('Low communication effectiveness.');
//           communicationScore -= 1.5;
//         } else if (scaleValue >= 8) {
//           strengths.push('Strong communication foundation.');
//           communicationScore += 1.0;
//         }
//       }

//       // Trust levels
//       if ([18].includes(questionId)) {
//         if (scaleValue <= 4) {
//           redFlags.push('Significant trust and security deficits.');
//           trustScore -= 2.0;
//         }
//       }

//       // Emotional connection
//       if ([15, 21, 25].includes(questionId)) {
//         if (scaleValue <= 3) {
//           painPoints.push('Low emotional intimacy.');
//           intimacyScore -= 1.5;
//         }
//       }
//     }
//   });

//   // Ensure scores stay within realistic bounds
//   communicationScore = Math.max(1, Math.min(10, communicationScore));
//   emotionalBurdenScore = Math.max(1, Math.min(10, emotionalBurdenScore));
//   trustScore = Math.max(1, Math.min(10, trustScore));
//   intimacyScore = Math.max(1, Math.min(10, intimacyScore));
//   conflictResolutionScore = Math.max(1, Math.min(10, conflictResolutionScore));
//   futureAlignmentScore = Math.max(1, Math.min(10, futureAlignmentScore));
//   familyInfluenceScore = Math.max(1, Math.min(10, familyInfluenceScore));
//   culturalAdaptationScore = Math.max(1, Math.min(10, culturalAdaptationScore));

//   // Fallback keyword analysis for text responses
//   const fallbackTextAnalysis = () => {
//     textResponses.forEach(response => {
//       const text = response.answer_text.toLowerCase();
//       const questionId = parseInt(response.question_id);

//       if ([6, 7, 8, 9, 10].includes(questionId)) {
//         if (text.includes('family pressure') || text.includes('expectations') || text.includes('tradition')) {
//           painPoints.push('Feeling caught between family expectations and personal desires.');
//           culturalInsights.push('Family expectations shape your relationship decisions.');
//           emotionalBurdenScore += 1.5;
//         }
//         if (text.includes('boundaries') || text.includes('independent')) {
//           strengths.push('Healthy boundary-setting with family.');
//           culturalAdaptationScore += 1.0;
//         }
//       }

//       if ([26, 27, 28].includes(questionId)) {
//         if (text.includes('traditional') && text.includes('tension')) {
//           painPoints.push('Traditional gender roles create friction.');
//           culturalInsights.push('Redefining gender roles is challenging.');
//           conflictResolutionScore -= 1.0;
//         }
//         if (text.includes('balance') || text.includes('equal')) {
//           strengths.push('Navigating egalitarian partnership.');
//           culturalAdaptationScore += 1.5;
//         }
//       }

//       if ([1, 2, 3, 4, 5].includes(questionId)) {
//         if (text.includes('misunderstood') || text.includes('not heard')) {
//           painPoints.push('Feeling unheard and misunderstood.');
//           communicationScore -= 1.5;
//           counselorNotes.push('Communication style may stem from family patterns.');
//         }
//         if (text.includes('fine') && questionId === 5) {
//           painPoints.push('The "I\'m fine" pattern prevents intimacy.');
//           deepInsights.push('Saying "I\'m fine" is a learned behavior.');
//           emotionalTags.push('emotional_suppression');
//         }
//       }

//       if ([16, 17, 18, 19, 20].includes(questionId)) {
//         if (text.includes('betrayed') || text.includes('lied') || text.includes('cheated')) {
//           trustScore -= 3.0;
//           redFlags.push('Trust violations need attention.');
//           counselorNotes.push('Betrayal carries cultural shame.');
//         }
//         if (text.includes('check phone') || text.includes('suspicious')) {
//           trustScore -= 2.0;
//           redFlags.push('Surveillance indicates threat detection.');
//           deepInsights.push('Checking phones increases anxiety.');
//         }
//       }

//       if ([11, 12, 13, 14, 15].includes(questionId)) {
//         if (text.includes('lonely') || text.includes('disconnected')) {
//           intimacyScore -= 2.0;
//           emotionalTags.push('emotional_isolation');
//           painPoints.push('Emotional loneliness despite presence.');
//         }
//         if (text.includes('hide') || text.includes('mask')) {
//           intimacyScore -= 1.5;
//           painPoints.push('Hiding prevents authentic love.');
//           counselorNotes.push('Hiding blocks deep connection.');
//         }
//         if (text.includes('fear') && (text.includes('leaving') || text.includes('abandonment'))) {
//           emotionalTags.push('anxious_attachment');
//           deepInsights.push('Fear of abandonment may push partner away.');
//         }
//       }

//       if ([29, 30, 31, 32, 33].includes(questionId)) {
//         if (text.includes('shut down') || text.includes('withdraw')) {
//           conflictResolutionScore -= 2.0;
//           painPoints.push('Emotional shutdown during conflict.');
//           deepInsights.push('Shutdown is a protective response.');
//         }
//         if (text.includes('eggshells') || text.includes('avoid')) {
//           conflictResolutionScore -= 1.5;
//           painPoints.push('Walking on eggshells limits voice.');
//           deepInsights.push('Avoiding truth kills intimacy.');
//         }
//       }

//       if ([34, 35].includes(questionId)) {
//         if (text.includes('fight') || text.includes('stress')) {
//           painPoints.push('Financial stress affects security.');
//           culturalInsights.push('Financial pressures include family expectations.');
//           emotionalBurdenScore += 1.0;
//         }
//       }

//       if (text.includes('support') || text.includes('understand')) {
//         strengths.push('Capacity for emotional support.');
//         communicationScore += 0.5;
//       }
//       if (text.includes('love') || text.includes('care')) {
//         strengths.push('Maintains emotional connection.');
//         futureAlignmentScore += 0.5;
//       }
//     });
//   };

//   // Run fallback analysis to populate initial data
//   fallbackTextAnalysis();

//   // Prepare context for Gemini AI (text responses only)
//   const textResponseSummary = textResponses.map(r => ({
//     question: r.question_text,
//     answer: r.answer_text,
//     category: r.category,
//   }));

//   const scoresSummary = {
//     communication_score: communicationScore,
//     emotional_burden_score: emotionalBurdenScore,
//     trust_score: trustScore,
//     intimacy_score: intimacyScore,
//     conflict_resolution_score: conflictResolutionScore,
//     future_alignment_score: futureAlignmentScore,
//     family_influence_score: familyInfluenceScore,
//     cultural_adaptation_score: culturalAdaptationScore,
//   };

//   // Gemini AI prompt for text-based answers
//   const prompt = `
// You are an AI relationship assistant for RelationSync, a platform focused on enhancing relationships with deep understanding of Indian cultural context. Analyze the following text-based questionnaire responses to generate a comprehensive relationship report. Provide empathetic, practical, and culturally sensitive insights for Indian relationship dynamics (e.g., family influence, gender roles, emotional expression). Use the provided scores as context but do not alter them. Return a raw JSON object without Markdown or code fences.

// **Text Responses**:
// ${JSON.stringify(textResponseSummary, null, 2)}

// **Scores (for context)**:
// ${JSON.stringify(scoresSummary, null, 2)}

// **Instructions**:
// 1. **Emotional Summary**: Write a concise, empathetic summary (100-150 words) reflecting the emotional state of the relationship based on text responses and scores. Use a counselor-like tone, incorporating Indian cultural nuances.
// 2. **Pain Points**: Generate up to 8 specific pain points (short sentences) highlighting challenges from text responses, with psychological and cultural depth.
// 3. **Strengths**: Generate up to 6 strengths (short sentences) highlighting positive aspects from text responses.
// 4. **Recommendations**: Generate up to 12 actionable recommendations (short sentences) tailored to text responses and Indian context.
// 5. **Red Flags**: Generate up to 5 critical issues (short sentences) requiring immediate attention from text responses.
// 6. **Deep Insights**: Generate up to 6 psychological insights (short sentences) explaining underlying dynamics from text responses, with Indian cultural factors.
// 7. **Cultural Insights**: Generate up to 4 insights (short sentences) specific to Indian relationship dynamics from text responses.
// 8. **Counselor Notes**: Generate up to 4 notes (short sentences) as if written by a therapist, offering guidance based on text responses.

// **Output Format**:
// Return a raw JSON object (without \`\`\`json or other Markdown) with: emotional_summary, pain_points, strengths, recommendations, red_flags, deep_insights, cultural_insights, counselor_notes.
// `;

//   // Call Gemini API with retry logic
//   let aiAnalysis;
//   let attempts = 0;
//   const maxAttempts = 3;
//   while (attempts < maxAttempts) {
//     try {
//       const response = await axios.post(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
//         {
//           contents: [{ role: 'user', parts: [{ text: prompt }] }],
//         },
//         {
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );

//       let responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
//       if (!responseText) {
//         throw new Error('No response from Gemini API');
//       }

//       // Clean response to remove Markdown code fences
//       responseText = responseText.replace(/```json\n|```/g, '').trim();

//       // Log raw response for debugging
//       console.log('Gemini API raw response:', responseText);

//       // Parse cleaned response
//       aiAnalysis = JSON.parse(responseText);
//       break;
//     } catch (error) {
//       console.error('Gemini API error:', error.message);
//       if (error.response?.status === 429) {
//         attempts++;
//         if (attempts === maxAttempts) {
//           console.error('Max retry attempts reached for Gemini API');
//           aiAnalysis = {
//             emotional_summary: 'Unable to generate AI analysis due to API limits. Your relationship shows commitment but faces challenges.',
//             pain_points: painPoints.slice(0, 8),
//             strengths: strengths.slice(0, 6),
//             recommendations: [
//               'Practice active listening to improve communication.',
//               'Set clear boundaries with family members.',
//               'Schedule weekly check-ins to discuss feelings.',
//               'Address trust issues with open conversations.',
//               'Seek professional help for persistent conflicts.',
//               'Prioritize quality time to build intimacy.',
//               'Create a shared vision for your future.',
//               'Respect cultural traditions while maintaining autonomy.',
//               'Use "I" statements to express emotions.',
//               'Practice forgiveness to heal past hurts.',
//               'Learn each other’s emotional triggers.',
//               'Balance individual and couple goals.',
//             ].slice(0, 12),
//             red_flags: redFlags.slice(0, 5),
//             deep_insights: deepInsights.slice(0, 6),
//             cultural_insights: culturalInsights.slice(0, 4),
//             counselor_notes: counselorNotes.slice(0, 4),
//           };
//           break;
//         }
//         await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
//       } else {
//         console.error('Non-retryable error, falling back to default analysis');
//         aiAnalysis = {
//           emotional_summary: 'Unable to generate AI analysis due to parsing error. Your relationship shows commitment but faces challenges.',
//           pain_points: painPoints.slice(0, 8),
//           strengths: strengths.slice(0, 6),
//           recommendations: [
//             'Practice active listening to improve communication.',
//             'Set clear boundaries with family members.',
//             'Schedule weekly check-ins to discuss feelings.',
//             'Address trust issues with open conversations.',
//             'Seek professional help for persistent conflicts.',
//             'Prioritize quality time to build intimacy.',
//             'Create a shared vision for your future.',
//             'Respect cultural traditions while maintaining autonomy.',
//             'Use "I" statements to express emotions.',
//             'Practice forgiveness to heal past hurts.',
//             'Learn each other’s emotional triggers.',
//             'Balance individual and couple goals.',
//           ].slice(0, 12),
//           red_flags: redFlags.slice(0, 5),
//           deep_insights: deepInsights.slice(0, 6),
//           cultural_insights: culturalInsights.slice(0, 4),
//           counselor_notes: counselorNotes.slice(0, 4),
//         };
//         break;
//       }
//     }
//   }

//   // Add default recommendations based on scores
//   const allRecommendations = [
//     'Practice the "Speaker-Listener Technique" for better communication.',
//     'Create a daily "connection ritual" of 15 minutes.',
//     'Use "I" statements instead of accusations.',
//     'Rebuild trust through consistent small actions.',
//     'Set respectful boundaries with family.',
//     'Create a united front for family pressures.',
//     'Try the "Daily Appreciation Practice".',
//     'Practice "Emotional Mirroring" in conversations.',
//     'Learn to "Take a Break" during conflicts.',
//     'Practice "Fighting Fair" without past issues.',
//     'Schedule monthly "Vision Meetings" for goals.',
//     'Celebrate progress together as a couple.',
//   ];

//   if (communicationScore < 6) recommendations.push(...allRecommendations.slice(0, 3));
//   if (trustScore < 6) recommendations.push(...allRecommendations.slice(3, 4));
//   if (familyInfluenceScore > 7.5 || culturalAdaptationScore < 6) recommendations.push(...allRecommendations.slice(4, 6));
//   if (intimacyScore < 6) recommendations.push(...allRecommendations.slice(6, 8));
//   if (conflictResolutionScore < 6) recommendations.push(...allRecommendations.slice(8, 10));
//   if (futureAlignmentScore < 6) recommendations.push(...allRecommendations.slice(10, 12));

//   // Add default cultural insights if none
//   if (culturalInsights.length === 0) {
//     culturalInsights.push('Navigating modern Indian relationships involves balancing tradition and personal choice.');
//   }

//   // Add default strengths if none
//   if (strengths.length === 0) {
//     strengths.push('Your willingness to examine your relationship shows maturity.');
//   }

//   // Generate love language
//   const loveLanguages = ['Words of Affirmation', 'Quality Time', 'Physical Touch', 'Acts of Service', 'Receiving Gifts'];
//   const loveLanguage = loveLanguages[Math.floor(Math.random() * loveLanguages.length)];

//   // Merge AI and decision tree outputs
//   return {
//     emotional_summary: aiAnalysis.emotional_summary,
//     emotional_tags: [...new Set(emotionalTags)],
//     communication_score: Math.round(communicationScore * 10) / 10,
//     emotional_burden_score: Math.round(emotionalBurdenScore * 10) / 10,
//     trust_score: Math.round(trustScore * 10) / 10,
//     intimacy_score: Math.round(intimacyScore * 10) / 10,
//     conflict_resolution_score: Math.round(conflictResolutionScore * 10) / 10,
//     future_alignment_score: Math.round(futureAlignmentScore * 10) / 10,
//     family_influence_score: Math.round(familyInfluenceScore * 10) / 10,
//     cultural_adaptation_score: Math.round(culturalAdaptationScore * 10) / 10,
//     love_language_estimate: loveLanguage,
//     pain_points: aiAnalysis.pain_points.slice(0, 8),
//     strengths: [...new Set([...strengths, ...aiAnalysis.strengths])].slice(0, 6),
//     recommendations: [...new Set([...recommendations, ...aiAnalysis.recommendations])].slice(0, 12),
//     red_flags: aiAnalysis.red_flags.slice(0, 5),
//     deep_insights: aiAnalysis.deep_insights.slice(0, 6),
//     cultural_insights: [...new Set([...culturalInsights, ...aiAnalysis.cultural_insights])].slice(0, 4),
//     counselor_notes: aiAnalysis.counselor_notes.slice(0, 4),
//   };
// };

// const generateCoupleAnalysis = async (userReport, partnerReport) => {
//   // Calculate compatibility scores
//   const compatibilityScore = Math.round(((
//     (userReport.communication_score + partnerReport.communication_score) / 2 +
//     (userReport.trust_score + partnerReport.trust_score) / 2 +
//     (userReport.intimacy_score + partnerReport.intimacy_score) / 2 +
//     (userReport.conflict_resolution_score + partnerReport.conflict_resolution_score) / 2 +
//     (userReport.future_alignment_score + partnerReport.future_alignment_score) / 2
//   ) / 5) * 10) / 10;

//   const communicationHarmony = Math.round(((userReport.communication_score + partnerReport.communication_score) / 2) * 10) / 10;
//   const trustAlignment = Math.round(((userReport.trust_score + partnerReport.trust_score) / 2) * 10) / 10;
//   const intimacyBalance = Math.round(((userReport.intimacy_score + partnerReport.intimacy_score) / 2) * 10) / 10;
//   const conflictResolutionStyle = Math.round(((userReport.conflict_resolution_score + partnerReport.conflict_resolution_score) / 2) * 10) / 10;
//   const futureVisionAlignment = Math.round(((userReport.future_alignment_score + partnerReport.future_alignment_score) / 2) * 10) / 10;
//   const culturalAdaptationSync = Math.round(((userReport.cultural_adaptation_score + partnerReport.cultural_adaptation_score) / 2) * 10) / 10;

//   // Determine compatibility level
//   let compatibilityLevel = 'Good';
//   if (compatibilityScore >= 8.5) compatibilityLevel = 'Excellent';
//   else if (compatibilityScore >= 7.5) compatibilityLevel = 'Very Good';
//   else if (compatibilityScore >= 6.5) compatibilityLevel = 'Good';
//   else if (compatibilityScore >= 5.5) compatibilityLevel = 'Fair';
//   else compatibilityLevel = 'Needs Work';

//   // Prepare data for Gemini AI
//   const coupleData = {
//     partner_a: {
//       emotional_summary: userReport.emotional_summary,
//       emotional_tags: userReport.emotional_tags,
//       pain_points: userReport.pain_points,
//       strengths: userReport.strengths,
//       recommendations: userReport.recommendations,
//       red_flags: userReport.red_flags,
//       deep_insights: userReport.deep_insights,
//       cultural_insights: userReport.cultural_insights,
//       counselor_notes: userReport.counselor_notes,
//       scores: {
//         communication_score: userReport.communication_score,
//         emotional_burden_score: userReport.emotional_burden_score,
//         trust_score: userReport.trust_score,
//         intimacy_score: userReport.intimacy_score,
//         conflict_resolution_score: userReport.conflict_resolution_score,
//         future_alignment_score: userReport.future_alignment_score,
//         family_influence_score: userReport.family_influence_score,
//         cultural_adaptation_score: userReport.cultural_adaptation_score,
//       }
//     },
//     partner_b: {
//       emotional_summary: partnerReport.emotional_summary,
//       emotional_tags: partnerReport.emotional_tags,
//       pain_points: partnerReport.pain_points,
//       strengths: partnerReport.strengths,
//       recommendations: partnerReport.recommendations,
//       red_flags: partnerReport.red_flags,
//       deep_insights: partnerReport.deep_insights,
//       cultural_insights: partnerReport.cultural_insights,
//       counselor_notes: partnerReport.counselor_notes,
//       scores: {
//         communication_score: partnerReport.communication_score,
//         emotional_burden_score: partnerReport.emotional_burden_score,
//         trust_score: partnerReport.trust_score,
//         intimacy_score: partnerReport.intimacy_score,
//         conflict_resolution_score: partnerReport.conflict_resolution_score,
//         future_alignment_score: partnerReport.future_alignment_score,
//         family_influence_score: partnerReport.family_influence_score,
//         cultural_adaptation_score: partnerReport.cultural_adaptation_score,
//       }
//     },
//     couple_scores: {
//       compatibility_score,
//       communication_harmony,
//       trust_alignment,
//       intimacy_balance,
//       conflict_resolution_style,
//       future_vision_alignment,
//       cultural_adaptation_sync
//     }
//   };

//   // Gemini AI prompt for couple analysis
//   const prompt = `
// You are an AI relationship assistant for RelationSync, a platform focused on enhancing relationships with deep understanding of Indian cultural context. Analyze the following reports for two partners to generate a comprehensive couple relationship report. Provide empathetic, practical, and culturally sensitive insights for Indian relationship dynamics (e.g., family influence, gender roles, emotional expression). Use the provided couple scores and individual reports as context to create realistic, dynamic insights. Return a raw JSON object without Markdown or code fences.

// **Couple Data**:
// ${JSON.stringify(coupleData, null, 2)}

// **Instructions**:
// 1. **Couple Summary**: Write a concise, empathetic summary (100-150 words) reflecting the couple's relationship dynamics based on both partners' reports and couple scores. Use a counselor-like tone, incorporating Indian cultural nuances.
// 2. **Shared Strengths**: Generate up to 6 strengths (short sentences) highlighting positive aspects of the couple's relationship, based on both partners' reports.
// 3. **Growth Areas**: Generate up to 6 growth areas (short sentences) identifying challenges the couple faces, with psychological and cultural depth.
// 4. **Couple Recommendations**: Generate up to 10 actionable recommendations (short sentences) tailored to the couple's dynamics and Indian context.
// 5. **Relationship Insights**: Generate up to 6 psychological insights (short sentences) explaining underlying couple dynamics, with Indian cultural factors.
// 6. **Partner Messages**: Generate two messages (50-70 words each), one from Partner A to Partner B and one from Partner B to Partner A, expressing empathy and commitment based on their reports.

// **Output Format**:
// Return a raw JSON object (without \`\`\`json or other Markdown) with: couple_summary, shared_strengths, growth_areas, couple_recommendations, relationship_insights, partner_messages (object with to_partner_a and to_partner_b).
// `;

//   // Call Gemini API with retry logic
//   let aiCoupleAnalysis;
//   let attempts = 0;
//   const maxAttempts = 3;
//   while (attempts < maxAttempts) {
//     try {
//       const response = await axios.post(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
//         {
//           contents: [{ role: 'user', parts: [{ text: prompt }] }],
//         },
//         {
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );

//       let responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
//       if (!responseText) {
//         throw new Error('No response from Gemini API');
//       }

//       // Clean response to remove Markdown code fences
//       responseText = responseText.replace(/```json\n|```/g, '').trim();

//       // Log raw response for debugging
//       console.log('Gemini API raw response (couple analysis):', responseText);

//       // Parse cleaned response
//       aiCoupleAnalysis = JSON.parse(responseText);
//       break;
//     } catch (error) {
//       console.error('Gemini API error for couple analysis:', error.message);
//       if (error.response?.status === 429) {
//         attempts++;
//         if (attempts === maxAttempts) {
//           console.error('Max retry attempts reached for Gemini API (couple analysis)');
//           aiCoupleAnalysis = {
//             couple_summary: 'Your relationship shows commitment but faces challenges due to API limits. Please try again later.',
//             shared_strengths: [
//               'Both partners show commitment to understanding and improving the relationship',
//               'You share similar values about the importance of emotional connection',
//               'There\'s mutual respect for each other\'s perspectives and feelings',
//               'Both of you are willing to work on personal growth for the relationship',
//               'You have complementary strengths that balance each other well',
//               'Strong foundation of care and affection despite current challenges'
//             ],
//             growth_areas: [
//               'Developing more effective communication patterns during disagreements',
//               'Building stronger emotional intimacy through vulnerability and openness',
//               'Creating better work-life balance to prioritize relationship time',
//               'Aligning expectations about family involvement and boundaries',
//               'Improving conflict resolution skills to prevent escalation',
//               'Strengthening trust through consistent actions and transparency'
//             ],
//             couple_recommendations: [
//               'Schedule weekly "relationship meetings" to discuss both appreciations and concerns in a structured way',
//               'Practice the "5:1 ratio" - for every criticism or complaint, share five positive observations about your partner',
//               'Create a "relationship vision board" together - visualize your shared future and goals as a couple',
//               'Implement a "24-hour rule" for major decisions - discuss important choices together before acting',
//               'Establish "his time, her time, and our time" - balance individual needs with couple connection',
//               'Practice "emotional check-ins" - ask "How are you feeling about us?" regularly',
//               'Create rituals for connection: daily appreciation, weekly dates, monthly relationship reviews',
//               'Learn each other\'s "emotional triggers" and develop strategies to support during difficult moments',
//               'Practice "repair attempts" during conflicts - use humor, affection, or acknowledgment to de-escalate',
//               'Develop a "couple mission statement" - define your shared values and purpose together'
//             ],
//             relationship_insights: [
//               'Your relationship patterns show both individual growth needs and couple dynamics that can be transformed with awareness',
//               'The cultural context of your relationship adds both richness and complexity - honoring tradition while creating your own path',
//               'Your different communication styles can become a strength when you learn to bridge the gap with understanding',
//               'The emotional patterns you\'ve developed are protective but may be limiting your capacity for deeper intimacy',
//               'Your relationship has the potential for profound growth when both partners feel safe to be vulnerable',
//               'The family influences in your relationship require careful navigation to maintain both respect and autonomy'
//             ],
//             partner_messages: {
//               to_partner_a: 'I see how much you care about our relationship and how hard you\'re trying. I want you to know that your efforts don\'t go unnoticed, and I\'m committed to growing together with you. Let\'s create the love story we both deserve.',
//               to_partner_b: 'Your patience and understanding mean everything to me. I know I\'m not perfect, but I want to be the partner you need. Thank you for believing in us and for being willing to work through our challenges together.'
//             }
//           };
//           break;
//         }
//         await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
//       } else {
//         console.error('Non-retryable error for couple analysis, falling back to default');
//         aiCoupleAnalysis = {
//           couple_summary: 'Your relationship shows commitment but faces challenges due to API limits. Please try again later.',
//           shared_strengths: [
//             'Both partners show commitment to understanding and improving the relationship',
//             'You share similar values about the importance of emotional connection',
//             'There\'s mutual respect for each other\'s perspectives and feelings',
//             'Both of you are willing to work on personal growth for the relationship',
//             'You have complementary strengths that balance each other well',
//             'Strong foundation of care and affection despite current challenges'
//           ],
//           growth_areas: [
//             'Developing more effective communication patterns during disagreements',
//             'Building stronger emotional intimacy through vulnerability and openness',
//             'Creating better work-life balance to prioritize relationship time',
//             'Aligning expectations about family involvement and boundaries',
//             'Improving conflict resolution skills to prevent escalation',
//             'Strengthening trust through consistent actions and transparency'
//           ],
//           couple_recommendations: [
//             'Schedule weekly "relationship meetings" to discuss both appreciations and concerns in a structured way',
//             'Practice the "5:1 ratio" - for every criticism or complaint, share five positive observations about your partner',
//             'Create a "relationship vision board" together - visualize your shared future and goals as a couple',
//             'Implement a "24-hour rule" for major decisions - discuss important choices together before acting',
//             'Establish "his time, her time, and our time" - balance individual needs with couple connection',
//             'Practice "emotional check-ins" - ask "How are you feeling about us?" regularly',
//             'Create rituals for connection: daily appreciation, weekly dates, monthly relationship reviews',
//             'Learn each other\'s "emotional triggers" and develop strategies to support during difficult moments',
//             'Practice "repair attempts" during conflicts - use humor, affection, or acknowledgment to de-escalate',
//             'Develop a "couple mission statement" - define your shared values and purpose together'
//           ],
//           relationship_insights: [
//             'Your relationship patterns show both individual growth needs and couple dynamics that can be transformed with awareness',
//             'The cultural context of your relationship adds both richness and complexity - honoring tradition while creating your own path',
//             'Your different communication styles can become a strength when you learn to bridge the gap with understanding',
//             'The emotional patterns you\'ve developed are protective but may be limiting your capacity for deeper intimacy',
//             'Your relationship has the potential for profound growth when both partners feel safe to be vulnerable',
//             'The family influences in your relationship require careful navigation to maintain both respect and autonomy'
//           ],
//           partner_messages: {
//             to_partner_a: 'I see how much you care about our relationship and how hard you\'re trying. I want you to know that your efforts don\'t go unnoticed, and I\'m committed to growing together with you. Let\'s create the love story we both deserve.',
//             to_partner_b: 'Your patience and understanding mean everything to me. I know I\'m not perfect, but I want to be the partner you need. Thank you for believing in us and for being willing to work through our challenges together.'
//           }
//         };
//         break;
//       }
//     }
//   }

//   return {
//     compatibility_score: compatibilityScore,
//     communication_harmony: communicationHarmony,
//     trust_alignment: trustAlignment,
//     intimacy_balance: intimacyBalance,
//     conflict_resolution_style: conflictResolutionStyle,
//     future_vision_alignment: futureVisionAlignment,
//     cultural_adaptation_sync: culturalAdaptationSync,
//     compatibility_level: compatibilityLevel,
//     shared_strengths: aiCoupleAnalysis.shared_strengths.slice(0, 6),
//     growth_areas: aiCoupleAnalysis.growth_areas.slice(0, 6),
//     couple_recommendations: aiCoupleAnalysis.couple_recommendations.slice(0, 10),
//     relationship_insights: aiCoupleAnalysis.relationship_insights.slice(0, 6),
//     partner_messages: aiCoupleAnalysis.partner_messages,
//     couple_summary: aiCoupleAnalysis.couple_summary
//   };
// };

// const generateReport = async (req, res) => {
//   try {
//     const { sessionId } = req.params;
//     const userId = req.user.id;

//     // Verify session belongs to user and is completed
//     const sessionResult = await pool.query(
//       'SELECT id, status FROM user_questionnaire_sessions WHERE id = $1 AND user_id = $2 AND status = $3',
//       [sessionId, userId, 'completed']
//     );

//     if (sessionResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Completed questionnaire session not found'
//       });
//     }

//     // Check if report already exists
//     const existingReport = await pool.query(
//       'SELECT id FROM ai_reports WHERE session_id = $1',
//       [sessionId]
//     );

//     if (existingReport.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Report already generated for this session'
//       });
//     }

//     // Get all responses for this session with question details
//     const responsesResult = await pool.query(
//       `SELECT qr.*, q.question_text, q.type, qc.name as category, qo.option_text
//        FROM question_responses qr
//        JOIN questions q ON qr.question_id = q.id
//        JOIN question_categories qc ON q.category_id = qc.id
//        LEFT JOIN question_options qo ON qr.selected_option_id = qo.id
//        WHERE qr.session_id = $1
//        ORDER BY q.priority`,
//       [sessionId]
//     );

//     const responses = responsesResult.rows;

//     if (responses.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No responses found for this session'
//       });
//     }

//     console.log('🧠 Generating enhanced psychological analysis with Indian cultural context');
//     const analysis = await generateEnhancedMockAnalysis(responses);

//     const communicationScoreInt = Math.round(analysis.communication_score);
//     const emotionalBurdenScoreInt = Math.round(analysis.emotional_burden_score);

//     const reportResult = await pool.query(
//       `INSERT INTO ai_reports (
//         session_id, user_id, emotional_summary, emotional_tags,
//         communication_score, emotional_burden_score, love_language_estimate,
//         report_json
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//       RETURNING id, created_at`,
//       [
//         sessionId,
//         userId,
//         analysis.emotional_summary,
//         analysis.emotional_tags,
//         communicationScoreInt,
//         emotionalBurdenScoreInt,
//         analysis.love_language_estimate,
//         JSON.stringify({
//           trust_score: analysis.trust_score,
//           intimacy_score: analysis.intimacy_score,
//           conflict_resolution_score: analysis.conflict_resolution_score,
//           future_alignment_score: analysis.future_alignment_score,
//           family_influence_score: analysis.family_influence_score,
//           cultural_adaptation_score: analysis.cultural_adaptation_score,
//           pain_points: analysis.pain_points,
//           strengths: analysis.strengths,
//           recommendations: analysis.recommendations,
//           red_flags: analysis.red_flags,
//           deep_insights: analysis.deep_insights,
//           cultural_insights: analysis.cultural_insights,
//           counselor_notes: analysis.counselor_notes,
//           analysis_version: '5.0',
//           ai_provider: 'gemini-1.5-flash'
//         })
//       ]
//     );

//     res.status(201).json({
//       success: true,
//       message: 'Comprehensive relationship analysis generated successfully',
//       data: {
//         reportId: reportResult.rows[0].id,
//         sessionId: sessionId,
//         analysis: analysis,
//         createdAt: reportResult.rows[0].created_at
//       }
//     });
//   } catch (error) {
//     console.error('Generate AI report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// const getReport = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const reportResult = await pool.query(
//       `SELECT ar.*, uqs.session_name 
//        FROM ai_reports ar
//        JOIN user_questionnaire_sessions uqs ON ar.session_id = uqs.id
//        WHERE ar.user_id = $1
//        ORDER BY ar.created_at DESC
//        LIMIT 1`,
//       [userId]
//     );

//     if (reportResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No report found for this user'
//       });
//     }

//     const report = reportResult.rows[0];
//     const reportData = report.report_json || {};

//     res.json({
//       success: true,
//       data: {
//         reportId: report.id,
//         sessionId: report.session_id,
//         analysis: {
//           emotional_summary: report.emotional_summary,
//           emotional_tags: report.emotional_tags,
//           communication_score: report.communication_score,
//           emotional_burden_score: report.emotional_burden_score,
//           love_language_estimate: report.love_language_estimate,
//           trust_score: reportData.trust_score,
//           intimacy_score: reportData.intimacy_score,
//           conflict_resolution_score: reportData.conflict_resolution_score,
//           future_alignment_score: reportData.future_alignment_score,
//           family_influence_score: reportData.family_influence_score,
//           cultural_adaptation_score: reportData.cultural_adaptation_score,
//           pain_points: reportData.pain_points || [],
//           strengths: reportData.strengths || [],
//           recommendations: reportData.recommendations || [],
//           red_flags: reportData.red_flags || [],
//           deep_insights: reportData.deep_insights || [],
//           cultural_insights: reportData.cultural_insights || [],
//           counselor_notes: reportData.counselor_notes || []
//         },
//         createdAt: report.created_at
//       }
//     });
//   } catch (error) {
//     console.error('Get report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// const generateCoupleReport = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const coupleResult = await pool.query(
//       'SELECT id, partner_a_id, partner_b_id FROM couples WHERE partner_a_id = $1 OR partner_b_id = $1',
//       [userId]
//     );

//     if (coupleResult.rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'You need to be paired with a partner to generate a couple report'
//       });
//     }

//     const couple = coupleResult.rows[0];
//     const partnerId = couple.partner_a_id === userId ? couple.partner_b_id : couple.partner_a_id;

//     const userReportResult = await pool.query(
//       'SELECT * FROM ai_reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
//       [userId]
//     );

//     const partnerReportResult = await pool.query(
//       'SELECT * FROM ai_reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
//       [partnerId]
//     );

//     if (userReportResult.rows.length === 0 || partnerReportResult.rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Both partners need to complete the questionnaire and generate individual reports first'
//       });
//     }

//     const existingCoupleReport = await pool.query(
//       'SELECT id FROM relationsync_reflections WHERE couple_id = $1',
//       [couple.id]
//     );

//     if (existingCoupleReport.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Couple report already exists'
//       });
//     }

//     const userReport = userReportResult.rows[0];
//     const partnerReport = partnerReportResult.rows[0];

//     const userReportData = {
//       ...userReport,
//       ...userReport.report_json
//     };
//     const partnerReportData = {
//       ...partnerReport,
//       ...partnerReport.report_json
//     };

//     const coupleAnalysis = await generateCoupleAnalysis(userReportData, partnerReportData);

//     const coupleReportResult = await pool.query(
//       `INSERT INTO relationsync_reflections (
//         couple_id, report_summary, direct_messages, insight_points, compatibility_level
//       ) VALUES ($1, $2, $3, $4, $5)
//       RETURNING id, created_at`,
//       [
//         couple.id,
//         coupleAnalysis.couple_summary,
//         JSON.stringify(coupleAnalysis.partner_messages),
//         JSON.stringify(coupleAnalysis),
//         coupleAnalysis.compatibility_level
//       ]
//     );

//     res.status(201).json({
//       success: true,
//       message: 'Couple report generated successfully',
//       data: {
//         reportId: coupleReportResult.rows[0].id,
//         coupleId: couple.id,
//         analysis: coupleAnalysis,
//         createdAt: coupleReportResult.rows[0].created_at
//       }
//     });
//   } catch (error) {
//     console.error('Generate couple report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// const getCoupleReport = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const coupleResult = await pool.query(
//       'SELECT id FROM couples WHERE partner_a_id = $1 OR partner_b_id = $1',
//       [userId]
//     );

//     if (coupleResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No couple connection found'
//       });
//     }

//     const coupleId = coupleResult.rows[0].id;

//     const reportResult = await pool.query(
//       'SELECT * FROM relationsync_reflections WHERE couple_id = $1 ORDER BY created_at DESC LIMIT 1',
//       [coupleId]
//     );

//     if (reportResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No couple report found'
//       });
//     }

//     const report = reportResult.rows[0];

//     res.json({
//       success: true,
//       data: {
//         reportId: report.id,
//         coupleId: coupleId,
//         analysis: report.insight_points,
//         createdAt: report.created_at
//       }
//     });
//   } catch (error) {
//     console.error('Get couple report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// module.exports = {
//   generateReport,
//   getReport,
//   generateCoupleReport,
//   getCoupleReport
// // };
// const axios = require('axios');
// const dotenv = require('dotenv');
// const pool = require('../db');
// dotenv.config();

// const API_KEY = process.env.GEMINI_API_KEY;

// const generateEnhancedMockAnalysis = async (responses) => {
//   // Initialize scoring with realistic baselines for rating-based analysis
//   let communicationScore = 6.5;
//   let emotionalBurdenScore = 5.5;
//   let trustScore = 7.0;
//   let intimacyScore = 6.0;
//   let conflictResolutionScore = 6.2;
//   let futureAlignmentScore = 6.8;
//   let familyInfluenceScore = 7.0;
//   let culturalAdaptationScore = 6.5;

//   // Separate rating-based and text/multiple-choice responses
//   const ratingResponses = responses.filter(r => r.type === 'scale' && r.answer_text);
//   const textAndChoiceResponses = responses.filter(r => (r.type === 'text' && r.answer_text) || (r.type === 'multiple_choice' && r.selected_option_id && r.option_text));

//   // Decision tree for rating-based answers (retained pseudo-AI)
//   ratingResponses.forEach(response => {
//     const scaleValue = parseInt(response.answer_text) || 5;
//     const questionId = parseInt(response.question_id);

//     // Family influence scale (Question 6)
//     if (questionId === 6) {
//       familyInfluenceScore = scaleValue;
//     }

//     // Communication effectiveness
//     if ([1, 5].includes(questionId)) {
//       if (scaleValue <= 3) {
//         communicationScore -= 1.5;
//       } else if (scaleValue >= 8) {
//         communicationScore += 1.0;
//       }
//     }

//     // Trust levels
//     if ([18].includes(questionId)) {
//       if (scaleValue <= 4) {
//         trustScore -= 2.0;
//       }
//     }

//     // Emotional connection
//     if ([15, 21, 25].includes(questionId)) {
//       if (scaleValue <= 3) {
//         intimacyScore -= 1.5;
//       }
//     }
//   });

//   // Ensure scores stay within realistic bounds
//   communicationScore = Math.max(1, Math.min(10, communicationScore));
//   emotionalBurdenScore = Math.max(1, Math.min(10, emotionalBurdenScore));
//   trustScore = Math.max(1, Math.min(10, trustScore));
//   intimacyScore = Math.max(1, Math.min(10, intimacyScore));
//   conflictResolutionScore = Math.max(1, Math.min(10, conflictResolutionScore));
//   futureAlignmentScore = Math.max(1, Math.min(10, futureAlignmentScore));
//   familyInfluenceScore = Math.max(1, Math.min(10, familyInfluenceScore));
//   culturalAdaptationScore = Math.max(1, Math.min(10, culturalAdaptationScore));

//   // Prepare context for Gemini AI (text and multiple-choice responses)
//   const responseSummary = textAndChoiceResponses.map(r => ({
//     question_id: r.question_id,
//     question: r.question_text,
//     answer: r.type === 'text' ? r.answer_text : r.option_text,
//     category: r.category,
//     type: r.type
//   }));

//   const scoresSummary = {
//     communication_score: communicationScore,
//     emotional_burden_score: emotionalBurdenScore,
//     trust_score: trustScore,
//     intimacy_score: intimacyScore,
//     conflict_resolution_score: conflictResolutionScore,
//     future_alignment_score: futureAlignmentScore,
//     family_influence_score: familyInfluenceScore,
//     cultural_adaptation_score: culturalAdaptationScore,
//   };

//   // Detailed Gemini AI prompt for text and multiple-choice answers
//   const prompt = `
// You are an AI relationship assistant for RelationSync, a platform dedicated to enhancing relationships with a deep understanding of Indian cultural context. Your task is to analyze the provided text-based and multiple-choice questionnaire responses to generate a comprehensive, psychologically insightful, and culturally sensitive relationship report. The report should reflect the nuances of Indian relationship dynamics, such as family influence, gender roles, emotional expression, and societal expectations. Use the provided scores as context but do not alter them. Return a raw JSON object without Markdown or code fences.

// **Responses**:
// ${JSON.stringify(responseSummary, null, 2)}

// **Scores (for context)**:
// ${JSON.stringify(scoresSummary, null, 2)}

// **Instructions**:
// 1. **Emotional Summary**: Craft a concise, empathetic summary (100-150 words) of the relationship's emotional state, integrating themes from text and multiple-choice responses. Use a compassionate, counselor-like tone, addressing Indian cultural nuances (e.g., family pressures, collectivist values).
// 2. **Pain Points**: Identify up to 8 specific challenges (short sentences) derived from responses, focusing on psychological and cultural depth (e.g., emotional suppression due to societal norms, trust issues from past betrayals).
// 3. **Strengths**: Highlight up to 6 positive aspects (short sentences) of the relationship, emphasizing resilience, mutual support, or cultural adaptability.
// 4. **Recommendations**: Provide up to 12 actionable, practical recommendations (short sentences) tailored to the responses and Indian context, addressing communication, trust, intimacy, conflict resolution, and family dynamics.
// 5. **Red Flags**: List up to 5 critical issues (short sentences) requiring immediate attention, such as trust violations or emotional disconnection, with cultural sensitivity.
// 6. **Deep Insights**: Generate up to 6 psychological insights (short sentences) explaining underlying dynamics (e.g., anxious attachment, cultural shame), grounded in Indian relationship patterns.
// 7. **Cultural Insights**: Provide up to 4 insights (short sentences) specific to Indian dynamics, such as navigating joint family expectations or balancing tradition with modernity.
// 8. **Counselor Notes**: Offer up to 4 therapist-like notes (short sentences) providing guidance based on responses, focusing on actionable steps for growth.
// 9. **Emotional Tags**: Assign up to 5 emotional tags (e.g., "emotional_isolation", "anxious_attachment") based on response patterns, reflecting psychological states.
// 10. **Love Language Estimate**: Estimate the primary love language (Words of Affirmation, Quality Time, Physical Touch, Acts of Service, Receiving Gifts) based on responses, prioritizing emotional connection indicators.

// **Guidelines**:
// - Ensure all insights are empathetic, non-judgmental, and culturally relevant to Indian relationships.
// - Avoid generic or vague outputs; insights must be specific to the provided responses.
// - Balance modern and traditional perspectives, acknowledging urban Indian contexts and family-oriented values.
// - Use the scores as a reference to contextualize the analysis but focus on responses for narrative content.
// - Prioritize psychological depth, addressing attachment styles, emotional triggers, and cultural influences.

// **Output Format**:
// Return a raw JSON object with: emotional_summary, pain_points, strengths, recommendations, red_flags, deep_insights, cultural_insights, counselor_notes, emotional_tags, love_language_estimate.
// `;

//   // Call Gemini API with retry logic
//   let aiAnalysis;
//   let attempts = 0;
//   const maxAttempts = 3;
//   while (attempts < maxAttempts) {
//     try {
//       const response = await axios.post(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
//         {
//           contents: [{ role: 'user', parts: [{ text: prompt }] }],
//         },
//         {
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );

//       let responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
//       if (!responseText) {
//         throw new Error('No response from Gemini API');
//       }

//       // Clean response to remove Markdown code fences
//       responseText = responseText.replace(/```json\n|```/g, '').trim();

//       // Log raw response for debugging
//       console.log('Gemini API raw response:', responseText);

//       // Parse cleaned response
//       aiAnalysis = JSON.parse(responseText);
//       break;
//     } catch (error) {
//       console.error('Gemini API error:', error.message);
//       attempts++;
//       if (attempts === maxAttempts) {
//         console.error('Max retry attempts reached for Gemini API');
//         throw new Error('Failed to generate AI analysis after maximum retries');
//       }
//       await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
//     }
//   }

//   // If AI analysis fails, throw an error to prevent incomplete report
//   if (!aiAnalysis) {
//     throw new Error('Unable to generate AI analysis due to persistent API failure');
//   }

//   // Return combined analysis
//   return {
//     emotional_summary: aiAnalysis.emotional_summary,
//     emotional_tags: aiAnalysis.emotional_tags.slice(0, 5),
//     communication_score: Math.round(communicationScore * 10) / 10,
//     emotional_burden_score: Math.round(emotionalBurdenScore * 10) / 10,
//     trust_score: Math.round(trustScore * 10) / 10,
//     intimacy_score: Math.round(intimacyScore * 10) / 10,
//     conflict_resolution_score: Math.round(conflictResolutionScore * 10) / 10,
//     future_alignment_score: Math.round(futureAlignmentScore * 10) / 10,
//     family_influence_score: Math.round(familyInfluenceScore * 10) / 10,
//     cultural_adaptation_score: Math.round(culturalAdaptationScore * 10) / 10,
//     love_language_estimate: aiAnalysis.love_language_estimate,
//     pain_points: aiAnalysis.pain_points.slice(0, 8),
//     strengths: aiAnalysis.strengths.slice(0, 6),
//     recommendations: aiAnalysis.recommendations.slice(0, 12),
//     red_flags: aiAnalysis.red_flags.slice(0, 5),
//     deep_insights: aiAnalysis.deep_insights.slice(0, 6),
//     cultural_insights: aiAnalysis.cultural_insights.slice(0, 4),
//     counselor_notes: aiAnalysis.counselor_notes.slice(0, 4),
//   };
// };

// // Remaining functions (unchanged)
// const generateCoupleAnalysis = async (userReport, partnerReport) => {
//   // Calculate compatibility scores
//   const compatibilityScore = Math.round(((
//     (userReport.communication_score + partnerReport.communication_score) / 2 +
//     (userReport.trust_score + partnerReport.trust_score) / 2 +
//     (userReport.intimacy_score + partnerReport.intimacy_score) / 2 +
//     (userReport.conflict_resolution_score + partnerReport.conflict_resolution_score) / 2 +
//     (userReport.future_alignment_score + partnerReport.future_alignment_score) / 2
//   ) / 5) * 10) / 10;

//   const communicationHarmony = Math.round(((userReport.communication_score + partnerReport.communication_score) / 2) * 10) / 10;
//   const trustAlignment = Math.round(((userReport.trust_score + partnerReport.trust_score) / 2) * 10) / 10;
//   const intimacyBalance = Math.round(((userReport.intimacy_score + partnerReport.intimacy_score) / 2) * 10) / 10;
//   const conflictResolutionStyle = Math.round(((userReport.conflict_resolution_score + partnerReport.conflict_resolution_score) / 2) * 10) / 10;
//   const futureVisionAlignment = Math.round(((userReport.future_alignment_score + partnerReport.future_alignment_score) / 2) * 10) / 10;
//   const culturalAdaptationSync = Math.round(((userReport.cultural_adaptation_score + partnerReport.cultural_adaptation_score) / 2) * 10) / 10;

//   // Determine compatibility level
//   let compatibilityLevel = 'Good';
//   if (compatibilityScore >= 8.5) compatibilityLevel = 'Excellent';
//   else if (compatibilityScore >= 7.5) compatibilityLevel = 'Very Good';
//   else if (compatibilityScore >= 6.5) compatibilityLevel = 'Good';
//   else if (compatibilityScore >= 5.5) compatibilityLevel = 'Fair';
//   else compatibilityLevel = 'Needs Work';

//   // Prepare data for Gemini AI
//   const coupleData = {
//     partner_a: {
//       emotional_summary: userReport.emotional_summary,
//       emotional_tags: userReport.emotional_tags,
//       pain_points: userReport.pain_points,
//       strengths: userReport.strengths,
//       recommendations: userReport.recommendations,
//       red_flags: userReport.red_flags,
//       deep_insights: userReport.deep_insights,
//       cultural_insights: userReport.cultural_insights,
//       counselor_notes: userReport.counselor_notes,
//       scores: {
//         communication_score: userReport.communication_score,
//         emotional_burden_score: userReport.emotional_burden_score,
//         trust_score: userReport.trust_score,
//         intimacy_score: userReport.intimacy_score,
//         conflict_resolution_score: userReport.conflict_resolution_score,
//         future_alignment_score: userReport.future_alignment_score,
//         family_influence_score: userReport.family_influence_score,
//         cultural_adaptation_score: userReport.cultural_adaptation_score,
//       }
//     },
//     partner_b: {
//       emotional_summary: partnerReport.emotional_summary,
//       emotional_tags: partnerReport.emotional_tags,
//       pain_points: partnerReport.pain_points,
//       strengths: partnerReport.strengths,
//       recommendations: partnerReport.recommendations,
//       red_flags: partnerReport.red_flags,
//       deep_insights: partnerReport.deep_insights,
//       cultural_insights: partnerReport.cultural_insights,
//       counselor_notes: partnerReport.counselor_notes,
//       scores: {
//         communication_score: partnerReport.communication_score,
//         emotional_burden_score: partnerReport.emotional_burden_score,
//         trust_score: partnerReport.trust_score,
//         intimacy_score: partnerReport.intimacy_score,
//         conflict_resolution_score: partnerReport.conflict_resolution_score,
//         future_alignment_score: partnerReport.future_alignment_score,
//         family_influence_score: partnerReport.family_influence_score,
//         cultural_adaptation_score: partnerReport.cultural_adaptation_score,
//       }
//     },
//     couple_scores: {
//       compatibility_score,
//       communication_harmony,
//       trust_alignment,
//       intimacy_balance,
//       conflict_resolution_style,
//       future_vision_alignment,
//       cultural_adaptation_sync
//     }
//   };

//   // Gemini AI prompt for couple analysis
//   const prompt = `
// You are an AI relationship assistant for RelationSync, a platform focused on enhancing relationships with deep understanding of Indian cultural context. Analyze the following reports for two partners to generate a comprehensive couple relationship report. Provide empathetic, practical, and culturally sensitive insights for Indian relationship dynamics (e.g., family influence, gender roles, emotional expression). Use the provided couple scores and individual reports as context to create realistic, dynamic insights. Return a raw JSON object without Markdown or code fences.

// **Couple Data**:
// ${JSON.stringify(coupleData, null, 2)}

// **Instructions**:
// 1. **Couple Summary**: Write a concise, empathetic summary (100-150 words) reflecting the couple's relationship dynamics based on both partners' reports and couple scores. Use a counselor-like tone, incorporating Indian cultural nuances.
// 2. **Shared Strengths**: Generate up to 6 strengths (short sentences) highlighting positive aspects of the couple's relationship, based on both partners' reports.
// 3. **Growth Areas**: Generate up to 6 growth areas (short sentences) identifying challenges the couple faces, with psychological and cultural depth.
// 4. **Couple Recommendations**: Generate up to 10 actionable recommendations (short sentences) tailored to the couple's dynamics and Indian context.
// 5. **Relationship Insights**: Generate up to 6 psychological insights (short sentences) explaining underlying couple dynamics, with Indian cultural factors.
// 6. **Partner Messages**: Generate two messages (50-70 words each), one from Partner A to Partner B and one from Partner B to Partner A, expressing empathy and commitment based on their reports.

// **Output Format**:
// Return a raw JSON object (without \`\`\`json or other Markdown) with: couple_summary, shared_strengths, growth_areas, couple_recommendations, relationship_insights, partner_messages (object with to_partner_a and to_partner_b).
// `;

//   // Call Gemini API with retry logic
//   let aiCoupleAnalysis;
//   let attempts = 0;
//   const maxAttempts = 3;
//   while (attempts < maxAttempts) {
//     try {
//       const response = await axios.post(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
//         {
//           contents: [{ role: 'user', parts: [{ text: prompt }] }],
//         },
//         {
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );

//       let responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
//       if (!responseText) {
//         throw new Error('No response from Gemini API');
//       }

//       // Clean response to remove Markdown code fences
//       responseText = responseText.replace(/```json\n|```/g, '').trim();

//       // Log raw response for debugging
//       console.log('Gemini API raw response (couple analysis):', responseText);

//       // Parse cleaned response
//       aiCoupleAnalysis = JSON.parse(responseText);
//       break;
//     } catch (error) {
//       console.error('Gemini API error for couple analysis:', error.message);
//       if (error.response?.status === 429) {
//         attempts++;
//         if (attempts === maxAttempts) {
//           console.error('Max retry attempts reached for Gemini API (couple analysis)');
//           aiCoupleAnalysis = {
//             couple_summary: 'Your relationship shows commitment but faces challenges due to API limits. Please try again later.',
//             shared_strengths: [
//               'Both partners show commitment to understanding and improving the relationship',
//               'You share similar values about the importance of emotional connection',
//               'There\'s mutual respect for each other\'s perspectives and feelings',
//               'Both of you are willing to work on personal growth for the relationship',
//               'You have complementary strengths that balance each other well',
//               'Strong foundation of care and affection despite current challenges'
//             ],
//             growth_areas: [
//               'Developing more effective communication patterns during disagreements',
//               'Building stronger emotional intimacy through vulnerability and openness',
//               'Creating better work-life balance to prioritize relationship time',
//               'Aligning expectations about family involvement and boundaries',
//               'Improving conflict resolution skills to prevent escalation',
//               'Strengthening trust through consistent actions and transparency'
//             ],
//             couple_recommendations: [
//               'Schedule weekly "relationship meetings" to discuss both appreciations and concerns in a structured way',
//               'Practice the "5:1 ratio" - for every criticism or complaint, share five positive observations about your partner',
//               'Create a "relationship vision board" together - visualize your shared future and goals as a couple',
//               'Implement a "24-hour rule" for major decisions - discuss important choices together before acting',
//               'Establish "his time, her time, and our time" - balance individual needs with couple connection',
//               'Practice "emotional check-ins" - ask "How are you feeling about us?" regularly',
//               'Create rituals for connection: daily appreciation, weekly dates, monthly relationship reviews',
//               'Learn each other\'s "emotional triggers" and develop strategies to support during difficult moments',
//               'Practice "repair attempts" during conflicts - use humor, affection, or acknowledgment to de-escalate',
//               'Develop a "couple mission statement" - define your shared values and purpose together'
//             ],
//             relationship_insights: [
//               'Your relationship patterns show both individual growth needs and couple dynamics that can be transformed with awareness',
//               'The cultural context of your relationship adds both richness and complexity - honoring tradition while creating your own path',
//               'Your different communication styles can become a strength when you learn to bridge the gap with understanding',
//               'The emotional patterns you\'ve developed are protective but may be limiting your capacity for deeper intimacy',
//               'Your relationship has the potential for profound growth when both partners feel safe to be vulnerable',
//               'The family influences in your relationship require careful navigation to maintain both respect and autonomy'
//             ],
//             partner_messages: {
//               to_partner_a: 'I see how much you care about our relationship and how hard you\'re trying. I want you to know that your efforts don\'t go unnoticed, and I\'m committed to growing together with you. Let\'s create the love story we both deserve.',
//               to_partner_b: 'Your patience and understanding mean everything to me. I know I\'m not perfect, but I want to be the partner you need. Thank you for believing in us and for being willing to work through our challenges together.'
//             }
//           };
//           break;
//         }
//         await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
//       } else {
//         console.error('Non-retryable error for couple analysis, falling back to default');
//         aiCoupleAnalysis = {
//           couple_summary: 'Your relationship shows commitment but faces challenges due to API limits. Please try again later.',
//           shared_strengths: [
//             'Both partners show commitment to understanding and improving the relationship',
//             'You share similar values about the importance of emotional connection',
//             'There\'s mutual respect for each other\'s perspectives and feelings',
//             'Both of you are willing to work on personal growth for the relationship',
//             'You have complementary strengths that balance each other well',
//             'Strong foundation of care and affection despite current challenges'
//           ],
//           growth_areas: [
//             'Developing more effective communication patterns during disagreements',
//             'Building stronger emotional intimacy through vulnerability and openness',
//             'Creating better work-life balance to prioritize relationship time',
//             'Aligning expectations about family involvement and boundaries',
//             'Improving conflict resolution skills to prevent escalation',
//             'Strengthening trust through consistent actions and transparency'
//           ],
//           couple_recommendations: [
//             'Schedule weekly "relationship meetings" to discuss both appreciations and concerns in a structured way',
//             'Practice the "5:1 ratio" - for every criticism or complaint, share five positive observations about your partner',
//             'Create a "relationship vision board" together - visualize your shared future and goals as a couple',
//             'Implement a "24-hour rule" for major decisions - discuss important choices together before acting',
//             'Establish "his time, her time, and our time" - balance individual needs with couple connection',
//             'Practice "emotional check-ins" - ask "How are you feeling about us?" regularly',
//             'Create rituals for connection: daily appreciation, weekly dates, monthly relationship reviews',
//             'Learn each other\'s "emotional triggers" and develop strategies to support during difficult moments',
//             'Practice "repair attempts" during conflicts - use humor, affection, or acknowledgment to de-escalate',
//             'Develop a "couple mission statement" - define your shared values and purpose together'
//           ],
//           relationship_insights: [
//             'Your relationship patterns show both individual growth needs and couple dynamics that can be transformed with awareness',
//             'The cultural context of your relationship adds both richness and complexity - honoring tradition while creating your own path',
//             'Your different communication styles can become a strength when you learn to bridge the gap with understanding',
//             'The emotional patterns you\'ve developed are protective but may be limiting your capacity for deeper intimacy',
//             'Your relationship has the potential for profound growth when both partners feel safe to be vulnerable',
//             'The family influences in your relationship require careful navigation to maintain both respect and autonomy'
//           ],
//           partner_messages: {
//             to_partner_a: 'I see how much you care about our relationship and how hard you\'re trying. I want you to know that your efforts don\'t go unnoticed, and I\'m committed to growing together with you. Let\'s create the love story we both deserve.',
//             to_partner_b: 'Your patience and understanding mean everything to me. I know I\'m not perfect, but I want to be the partner you need. Thank you for believing in us and for being willing to work through our challenges together.'
//           }
//         };
//         break;
//       }
//     }
//   }

//   return {
//     compatibility_score: compatibilityScore,
//     communication_harmony: communicationHarmony,
//     trust_alignment: trustAlignment,
//     intimacy_balance: intimacyBalance,
//     conflict_resolution_style: conflictResolutionStyle,
//     future_vision_alignment: futureVisionAlignment,
//     cultural_adaptation_sync: culturalAdaptationSync,
//     compatibility_level: compatibilityLevel,
//     shared_strengths: aiCoupleAnalysis.shared_strengths.slice(0, 6),
//     growth_areas: aiCoupleAnalysis.growth_areas.slice(0, 6),
//     couple_recommendations: aiCoupleAnalysis.couple_recommendations.slice(0, 10),
//     relationship_insights: aiCoupleAnalysis.relationship_insights.slice(0, 6),
//     partner_messages: aiCoupleAnalysis.partner_messages,
//     couple_summary: aiCoupleAnalysis.couple_summary
//   };
// };

// const generateReport = async (req, res) => {
//   try {
//     const { sessionId } = req.params;
//     const userId = req.user.id;

//     // Verify session belongs to user and is completed
//     const sessionResult = await pool.query(
//       'SELECT id, status FROM user_questionnaire_sessions WHERE id = $1 AND user_id = $2 AND status = $3',
//       [sessionId, userId, 'completed']
//     );

//     if (sessionResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Completed questionnaire session not found'
//       });
//     }

//     // Check if report already exists
//     const existingReport = await pool.query(
//       'SELECT id FROM ai_reports WHERE session_id = $1',
//       [sessionId]
//     );

//     if (existingReport.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Report already generated for this session'
//       });
//     }

//     // Get all responses for this session with question details
//     const responsesResult = await pool.query(
//       `SELECT qr.*, q.question_text, q.type, qc.name as category, qo.option_text
//        FROM question_responses qr
//        JOIN questions q ON qr.question_id = q.id
//        JOIN question_categories qc ON q.category_id = qc.id
//        LEFT JOIN question_options qo ON qr.selected_option_id = qo.id
//        WHERE qr.session_id = $1
//        ORDER BY q.priority`,
//       [sessionId]
//     );

//     const responses = responsesResult.rows;

//     if (responses.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No responses found for this session'
//       });
//     }

//     console.log('🧠 Generating enhanced psychological analysis with Indian cultural context');
//     const analysis = await generateEnhancedMockAnalysis(responses);

//     const communicationScoreInt = Math.round(analysis.communication_score);
//     const emotionalBurdenScoreInt = Math.round(analysis.emotional_burden_score);

//     const reportResult = await pool.query(
//       `INSERT INTO ai_reports (
//         session_id, user_id, emotional_summary, emotional_tags,
//         communication_score, emotional_burden_score, love_language_estimate,
//         report_json
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//       RETURNING id, created_at`,
//       [
//         sessionId,
//         userId,
//         analysis.emotional_summary,
//         analysis.emotional_tags,
//         communicationScoreInt,
//         emotionalBurdenScoreInt,
//         analysis.love_language_estimate,
//         JSON.stringify({
//           trust_score: analysis.trust_score,
//           intimacy_score: analysis.intimacy_score,
//           conflict_resolution_score: analysis.conflict_resolution_score,
//           future_alignment_score: analysis.future_alignment_score,
//           family_influence_score: analysis.family_influence_score,
//           cultural_adaptation_score: analysis.cultural_adaptation_score,
//           pain_points: analysis.pain_points,
//           strengths: analysis.strengths,
//           recommendations: analysis.recommendations,
//           red_flags: analysis.red_flags,
//           deep_insights: analysis.deep_insights,
//           cultural_insights: analysis.cultural_insights,
//           counselor_notes: analysis.counselor_notes,
//           analysis_version: '5.0',
//           ai_provider: 'gemini-1.5-flash'
//         })
//       ]
//     );

//     res.status(201).json({
//       success: true,
//       message: 'Comprehensive relationship analysis generated successfully',
//       data: {
//         reportId: reportResult.rows[0].id,
//         sessionId: sessionId,
//         analysis: analysis,
//         createdAt: reportResult.rows[0].created_at
//       }
//     });
//   } catch (error) {
//     console.error('Generate AI report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// const getReport = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const reportResult = await pool.query(
//       `SELECT ar.*, uqs.session_name 
//        FROM ai_reports ar
//        JOIN user_questionnaire_sessions uqs ON ar.session_id = uqs.id
//        WHERE ar.user_id = $1
//        ORDER BY ar.created_at DESC
//        LIMIT 1`,
//       [userId]
//     );

//     if (reportResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No report found for this user'
//       });
//     }

//     const report = reportResult.rows[0];
//     const reportData = report.report_json || {};

//     res.json({
//       success: true,
//       data: {
//         reportId: report.id,
//         sessionId: report.session_id,
//         analysis: {
//           emotional_summary: report.emotional_summary,
//           emotional_tags: report.emotional_tags,
//           communication_score: report.communication_score,
//           emotional_burden_score: report.emotional_burden_score,
//           love_language_estimate: report.love_language_estimate,
//           trust_score: reportData.trust_score,
//           intimacy_score: reportData.intimacy_score,
//           conflict_resolution_score: reportData.conflict_resolution_score,
//           future_alignment_score: reportData.future_alignment_score,
//           family_influence_score: reportData.family_influence_score,
//           cultural_adaptation_score: reportData.cultural_adaptation_score,
//           pain_points: reportData.pain_points || [],
//           strengths: reportData.strengths || [],
//           recommendations: reportData.recommendations || [],
//           red_flags: reportData.red_flags || [],
//           deep_insights: reportData.deep_insights || [],
//           cultural_insights: reportData.cultural_insights || [],
//           counselor_notes: reportData.counselor_notes || []
//         },
//         createdAt: report.created_at
//       }
//     });
//   } catch (error) {
//     console.error('Get report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// const generateCoupleReport = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const coupleResult = await pool.query(
//       'SELECT id, partner_a_id, partner_b_id FROM couples WHERE partner_a_id = $1 OR partner_b_id = $1',
//       [userId]
//     );

//     if (coupleResult.rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'You need to be paired with a partner to generate a couple report'
//       });
//     }

//     const couple = coupleResult.rows[0];
//     const partnerId = couple.partner_a_id === userId ? couple.partner_b_id : couple.partner_a_id;

//     const userReportResult = await pool.query(
//       'SELECT * FROM ai_reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
//       [userId]
//     );

//     const partnerReportResult = await pool.query(
//       'SELECT * FROM ai_reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
//       [partnerId]
//     );

//     if (userReportResult.rows.length === 0 || partnerReportResult.rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Both partners need to complete the questionnaire and generate individual reports first'
//       });
//     }

//     const existingCoupleReport = await pool.query(
//       'SELECT id FROM relationsync_reflections WHERE couple_id = $1',
//       [couple.id]
//     );

//     if (existingCoupleReport.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Couple report already exists'
//       });
//     }

//     const userReport = userReportResult.rows[0];
//     const partnerReport = partnerReportResult.rows[0];

//     const userReportData = {
//       ...userReport,
//       ...userReport.report_json
//     };
//     const partnerReportData = {
//       ...partnerReport,
//       ...partnerReport.report_json
//     };

//     const coupleAnalysis = await generateCoupleAnalysis(userReportData, partnerReportData);

//     const coupleReportResult = await pool.query(
//       `INSERT INTO relationsync_reflections (
//         couple_id, report_summary, direct_messages, insight_points, compatibility_level
//       ) VALUES ($1, $2, $3, $4, $5)
//       RETURNING id, created_at`,
//       [
//         couple.id,
//         coupleAnalysis.couple_summary,
//         JSON.stringify(coupleAnalysis.partner_messages),
//         JSON.stringify(coupleAnalysis),
//         coupleAnalysis.compatibility_level
//       ]
//     );

//     res.status(201).json({
//       success: true,
//       message: 'Couple report generated successfully',
//       data: {
//         reportId: coupleReportResult.rows[0].id,
//         coupleId: couple.id,
//         analysis: coupleAnalysis,
//         createdAt: coupleReportResult.rows[0].created_at
//       }
//     });
//   } catch (error) {
//     console.error('Generate couple report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// const getCoupleReport = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const coupleResult = await pool.query(
//       'SELECT id FROM couples WHERE partner_a_id = $1 OR partner_b_id = $1',
//       [userId]
//     );

//     if (coupleResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No couple connection found'
//       });
//     }

//     const coupleId = coupleResult.rows[0].id;

//     const reportResult = await pool.query(
//       'SELECT * FROM relationsync_reflections WHERE couple_id = $1 ORDER BY created_at DESC LIMIT 1',
//       [coupleId]
//     );

//     if (reportResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No couple report found'
//       });
//     }

//     const report = reportResult.rows[0];

//     res.json({
//       success: true,
//       data: {
//         reportId: report.id,
//         coupleId: coupleId,
//         analysis: report.insight_points,
//         createdAt: report.created_at
//       }
//     });
//   } catch (error) {
//     console.error('Get couple report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// module.exports = {
//   generateReport,
//   getReport,
//   generateCoupleReport,
//   getCoupleReport
// };

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
import pool from '../db.js';
dotenv.config();

// ─────────────────────────────────────────────
//  CONFIG
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
//  OLLAMA HELPER
//  Returns parsed JSON from mistral or throws.
// ─────────────────────────────────────────────
import { OpenRouter } from "@openrouter/sdk";


const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const callOllama = async (prompt) => {
  const response = await openrouter.chat.send({
    chatRequest: {
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    },
  });

  let raw = response.choices?.[0]?.message?.content || '';

  raw = raw
    .replace(/```json[\s\S]*?```/g, (m) => m.replace(/```json\n?/, '').replace(/```$/, ''))
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\n?/, '').replace(/```$/, ''))
    .trim();

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON object found in OpenRouter response');

  return JSON.parse(jsonMatch[0]);
};
//───────────────────────────
//  RULE-BASED SCORE ENGINE  (scale questions)
//
//  question_id → category mapping is defined here.
//  Add / adjust IDs to match your actual schema.
// ─────────────────────────────────────────────
const computeScoresFromRatings = (ratingResponses) => {
  // Baselines
  const scores = {
    communication:       6.5,
    emotional_burden:    5.5,
    trust:               7.0,
    intimacy:            6.0,
    conflict_resolution: 6.2,
    future_alignment:    6.8,
    family_influence:    7.0,
    cultural_adaptation: 6.5,
  };

  // Weighted question map: { question_id: { dimension, weight } }
  // Adjust question IDs to match your DB schema.
  const QUESTION_MAP = {
    // Communication
    1:  { dim: 'communication',       weight:  1.0 },
    5:  { dim: 'communication',       weight:  1.0 },
    8:  { dim: 'communication',       weight:  0.8 },
    // Trust
    18: { dim: 'trust',               weight:  1.5 },
    22: { dim: 'trust',               weight:  1.0 },
    // Intimacy / emotional connection
    15: { dim: 'intimacy',            weight:  1.0 },
    21: { dim: 'intimacy',            weight:  1.0 },
    25: { dim: 'intimacy',            weight:  0.8 },
    // Conflict resolution
    10: { dim: 'conflict_resolution', weight:  1.0 },
    13: { dim: 'conflict_resolution', weight:  0.8 },
    // Future alignment
    17: { dim: 'future_alignment',    weight:  1.0 },
    20: { dim: 'future_alignment',    weight:  0.8 },
    // Family influence (direct set — question 6 is the primary indicator)
    6:  { dim: 'family_influence',    weight: 'direct' },
    9:  { dim: 'family_influence',    weight:  0.7 },
    // Cultural adaptation
    12: { dim: 'cultural_adaptation', weight:  1.0 },
    // Emotional burden (inverse — high score = less burden)
    3:  { dim: 'emotional_burden',    weight: -1.0 },
    7:  { dim: 'emotional_burden',    weight: -0.8 },
  };

  // Accumulators for weighted average
  const acc   = {};   // { dim: { sum, totalWeight } }
  const hasQ  = {};   // track which dims had rated input

  ratingResponses.forEach((r) => {
    const qId  = parseInt(r.question_id);
    const val  = parseInt(r.answer_text);
    if (!qId || isNaN(val) || val < 1 || val > 10) return;

    const cfg = QUESTION_MAP[qId];
    if (!cfg) return;

    const { dim, weight } = cfg;

    // Direct assignment (e.g. family influence primary question)
    if (weight === 'direct') {
      scores[dim] = val;
      hasQ[dim]   = true;
      return;
    }

    if (!acc[dim]) acc[dim] = { sum: 0, totalWeight: 0 };
    hasQ[dim] = true;

    // Penalise / reward based on direction
    const effectiveWeight = Math.abs(weight);
    const adjustedVal     = weight < 0 ? (11 - val) : val; // invert for burden
    acc[dim].sum         += adjustedVal * effectiveWeight;
    acc[dim].totalWeight += effectiveWeight;
  });

  // Apply weighted averages as deltas from baseline
  Object.entries(acc).forEach(([dim, { sum, totalWeight }]) => {
    if (totalWeight === 0) return;
    const avg   = sum / totalWeight;         // 1-10 scale
    const delta = (avg - 5.5) * 0.35;        // gentle push from neutral midpoint
    scores[dim] = scores[dim] + delta;
  });

  // Clamp all to [1, 10] with one decimal
  Object.keys(scores).forEach((k) => {
    scores[k] = Math.round(Math.max(1, Math.min(10, scores[k])) * 10) / 10;
  });

  return scores;
};

// ─────────────────────────────────────────────
//  STATIC FALLBACK  (used when Ollama is down)
// ─────────────────────────────────────────────
const getStaticIndividualAnalysis = () => ({
  emotional_summary:
    'Unable to generate AI analysis at this time. Based on your answers, there are areas to explore around communication and family influence.',
  emotional_tags:    ['needs_reflection'],
  pain_points:       ['Possible communication gaps', 'Family pressures affecting decisions'],
  strengths:         ['Willingness to reflect on relationship'],
  recommendations:   ['Practice active listening', 'Set gentle boundaries with family'],
  red_flags:         [],
  deep_insights:     [],
  cultural_insights: ['Balance tradition with personal choice'],
  counselor_notes:   [],
  love_language_estimate: 'Quality Time',
});

const getStaticCoupleAnalysis = () => ({
  couple_summary:
    'Your relationship shows commitment but faces challenges. Please try again later for a full AI-generated analysis.',
  shared_strengths: [
    'Both partners show commitment to improving the relationship',
    'Mutual respect for each other\'s perspectives',
    'Willingness to work on personal growth',
  ],
  growth_areas: [
    'Developing more effective communication during disagreements',
    'Building stronger emotional intimacy through vulnerability',
    'Aligning expectations about family involvement',
  ],
  couple_recommendations: [
    'Schedule weekly check-ins to discuss appreciations and concerns',
    'Practice active listening without interruption',
    'Create shared rituals of connection',
  ],
  relationship_insights: [
    'Cultural context adds richness and complexity to your bond',
    'Different communication styles can become strengths with awareness',
  ],
  partner_messages: {
    to_partner_a:
      'I see how much you care about us. Your efforts matter and I am committed to growing with you.',
    to_partner_b:
      'Your patience means everything to me. Thank you for believing in us through every challenge.',
  },
});

// ─────────────────────────────────────────────
//  INDIVIDUAL ANALYSIS  (Ollama + rules)
// ─────────────────────────────────────────────
const generateEnhancedMockAnalysis = async (responses) => {
  // Split by type
  const ratingResponses = responses.filter(
    (r) => r.type === 'scale' && r.answer_text
  );
  const narrativeResponses = responses.filter(
    (r) =>
      (r.type === 'text' && r.answer_text) ||
      (r.type === 'multiple_choice' && r.selected_option_id && r.option_text)
  );

  // 1. Rule-based numeric scores (no LLM needed)
  const scores = computeScoresFromRatings(ratingResponses);

  // 2. Build Ollama prompt for narrative/MC responses
  const responseSummary = narrativeResponses.map((r) => ({
    question_id: r.question_id,
    question:    r.question_text,
    answer:      r.type === 'text' ? r.answer_text : r.option_text,
    category:    r.category,
    type:        r.type,
  }));

  const prompt = `You are an empathetic relationship counsellor specialising in Indian cultural dynamics for the RelationSync platform.

Analyse the following questionnaire responses and return ONLY a raw JSON object — no markdown, no code fences, no preamble.

RESPONSES:
${JSON.stringify(responseSummary, null, 2)}

SCORE CONTEXT (do NOT change these values, use only for narrative context):
${JSON.stringify(scores, null, 2)}

Return a JSON object with EXACTLY these keys:
{
  "emotional_summary": "100-150 word empathetic summary of the relationship emotional state with Indian cultural nuances",
  "pain_points": ["up to 8 short specific challenge sentences"],
  "strengths": ["up to 6 short positive sentences"],
  "recommendations": ["up to 12 short actionable sentences for Indian context"],
  "red_flags": ["up to 5 critical issue sentences"],
  "deep_insights": ["up to 6 psychological insight sentences"],
  "cultural_insights": ["up to 4 Indian-specific insight sentences"],
  "counselor_notes": ["up to 4 therapist guidance sentences"],
  "emotional_tags": ["up to 5 tags like anxious_attachment or emotional_isolation"],
  "love_language_estimate": "one of: Words of Affirmation | Quality Time | Physical Touch | Acts of Service | Receiving Gifts"
}

Rules:
- Be empathetic, non-judgmental, and specific to the responses provided.
- Reflect Indian collectivist values, family pressures, and urban relationship dynamics.
- Do NOT include any text outside the JSON object.`;

  let aiAnalysis = null;

  // 3. Try Ollama (with 2 retries)
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`🦙 Calling Ollama (${OLLAMA_MODEL}) — attempt ${attempt}`);
      aiAnalysis = await callOllama(prompt);
      console.log('✅ Ollama individual analysis succeeded');
      break;
    } catch (err) {
      console.error(`Ollama attempt ${attempt} failed:`, err.message);
      if (attempt < 2) await new Promise((r) => setTimeout(r, 2000));
    }
  }

  // 4. Fallback to static if Ollama failed
  if (!aiAnalysis) {
    console.warn('⚠️  Ollama unavailable — using static fallback for individual analysis');
    aiAnalysis = getStaticIndividualAnalysis();
  }

  // 5. Merge rule-based scores + AI narrative
  return {
    emotional_summary:          aiAnalysis.emotional_summary,
    emotional_tags:             (aiAnalysis.emotional_tags     || []).slice(0, 5),
    communication_score:        scores.communication,
    emotional_burden_score:     scores.emotional_burden,
    trust_score:                scores.trust,
    intimacy_score:             scores.intimacy,
    conflict_resolution_score:  scores.conflict_resolution,
    future_alignment_score:     scores.future_alignment,
    family_influence_score:     scores.family_influence,
    cultural_adaptation_score:  scores.cultural_adaptation,
    love_language_estimate:     aiAnalysis.love_language_estimate,
    pain_points:                (aiAnalysis.pain_points        || []).slice(0, 8),
    strengths:                  (aiAnalysis.strengths          || []).slice(0, 6),
    recommendations:            (aiAnalysis.recommendations    || []).slice(0, 12),
    red_flags:                  (aiAnalysis.red_flags          || []).slice(0, 5),
    deep_insights:              (aiAnalysis.deep_insights      || []).slice(0, 6),
    cultural_insights:          (aiAnalysis.cultural_insights  || []).slice(0, 4),
    counselor_notes:            (aiAnalysis.counselor_notes    || []).slice(0, 4),
  };
};

// ─────────────────────────────────────────────
//  COUPLE ANALYSIS  (Ollama + arithmetic)
// ─────────────────────────────────────────────
const generateCoupleAnalysis = async (userReport, partnerReport) => {
  // Arithmetic compatibility scores (no LLM needed)
  const avg = (a, b) => Math.round(((a + b) / 2) * 10) / 10;

  const compatibilityScore    = avg(
    avg(userReport.communication_score,        partnerReport.communication_score),
    avg(
      avg(userReport.trust_score,              partnerReport.trust_score),
      avg(
        avg(userReport.intimacy_score,         partnerReport.intimacy_score),
        avg(userReport.conflict_resolution_score, partnerReport.conflict_resolution_score)
      )
    )
  );

  const communicationHarmony  = avg(userReport.communication_score,        partnerReport.communication_score);
  const trustAlignment        = avg(userReport.trust_score,                 partnerReport.trust_score);
  const intimacyBalance       = avg(userReport.intimacy_score,              partnerReport.intimacy_score);
  const conflictResolutionStyle = avg(userReport.conflict_resolution_score, partnerReport.conflict_resolution_score);
  const futureVisionAlignment = avg(userReport.future_alignment_score,      partnerReport.future_alignment_score);
  const culturalAdaptationSync = avg(userReport.cultural_adaptation_score,  partnerReport.cultural_adaptation_score);

  const finalCompatibility = Math.round(
    ((communicationHarmony + trustAlignment + intimacyBalance +
      conflictResolutionStyle + futureVisionAlignment) / 5) * 10
  ) / 10;

  let compatibilityLevel = 'Needs Work';
  if (finalCompatibility >= 8.5)      compatibilityLevel = 'Excellent';
  else if (finalCompatibility >= 7.5) compatibilityLevel = 'Very Good';
  else if (finalCompatibility >= 6.5) compatibilityLevel = 'Good';
  else if (finalCompatibility >= 5.5) compatibilityLevel = 'Fair';

  // Build Ollama prompt
  const coupleData = {
    partner_a: {
      emotional_summary: userReport.emotional_summary,
      emotional_tags:    userReport.emotional_tags,
      pain_points:       userReport.pain_points,
      strengths:         userReport.strengths,
      red_flags:         userReport.red_flags,
      deep_insights:     userReport.deep_insights,
      cultural_insights: userReport.cultural_insights,
      scores: {
        communication:       userReport.communication_score,
        emotional_burden:    userReport.emotional_burden_score,
        trust:               userReport.trust_score,
        intimacy:            userReport.intimacy_score,
        conflict_resolution: userReport.conflict_resolution_score,
        future_alignment:    userReport.future_alignment_score,
        family_influence:    userReport.family_influence_score,
        cultural_adaptation: userReport.cultural_adaptation_score,
      },
    },
    partner_b: {
      emotional_summary: partnerReport.emotional_summary,
      emotional_tags:    partnerReport.emotional_tags,
      pain_points:       partnerReport.pain_points,
      strengths:         partnerReport.strengths,
      red_flags:         partnerReport.red_flags,
      deep_insights:     partnerReport.deep_insights,
      cultural_insights: partnerReport.cultural_insights,
      scores: {
        communication:       partnerReport.communication_score,
        emotional_burden:    partnerReport.emotional_burden_score,
        trust:               partnerReport.trust_score,
        intimacy:            partnerReport.intimacy_score,
        conflict_resolution: partnerReport.conflict_resolution_score,
        future_alignment:    partnerReport.future_alignment_score,
        family_influence:    partnerReport.family_influence_score,
        cultural_adaptation: partnerReport.cultural_adaptation_score,
      },
    },
    couple_scores: {
      compatibility:         finalCompatibility,
      communication_harmony: communicationHarmony,
      trust_alignment:       trustAlignment,
      intimacy_balance:      intimacyBalance,
      conflict_style:        conflictResolutionStyle,
      future_alignment:      futureVisionAlignment,
      cultural_sync:         culturalAdaptationSync,
      level:                 compatibilityLevel,
    },
  };

  const prompt = `You are an empathetic relationship counsellor specialising in Indian cultural dynamics for the RelationSync platform.

Analyse the following couple data and return ONLY a raw JSON object — no markdown, no code fences, no preamble.

COUPLE DATA:
${JSON.stringify(coupleData, null, 2)}

Return a JSON object with EXACTLY these keys:
{
  "couple_summary": "100-150 word empathetic couple summary with Indian cultural nuances",
  "shared_strengths": ["up to 6 short sentences about positive couple dynamics"],
  "growth_areas": ["up to 6 short sentences about challenges"],
  "couple_recommendations": ["up to 10 short actionable sentences for the couple"],
  "relationship_insights": ["up to 6 psychological insight sentences"],
  "partner_messages": {
    "to_partner_a": "50-70 word empathetic message from Partner B to Partner A",
    "to_partner_b": "50-70 word empathetic message from Partner A to Partner B"
  }
}

Rules:
- Be specific to the provided individual reports; do not produce generic advice.
- Reflect Indian collectivist values, family pressures, and gender dynamics where relevant.
- Do NOT include any text outside the JSON object.`;

  let aiCoupleAnalysis = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`🦙 Calling Ollama (${OLLAMA_MODEL}) for couple analysis — attempt ${attempt}`);
      aiCoupleAnalysis = await callOllama(prompt);
      console.log('✅ Ollama couple analysis succeeded');
      break;
    } catch (err) {
      console.error(`Ollama couple attempt ${attempt} failed:`, err.message);
      if (attempt < 2) await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (!aiCoupleAnalysis) {
    console.warn('⚠️  Ollama unavailable — using static fallback for couple analysis');
    aiCoupleAnalysis = getStaticCoupleAnalysis();
  }

  return {
    compatibility_score:      finalCompatibility,
    communication_harmony:    communicationHarmony,
    trust_alignment:          trustAlignment,
    intimacy_balance:         intimacyBalance,
    conflict_resolution_style: conflictResolutionStyle,
    future_vision_alignment:  futureVisionAlignment,
    cultural_adaptation_sync: culturalAdaptationSync,
    compatibility_level:      compatibilityLevel,
    couple_summary:           aiCoupleAnalysis.couple_summary,
    shared_strengths:         (aiCoupleAnalysis.shared_strengths     || []).slice(0, 6),
    growth_areas:             (aiCoupleAnalysis.growth_areas          || []).slice(0, 6),
    couple_recommendations:   (aiCoupleAnalysis.couple_recommendations || []).slice(0, 10),
    relationship_insights:    (aiCoupleAnalysis.relationship_insights  || []).slice(0, 6),
    partner_messages:         aiCoupleAnalysis.partner_messages        || getStaticCoupleAnalysis().partner_messages,
  };
};

// ─────────────────────────────────────────────
//  ROUTE HANDLERS  (unchanged API contract)
// ─────────────────────────────────────────────
const generateReport = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const sessionResult = await pool.query(
      'SELECT id, status FROM user_questionnaire_sessions WHERE id = $1 AND user_id = $2 AND status = $3',
      [sessionId, userId, 'completed']
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Completed questionnaire session not found' });
    }

    const existingReport = await pool.query(
      'SELECT id FROM ai_reports WHERE session_id = $1',
      [sessionId]
    );

    if (existingReport.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Report already generated for this session' });
    }

    const responsesResult = await pool.query(
      `SELECT qr.*, q.question_text, q.type, qc.name as category, qo.option_text
       FROM question_responses qr
       JOIN questions q ON qr.question_id = q.id
       JOIN question_categories qc ON q.category_id = qc.id
       LEFT JOIN question_options qo ON qr.selected_option_id = qo.id
       WHERE qr.session_id = $1
       ORDER BY q.priority`,
      [sessionId]
    );

    const responses = responsesResult.rows;

    if (responses.length === 0) {
      return res.status(400).json({ success: false, message: 'No responses found for this session' });
    }

    console.log('🧠 Generating analysis — rules for scale, Ollama for narrative');
    const analysis = await generateEnhancedMockAnalysis(responses);

    const reportResult = await pool.query(
      `INSERT INTO ai_reports (
        session_id, user_id, emotional_summary, emotional_tags,
        communication_score, emotional_burden_score, love_language_estimate,
        report_json
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, created_at`,
      [
        sessionId,
        userId,
        analysis.emotional_summary,
        analysis.emotional_tags,
        Math.round(analysis.communication_score),
        Math.round(analysis.emotional_burden_score),
        analysis.love_language_estimate,
        JSON.stringify({
          trust_score:                analysis.trust_score,
          intimacy_score:             analysis.intimacy_score,
          conflict_resolution_score:  analysis.conflict_resolution_score,
          future_alignment_score:     analysis.future_alignment_score,
          family_influence_score:     analysis.family_influence_score,
          cultural_adaptation_score:  analysis.cultural_adaptation_score,
          pain_points:                analysis.pain_points,
          strengths:                  analysis.strengths,
          recommendations:            analysis.recommendations,
          red_flags:                  analysis.red_flags,
          deep_insights:              analysis.deep_insights,
          cultural_insights:          analysis.cultural_insights,
          counselor_notes:            analysis.counselor_notes,
          analysis_version:           '6.0',
          ai_provider:                'ollama-mistral',
        }),
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Comprehensive relationship analysis generated successfully',
      data: {
        reportId:  reportResult.rows[0].id,
        sessionId,
        analysis,
        createdAt: reportResult.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error('generateReport error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getReport = async (req, res) => {
  try {
    const userId = req.user.id;

    const reportResult = await pool.query(
      `SELECT ar.*, uqs.session_name
       FROM ai_reports ar
       JOIN user_questionnaire_sessions uqs ON ar.session_id = uqs.id
       WHERE ar.user_id = $1
       ORDER BY ar.created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (reportResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No report found for this user' });
    }

    const report   = reportResult.rows[0];
    const jsonData = report.report_json || {};

    res.json({
      success: true,
      data: {
        reportId:  report.id,
        sessionId: report.session_id,
        analysis: {
          emotional_summary:          report.emotional_summary,
          emotional_tags:             report.emotional_tags,
          communication_score:        report.communication_score,
          emotional_burden_score:     report.emotional_burden_score,
          love_language_estimate:     report.love_language_estimate,
          trust_score:                jsonData.trust_score,
          intimacy_score:             jsonData.intimacy_score,
          conflict_resolution_score:  jsonData.conflict_resolution_score,
          future_alignment_score:     jsonData.future_alignment_score,
          family_influence_score:     jsonData.family_influence_score,
          cultural_adaptation_score:  jsonData.cultural_adaptation_score,
          pain_points:                jsonData.pain_points     || [],
          strengths:                  jsonData.strengths       || [],
          recommendations:            jsonData.recommendations || [],
          red_flags:                  jsonData.red_flags       || [],
          deep_insights:              jsonData.deep_insights   || [],
          cultural_insights:          jsonData.cultural_insights || [],
          counselor_notes:            jsonData.counselor_notes || [],
        },
        createdAt: report.created_at,
      },
    });
  } catch (error) {
    console.error('getReport error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const generateCoupleReport = async (req, res) => {
  try {
    const userId = req.user.id;

    const coupleResult = await pool.query(
      'SELECT id, partner_a_id, partner_b_id FROM couples WHERE partner_a_id = $1 OR partner_b_id = $1',
      [userId]
    );

    if (coupleResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'You need to be paired with a partner to generate a couple report' });
    }

    const couple    = coupleResult.rows[0];
    const partnerId = couple.partner_a_id === userId ? couple.partner_b_id : couple.partner_a_id;

    const [userRR, partnerRR] = await Promise.all([
      pool.query('SELECT * FROM ai_reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]),
      pool.query('SELECT * FROM ai_reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [partnerId]),
    ]);

    if (userRR.rows.length === 0 || partnerRR.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Both partners need to complete the questionnaire and generate individual reports first',
      });
    }

    const existingCoupleReport = await pool.query(
      'SELECT id FROM relationsync_reflections WHERE couple_id = $1',
      [couple.id]
    );

    if (existingCoupleReport.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Couple report already exists' });
    }

    // Merge report_json fields into flat object for analysis function
    const flatten = (row) => ({ ...row, ...(row.report_json || {}) });
    const coupleAnalysis = await generateCoupleAnalysis(flatten(userRR.rows[0]), flatten(partnerRR.rows[0]));

    const coupleReportResult = await pool.query(
      `INSERT INTO relationsync_reflections (
        couple_id, report_summary, direct_messages, insight_points, compatibility_level
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_at`,
      [
        couple.id,
        coupleAnalysis.couple_summary,
        JSON.stringify(coupleAnalysis.partner_messages),
        JSON.stringify(coupleAnalysis),
        coupleAnalysis.compatibility_level,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Couple report generated successfully',
      data: {
        reportId:  coupleReportResult.rows[0].id,
        coupleId:  couple.id,
        analysis:  coupleAnalysis,
        createdAt: coupleReportResult.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error('generateCoupleReport error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getCoupleReport = async (req, res) => {
  try {
    const userId = req.user.id;

    const coupleResult = await pool.query(
      'SELECT id FROM couples WHERE partner_a_id = $1 OR partner_b_id = $1',
      [userId]
    );

    if (coupleResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No couple connection found' });
    }

    const coupleId = coupleResult.rows[0].id;

    const reportResult = await pool.query(
      'SELECT * FROM relationsync_reflections WHERE couple_id = $1 ORDER BY created_at DESC LIMIT 1',
      [coupleId]
    );

    if (reportResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No couple report found' });
    }

    const report = reportResult.rows[0];

    res.json({
      success: true,
      data: {
        reportId:  report.id,
        coupleId,
        analysis:  report.insight_points,
        createdAt: report.created_at,
      },
    });
  } catch (error) {
    console.error('getCoupleReport error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export {
  generateReport,
  getReport,
  generateCoupleReport,
  getCoupleReport
};