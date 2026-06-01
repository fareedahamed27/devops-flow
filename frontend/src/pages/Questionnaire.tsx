// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronLeft, ChevronRight, Save, Brain } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { Button } from '../components/ui/Button';
// import { Input } from '../components/ui/Input';
// import { Card } from '../components/ui/Card';
// import { QUESTIONNAIRE_QUESTIONS } from '../data/questions';
// import { Question } from '../types';
// import axios from 'axios';

// export const Questionnaire: React.FC = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [sessionId, setSessionId] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const { updateUser } = useAuth();
//   const navigate = useNavigate();

//   const currentQuestion = QUESTIONNAIRE_QUESTIONS[currentQuestionIndex];
//   const progress = ((currentQuestionIndex + 1) / QUESTIONNAIRE_QUESTIONS.length) * 100;

//   // Start questionnaire session when component mounts
//   useEffect(() => {
//     startQuestionnaireSession();
//   }, []);

//   const startQuestionnaireSession = async () => {
//     try {
//       const token = localStorage.getItem('relationsync_token');
//       const response = await axios.post('/api/questionnaire/start', {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setSessionId(response.data.data.sessionId);
//     } catch (err: any) {
//       console.error('Failed to start questionnaire session:', err);
//       setError('Failed to start questionnaire. Please try again.');
//     }
//   };

//   const handleAnswerChange = async (value: string) => {
//     setAnswers(prev => ({
//       ...prev,
//       [currentQuestion.id]: value,
//     }));

//     // Save answer to backend immediately
//     if (sessionId) {
//       try {
//         const token = localStorage.getItem('relationsync_token');
//         await axios.post(`/api/questionnaire/${sessionId}/answer`, {
//           question_id: parseInt(currentQuestion.id),
//           answer_text: value,
//           selected_option_id: currentQuestion.type === 'multiple-choice' ? 
//             currentQuestion.options?.findIndex(opt => opt === value) + 1 : null
//         }, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       } catch (err) {
//         console.error('Failed to save answer:', err);
//       }
//     }
//   };

//   const nextQuestion = () => {
//     if (currentQuestionIndex < QUESTIONNAIRE_QUESTIONS.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     }
//   };

//   const previousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!sessionId) {
//       setError('No active session. Please refresh and try again.');
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);
    
//     try {
//       const token = localStorage.getItem('relationsync_token');
      
//       // Complete questionnaire session
//       await axios.post(`/api/questionnaire/${sessionId}/complete`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       // Generate AI report
//       await axios.post(`/api/ai/generate-report/${sessionId}`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       // Update user status
//       updateUser({ 
//         questionnaireTaken: true,
//         reportGenerated: true,
//       });
      
//       navigate('/report');
//     } catch (err: any) {
//       console.error('Failed to generate report:', err);
//       setError(err.response?.data?.message || 'Failed to generate report. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const renderQuestionInput = (question: Question) => {
//     const currentAnswer = answers[question.id] || '';

//     switch (question.type) {
//       case 'text':
//         return (
//           <textarea
//             value={currentAnswer}
//             onChange={(e) => handleAnswerChange(e.target.value)}
//             className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-24 sm:h-32 text-sm sm:text-base"
//             placeholder="Share your thoughts..."
//           />
//         );

//       case 'multiple-choice':
//         return (
//           <div className="space-y-2 sm:space-y-3">
//             {question.options?.map((option, index) => (
//               <motion.label
//                 key={index}
//                 whileHover={{ scale: 1.01 }}
//                 className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 cursor-pointer transition-colors bg-white dark:bg-gray-700"
//               >
//                 <input
//                   type="radio"
//                   name={question.id}
//                   value={option}
//                   checked={currentAnswer === option}
//                   onChange={(e) => handleAnswerChange(e.target.value)}
//                   className="text-purple-600 focus:ring-purple-500"
//                 />
//                 <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{option}</span>
//               </motion.label>
//             ))}
//           </div>
//         );

//       case 'scale':
//         return (
//           <div className="space-y-3 sm:space-y-4">
//             <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
//               <span>Strongly Disagree</span>
//               <span>Strongly Agree</span>
//             </div>
//             <div className="flex justify-between items-center space-x-1 sm:space-x-2">
//               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
//                 <motion.button
//                   key={value}
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => handleAnswerChange(value.toString())}
//                   className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 font-medium transition-colors text-xs sm:text-sm ${
//                     currentAnswer === value.toString()
//                       ? 'bg-purple-600 border-purple-600 text-white'
//                       : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700'
//                   }`}
//                 >
//                   {value}
//                 </motion.button>
//               ))}
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   const isLastQuestion = currentQuestionIndex === QUESTIONNAIRE_QUESTIONS.length - 1;
//   const canProceed = answers[currentQuestion.id];

//   if (error && !sessionId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <Card className="p-8 text-center max-w-md">
//           <div className="text-red-500 mb-4">⚠️</div>
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connection Error</h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
//           <Button onClick={() => window.location.reload()}>
//             Try Again
//           </Button>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-2 sm:p-4 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-4 sm:mb-8"
//         >
//           <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-3 sm:mb-4">
//             <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//           </div>
//           <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
//             Relationship Questionnaire
//           </h1>
//           <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
//             Question {currentQuestionIndex + 1} of {QUESTIONNAIRE_QUESTIONS.length}
//           </p>
//         </motion.div>

//         {/* Progress Bar */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="mb-4 sm:mb-8"
//         >
//           <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${progress}%` }}
//               transition={{ duration: 0.5 }}
//               className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 sm:h-3 rounded-full"
//             />
//           </div>
//           <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
//             <span>Progress</span>
//             <span>{Math.round(progress)}%</span>
//           </div>
//         </motion.div>

//         {/* Error Message */}
//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6"
//           >
//             {error}
//           </motion.div>
//         )}

//         {/* Question Card */}
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentQuestionIndex}
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Card className="p-4 sm:p-6 lg:p-8 mb-4 sm:mb-8">
//               <div className="mb-4 sm:mb-6">
//                 <div className="inline-block px-2 py-1 sm:px-3 sm:py-1 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
//                   {currentQuestion.category}
//                 </div>
//                 <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
//                   {currentQuestion.text}
//                 </h2>
//               </div>

//               {renderQuestionInput(currentQuestion)}
//             </Card>
//           </motion.div>
//         </AnimatePresence>

//         {/* Navigation */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0"
//         >
//           <Button
//             variant="outline"
//             onClick={previousQuestion}
//             disabled={currentQuestionIndex === 0}
//             icon={ChevronLeft}
//             size="sm"
//             className="w-full sm:w-auto"
//           >
//             Previous
//           </Button>

//           <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-first sm:order-none">
//             {Object.keys(answers).length} of {QUESTIONNAIRE_QUESTIONS.length} answered
//           </div>

//           {isLastQuestion ? (
//             <Button
//               variant="primary"
//               onClick={handleSubmit}
//               disabled={!canProceed || !sessionId}
//               loading={isSubmitting}
//               icon={Save}
//               size="sm"
//               className="w-full sm:w-auto"
//             >
//               {isSubmitting ? 'Generating Report...' : 'Generate Report'}
//             </Button>
//           ) : (
//             <Button
//               variant="primary"
//               onClick={nextQuestion}
//               disabled={!canProceed}
//               icon={ChevronRight}
//               size="sm"
//               className="w-full sm:w-auto"
//             >
//               Next
//             </Button>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronLeft, ChevronRight, Save, Brain, CheckCircle } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { Button } from '../components/ui/Button';
// import { Card } from '../components/ui/Card';
// import { QUESTIONNAIRE_QUESTIONS } from '../data/questions';
// import { Question } from '../types';
// import axios from 'axios';

// export const Questionnaire: React.FC = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [sessionId, setSessionId] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [showCompletion, setShowCompletion] = useState(false);
//   const { updateUser, user } = useAuth();
//   const navigate = useNavigate();

//   const currentQuestion = QUESTIONNAIRE_QUESTIONS[currentQuestionIndex];
//   const progress = ((currentQuestionIndex + 1) / QUESTIONNAIRE_QUESTIONS.length) * 100;

//   // Check if user already completed questionnaire
//   useEffect(() => {
//     if (user?.questionnaireTaken) {
//       setShowCompletion(true);
//     } else {
//       startQuestionnaireSession();
//     }
//   }, [user]);

//   const startQuestionnaireSession = async () => {
//     try {
//       const token = localStorage.getItem('relationsync_token');
//       const response = await axios.post('/api/questionnaire/start', {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setSessionId(response.data.data.sessionId);
//     } catch (err: any) {
//       console.error('Failed to start questionnaire session:', err);
//       setError('Failed to start questionnaire. Please try again.');
//     }
//   };

//   const handleAnswerChange = async (value: string) => {
//     setAnswers(prev => ({
//       ...prev,
//       [currentQuestion.id]: value,
//     }));

//     // Save answer to backend immediately
//     if (sessionId) {
//       try {
//         const token = localStorage.getItem('relationsync_token');
//         await axios.post(`/api/questionnaire/${sessionId}/answer`, {
//           question_id: parseInt(currentQuestion.id),
//           answer_text: value,
//           selected_option_id: currentQuestion.type === 'multiple-choice' && Array.isArray(currentQuestion.options)
//             ? currentQuestion.options.findIndex(opt => opt === value) + 1
//             : null
//         }, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       } catch (err) {
//         console.error('Failed to save answer:', err);
//       }
//     }
//   };

//   const nextQuestion = () => {
//     if (currentQuestionIndex < QUESTIONNAIRE_QUESTIONS.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     }
//   };

//   const previousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//     }
//   };

//   const handleCompleteQuestionnaire = async () => {
//     if (!sessionId) {
//       setError('No active session. Please refresh and try again.');
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);
    
//     try {
//       const token = localStorage.getItem('relationsync_token');
      
//       // Complete questionnaire session
//       await axios.post(`/api/questionnaire/${sessionId}/complete`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       // Update user status
//       updateUser({ 
//         questionnaireTaken: true,
//       });
      
//       setShowCompletion(true);
//     } catch (err: any) {
//       console.error('Failed to complete questionnaire:', err);
//       setError(err.response?.data?.message || 'Failed to complete questionnaire. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleGenerateReport = async () => {
//     if (!sessionId) {
//       setError('No session found. Please try again.');
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);
    
//     try {
//       const token = localStorage.getItem('relationsync_token');
      
//       // Generate AI report
//       await axios.post(`/api/ai/generate-report/${sessionId}`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       // Update user status
//       updateUser({ 
//         reportGenerated: true,
//       });
      
//       navigate('/report');
//     } catch (err: any) {
//       console.error('Failed to generate report:', err);
//       setError(err.response?.data?.message || 'Failed to generate report. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const startNewQuestionnaire = () => {
//     setShowCompletion(false);
//     setCurrentQuestionIndex(0);
//     setAnswers({});
//     setSessionId(null);
//     startQuestionnaireSession();
//   };

//   const renderQuestionInput = (question: Question) => {
//     const currentAnswer = answers[question.id] || '';

//     switch (question.type) {
//       case 'text':
//         return (
//           <textarea
//             value={currentAnswer}
//             onChange={(e) => handleAnswerChange(e.target.value)}
//             className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-24 sm:h-32 text-sm sm:text-base"
//             placeholder="Share your thoughts..."
//           />
//         );

//       case 'multiple-choice':
//         return (
//           <div className="space-y-2 sm:space-y-3">
//             {question.options?.map((option, index) => (
//               <motion.label
//                 key={index}
//                 whileHover={{ scale: 1.01 }}
//                 className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 cursor-pointer transition-colors bg-white dark:bg-gray-700"
//               >
//                 <input
//                   type="radio"
//                   name={question.id}
//                   value={option}
//                   checked={currentAnswer === option}
//                   onChange={(e) => handleAnswerChange(e.target.value)}
//                   className="text-purple-600 focus:ring-purple-500"
//                 />
//                 <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{option}</span>
//               </motion.label>
//             ))}
//           </div>
//         );

//       case 'scale':
//         return (
//           <div className="space-y-3 sm:space-y-4">
//             <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
//               <span>Strongly Disagree</span>
//               <span>Strongly Agree</span>
//             </div>
//             <div className="flex justify-between items-center space-x-1 sm:space-x-2">
//               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
//                 <motion.button
//                   key={value}
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => handleAnswerChange(value.toString())}
//                   className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 font-medium transition-colors text-xs sm:text-sm ${
//                     currentAnswer === value.toString()
//                       ? 'bg-purple-600 border-purple-600 text-white'
//                       : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700'
//                   }`}
//                 >
//                   {value}
//                 </motion.button>
//               ))}
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   // Show completion screen if questionnaire is already taken
//   if (showCompletion) {
//     return (
//       <div className="min-h-screen p-2 sm:p-4 lg:p-8">
//         <div className="max-w-4xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center"
//           >
//             <Card className="p-6 lg:p-8">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full mb-6">
//                 <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
//               </div>
              
//               <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
//                 Questionnaire Completed! 🎉
//               </h1>
              
//               <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
//                 You've successfully completed your relationship assessment. You can now generate your personalized report or take a new questionnaire with updated responses.
//               </p>

//               {error && (
//                 <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
//                   {error}
//                 </div>
//               )}

//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <Button
//                   onClick={handleGenerateReport}
//                   loading={isSubmitting}
//                   icon={Brain}
//                   size="lg"
//                   className="text-sm lg:text-base"
//                 >
//                   {user?.reportGenerated ? 'View Your Report' : 'Generate AI Report'}
//                 </Button>
                
//                 <Button
//                   variant="outline"
//                   onClick={startNewQuestionnaire}
//                   size="lg"
//                   className="text-sm lg:text-base"
//                 >
//                   Take New Questionnaire
//                 </Button>
                
//                 <Button
//                   variant="ghost"
//                   onClick={() => navigate('/dashboard')}
//                   size="lg"
//                   className="text-sm lg:text-base"
//                 >
//                   Back to Dashboard
//                 </Button>
//               </div>
//             </Card>
//           </motion.div>
//         </div>
//       </div>
//     );
//   }

//   const isLastQuestion = currentQuestionIndex === QUESTIONNAIRE_QUESTIONS.length - 1;
//   const canProceed = answers[currentQuestion.id];

//   if (error && !sessionId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <Card className="p-8 text-center max-w-md">
//           <div className="text-red-500 mb-4">⚠️</div>
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connection Error</h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
//           <Button onClick={() => window.location.reload()}>
//             Try Again
//           </Button>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-2 sm:p-4 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-4 sm:mb-8"
//         >
//           <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-3 sm:mb-4">
//             <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//           </div>
//           <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
//             Relationship Questionnaire
//           </h1>
//           <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
//             Question {currentQuestionIndex + 1} of {QUESTIONNAIRE_QUESTIONS.length}
//           </p>
//         </motion.div>

//         {/* Progress Bar */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="mb-4 sm:mb-8"
//         >
//           <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${progress}%` }}
//               transition={{ duration: 0.5 }}
//               className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 sm:h-3 rounded-full"
//             />
//           </div>
//           <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
//             <span>Progress</span>
//             <span>{Math.round(progress)}%</span>
//           </div>
//         </motion.div>

//         {/* Error Message */}
//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6"
//           >
//             {error}
//           </motion.div>
//         )}

//         {/* Question Card */}
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentQuestionIndex}
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Card className="p-4 sm:p-6 lg:p-8 mb-4 sm:mb-8">
//               <div className="mb-4 sm:mb-6">
//                 <div className="inline-block px-2 py-1 sm:px-3 sm:py-1 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
//                   {currentQuestion.category}
//                 </div>
//                 <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
//                   {currentQuestion.text}
//                 </h2>
//               </div>

//               {renderQuestionInput(currentQuestion)}
//             </Card>
//           </motion.div>
//         </AnimatePresence>

//         {/* Navigation */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0"
//         >
//           <Button
//             variant="outline"
//             onClick={previousQuestion}
//             disabled={currentQuestionIndex === 0}
//             icon={ChevronLeft}
//             size="sm"
//             className="w-full sm:w-auto"
//           >
//             Previous
//           </Button>

//           <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-first sm:order-none">
//             {Object.keys(answers).length} of {QUESTIONNAIRE_QUESTIONS.length} answered
//           </div>

//           {isLastQuestion ? (
//             <Button
//               variant="primary"
//               onClick={handleCompleteQuestionnaire}
//               disabled={!canProceed || !sessionId}
//               loading={isSubmitting}
//               icon={Save}
//               size="sm"
//               className="w-full sm:w-auto"
//             >
//               {isSubmitting ? 'Completing...' : 'Complete Questionnaire'}
//             </Button>
//           ) : (
//             <Button
//               variant="primary"
//               onClick={nextQuestion}
//               disabled={!canProceed}
//               icon={ChevronRight}
//               size="sm"
//               className="w-full sm:w-auto"
//             >
//               Next
//             </Button>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// };
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronLeft, ChevronRight, Save, Brain, CheckCircle } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { Button } from '../components/ui/Button';
// import { Card } from '../components/ui/Card';
// import { QUESTIONNAIRE_QUESTIONS } from '../data/questions';
// import { Question } from '../types';
// import axios from 'axios';

// export const Questionnaire: React.FC = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [sessionId, setSessionId] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [showCompletion, setShowCompletion] = useState(false);
//   const { updateUser, user } = useAuth();
//   const navigate = useNavigate();

//   const currentQuestion = QUESTIONNAIRE_QUESTIONS[currentQuestionIndex];
//   const progress = ((currentQuestionIndex + 1) / QUESTIONNAIRE_QUESTIONS.length) * 100;

//   // Check if user already completed questionnaire
//   useEffect(() => {
//     if (user?.questionnaireTaken) {
//       setShowCompletion(true);
//     } else {
//       startQuestionnaireSession();
//     }
//   }, [user]);

//   const startQuestionnaireSession = async () => {
//     try {
//       const token = localStorage.getItem('relationsync_token');
//       const response = await axios.post('/api/questionnaire/start', {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setSessionId(response.data.data.sessionId);
//     } catch (err: any) {
//       console.error('Failed to start questionnaire session:', err);
//       setError('Failed to start questionnaire. Please try again.');
//     }
//   };

//   const handleAnswerChange = async (value: string) => {
//     setAnswers(prev => ({
//       ...prev,
//       [currentQuestion.id]: value,
//     }));

//     // Save answer to backend immediately
//     if (sessionId) {
//       try {
//         const token = localStorage.getItem('relationsync_token');
//         await axios.post(`/api/questionnaire/${sessionId}/answer`, {
//           question_id: parseInt(currentQuestion.id),
//           answer_text: value,
//           selected_option_id: currentQuestion.type === 'multiple-choice' && Array.isArray(currentQuestion.options)
//             ? currentQuestion.options.findIndex(opt => opt === value) + 1
//             : null
//         }, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       } catch (err) {
//         console.error('Failed to save answer:', err);
//       }
//     }
//   };

//   const nextQuestion = () => {
//     if (currentQuestionIndex < QUESTIONNAIRE_QUESTIONS.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     }
//   };

//   const previousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//     }
//   };

//   const handleCompleteQuestionnaire = async () => {
//     if (!sessionId) {
//       setError('No active session. Please refresh and try again.');
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);
    
//     try {
//       const token = localStorage.getItem('relationsync_token');
      
//       // Complete questionnaire session
//       await axios.post(`/api/questionnaire/${sessionId}/complete`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       // Update user status
//       updateUser({ 
//         questionnaireTaken: true,
//       });
      
//       setShowCompletion(true);
//     } catch (err: any) {
//       console.error('Failed to complete questionnaire:', err);
//       setError(err.response?.data?.message || 'Failed to complete questionnaire. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleGenerateReport = async () => {
//     if (!sessionId) {
//       setError('No session found. Please try again.');
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);
    
//     try {
//       const token = localStorage.getItem('relationsync_token');
      
//       // Generate AI report
//       await axios.post(`/api/ai/generate-report/${sessionId}`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       // Update user status
//       updateUser({ 
//         reportGenerated: true,
//       });
      
//       navigate('/report');
//     } catch (err: any) {
//       console.error('Failed to generate report:', err);
//       setError(err.response?.data?.message || 'Failed to generate report. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const startNewQuestionnaire = () => {
//     setShowCompletion(false);
//     setCurrentQuestionIndex(0);
//     setAnswers({});
//     setSessionId(null);
//     startQuestionnaireSession();
//   };

//   const renderQuestionInput = (question: Question) => {
//     const currentAnswer = answers[question.id] || '';

//     switch (question.type) {
//       case 'text':
//         return (
//           <textarea
//             value={currentAnswer}
//             onChange={(e) => handleAnswerChange(e.target.value)}
//             className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-24 sm:h-32 text-sm sm:text-base"
//             placeholder="Share your thoughts..."
//           />
//         );

//       case 'multiple-choice':
//         return (
//           <div className="space-y-2 sm:space-y-3">
//             {question.options?.map((option, index) => (
//               <motion.label
//                 key={index}
//                 whileHover={{ scale: 1.01 }}
//                 className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 cursor-pointer transition-colors bg-white dark:bg-gray-700"
//               >
//                 <input
//                   type="radio"
//                   name={question.id}
//                   value={option}
//                   checked={currentAnswer === option}
//                   onChange={(e) => handleAnswerChange(e.target.value)}
//                   className="text-purple-600 focus:ring-purple-500"
//                 />
//                 <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{option}</span>
//               </motion.label>
//             ))}
//           </div>
//         );

//       case 'scale':
//         return (
//           <div className="space-y-3 sm:space-y-4">
//             <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
//               <span>Strongly Disagree</span>
//               <span>Strongly Agree</span>
//             </div>
//             <div className="relative">
//               <input
//                 type="range"
//                 min="1"
//                 max="10"
//                 step="1"
//                 value={currentAnswer || '5'}
//                 onChange={(e) => handleAnswerChange(e.target.value)}
//                 className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
//               />
//               <div className="absolute top-0 left-0 h-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600" 
//                    style={{ width: `${((parseInt(currentAnswer) || 5) - 1) * 11.11}%` }} />
//               <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
//                 {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
//                   <span key={value} className={currentAnswer === value.toString() ? 'text-purple-600 font-medium' : ''}>
//                     {value}
//                   </span>
//                 ))}
//               </div>
//             </div>
//             <style>{`
//               input[type='range']::-webkit-slider-thumb {
//                 -webkit-appearance: none;
//                 appearance: none;
//                 width: 16px;
//                 height: 16px;
//                 border-radius: 50%;
//                 background: #ffffff;
//                 border: 2px solid #9333ea;
//                 cursor: pointer;
//                 box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
//               }
//               input[type='range']::-moz-range-thumb {
//                 width: 16px;
//                 height: 16px;
//                 border-radius: 50%;
//                 background: #ffffff;
//                 border: 2px solid #9333ea;
//                 cursor: pointer;
//                 box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
//               }
//               input[type='range']::-ms-thumb {
//                 width: 16px;
//                 height: 16px;
//                 border-radius: 50%;
//                 background: #ffffff;
//                 border: 2px solid #9333ea;
//                 cursor: pointer;
//                 box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
//               }
//             `}</style>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   // Show completion screen if questionnaire is already taken
//   if (showCompletion) {
//     return (
//       <div className="min-h-screen p-2 sm:p-4 lg:p-8">
//         <div className="max-w-4xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center"
//           >
//             <Card className="p-6 lg:p-8">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg tyrannosaurus rex-blue-100 dark:bg-green-800 rounded-full mb-6">
//                 <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
//               </div>
              
//               <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
//                 Questionnaire Completed! 🎉
//               </h1>
              
//               <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
//                 You've successfully completed your relationship assessment. You can now generate your personalized report or take a new questionnaire with updated responses.
//               </p>

//               {error && (
//                 <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
//                   {error}
//                 </div>
//               )}

//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <Button
//                   onClick={handleGenerateReport}
//                   loading={isSubmitting}
//                   icon={Brain}
//                   size="lg"
//                   className="text-sm lg:text-base"
//                 >
//                   {user?.reportGenerated ? 'View Your Report' : 'Generate AI Report'}
//                 </Button>
                
//                 <Button
//                   variant="outline"
//                   onClick={startNewQuestionnaire}
//                   size="lg"
//                   className="text-sm lg:text-base"
//                 >
//                   Take New Questionnaire
//                 </Button>
                
//                 <Button
//                   variant="ghost"
//                   onClick={() => navigate('/dashboard')}
//                   size="lg"
//                   className="text-sm lg:text-base"
//                 >
//                   Back to Dashboard
//                 </Button>
//               </div>
//             </Card>
//           </motion.div>
//         </div>
//       </div>
//     );
//   }

//   const isLastQuestion = currentQuestionIndex === QUESTIONNAIRE_QUESTIONS.length - 1;
//   const canProceed = answers[currentQuestion.id];

//   if (error && !sessionId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <Card className="p-8 text-center max-w-md">
//           <div className="text-red-500 mb-4">⚠️</div>
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connection Error</h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
//           <Button onClick={() => window.location.reload()}>
//             Try Again
//           </Button>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-2 sm:p-4 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-4 sm:mb-8"
//         >
//           <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-3 sm:mb-4">
//             <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//           </div>
//           <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
//             Relationship Questionnaire
//           </h1>
//           <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
//             Question {currentQuestionIndex + 1} of {QUESTIONNAIRE_QUESTIONS.length}
//           </p>
//         </motion.div>

//         {/* Progress Bar */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="mb-4 sm:mb-8"
//         >
//           <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${progress}%` }}
//               transition={{ duration: 0.5 }}
//               className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 sm:h-3 rounded-full"
//             />
//           </div>
//           <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
//             <span>Progress</span>
//             <span>{Math.round(progress)}%</span>
//           </div>
//         </motion.div>

//         {/* Error Message */}
//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6"
//           >
//             {error}
//           </motion.div>
//         )}

//         {/* Question Card */}
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentQuestionIndex}
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Card className="p-4 sm:p-6 lg:p-8 mb-4 sm:mb-8">
//               <div className="mb-4 sm:mb-6">
//                 <div className="inline-block px-2 py-1 sm:px-3 sm:py-1 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
//                   {currentQuestion.category}
//                 </div>
//                 <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
//                   {currentQuestion.text}
//                 </h2>
//               </div>

//               {renderQuestionInput(currentQuestion)}
//             </Card>
//           </motion.div>
//         </AnimatePresence>

//         {/* Navigation */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0"
//         >
//           <Button
//             variant="outline"
//             onClick={previousQuestion}
//             disabled={currentQuestionIndex === 0}
//             icon={ChevronLeft}
//             size="sm"
//             className="w-full sm:w-auto"
//           >
//             Previous
//           </Button>

//           <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-first sm:order-none">
//             {Object.keys(answers).length} of {QUESTIONNAIRE_QUESTIONS.length} answered
//           </div>

//           {isLastQuestion ? (
//             <Button
//               variant="primary"
//               onClick={handleCompleteQuestionnaire}
//               disabled={!canProceed || !sessionId}
//               loading={isSubmitting}
//               icon={Save}
//               size="sm"
//               className="w-full sm:w-auto"
//             >
//               {isSubmitting ? 'Completing...' : 'Complete Questionnaire'}
//             </Button>
//           ) : (
//             <Button
//               variant="primary"
//               onClick={nextQuestion}
//               disabled={!canProceed}
//               icon={ChevronRight}
//               size="sm"
//               className="w-full sm:w-auto"
//             >
//               Next
//             </Button>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Save, Brain, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { QUESTIONNAIRE_QUESTIONS } from '../data/questions';
import { Question } from '../types';
import axios from 'axios';

export const Questionnaire: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const { updateUser, user } = useAuth();
  const navigate = useNavigate();

  const currentQuestion = QUESTIONNAIRE_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONNAIRE_QUESTIONS.length) * 100;

  // Check if user already completed questionnaire
  useEffect(() => {
    if (user?.questionnaireTaken) {
      setShowCompletion(true);
    } else {
      startQuestionnaireSession();
    }
  }, [user]);

  const startQuestionnaireSession = async () => {
    try {
      const token = localStorage.getItem('relationsync_token');
      const response = await axios.post('/api/questionnaire/start', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessionId(response.data.data.sessionId);
    } catch (err: any) {
      console.error('Failed to start questionnaire session:', err);
      setError('Failed to start questionnaire. Please try again.');
    }
  };

  const handleAnswerChange = async (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));

    // Save answer to backend immediately
    if (sessionId) {
      try {
        const token = localStorage.getItem('relationsync_token');
        await axios.post(`/api/questionnaire/${sessionId}/answer`, {
          question_id: parseInt(currentQuestion.id),
          answer_text: value,
          selected_option_id: currentQuestion.type === 'multiple-choice' && Array.isArray(currentQuestion.options)
            ? currentQuestion.options.findIndex(opt => opt === value) + 1
            : null
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Failed to save answer:', err);
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < QUESTIONNAIRE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleCompleteQuestionnaire = async () => {
    if (!sessionId) {
      setError('No active session. Please refresh and try again.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('relationsync_token');
      
      // Complete questionnaire session
      await axios.post(`/api/questionnaire/${sessionId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update user status
      updateUser({ 
        questionnaireTaken: true,
      });
      
      setShowCompletion(true);
    } catch (err: any) {
      console.error('Failed to complete questionnaire:', err);
      setError(err.response?.data?.message || 'Failed to complete questionnaire. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!sessionId) {
      setError('No session found. Please try again.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('relationsync_token');
      
      // Generate AI report
      await axios.post(`/api/ai/generate-report/${sessionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update user status
      updateUser({ 
        reportGenerated: true,
      });
      
      navigate('/report');
    } catch (err: any) {
      console.error('Failed to generate report:', err);
      setError(err.response?.data?.message || 'Failed to generate report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startNewQuestionnaire = () => {
    setShowCompletion(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSessionId(null);
    startQuestionnaireSession();
  };

  const renderQuestionInput = (question: Question) => {
    const currentAnswer = answers[question.id] || '';

    switch (question.type) {
      case 'text':
        return (
          <textarea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-24 sm:h-32 text-sm sm:text-base"
            placeholder="Share your thoughts..."
          />
        );

      case 'multiple-choice':
        return (
          <div className="space-y-2 sm:space-y-3">
            {question.options?.map((option, index) => (
              <motion.label
                key={index}
                whileHover={{ scale: 1.01 }}
                className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 cursor-pointer transition-colors bg-white dark:bg-gray-700"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{option}</span>
              </motion.label>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
            <div className="relative w-full">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={currentAnswer || '5'}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div
                className="absolute h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"
                style={{ width: `${((parseInt(currentAnswer) || 5) / 10) * 100}%`, top: 0, left: 0 }}
              />
              <style jsx>{`
                input[type='range'] {
                  -webkit-appearance: none;
                  appearance: none;
                  background: transparent;
                }
                input[type='range']::-webkit-slider-runnable-track {
                  background: transparent;
                  height: 2px;
                }
                input[type='range']::-moz-range-track {
                  background: transparent;
                  height: 2px;
                }
                input[type='range']::-ms-track {
                  background: transparent;
                  height: 2px;
                }
                input[type='range']::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 16px;
                  height: 16px;
                  background: white;
                  border: 2px solid #9333ea;
                  border-radius: 50%;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                  margin-top: -7px;
                }
                input[type='range']::-moz-range-thumb {
                  width: 16px;
                  height: 16px;
                  background: white;
                  border: 2px solid #9333ea;
                  border-radius: 50%;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
                input[type='range']::-ms-thumb {
                  width: 16px;
                  height: 16px;
                  background: white;
                  border: 2px solid #9333ea;
                  border-radius: 50%;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
              `}</style>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show completion screen if questionnaire is already taken
  if (showCompletion) {
    return (
      <div className="min-h-screen p-2 sm:p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="p-6 lg:p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full mb-6">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Questionnaire Completed! 🎉
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                You've successfully completed your relationship assessment. You can now generate your personalized report or take a new questionnaire with updated responses.
              </p>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleGenerateReport}
                  loading={isSubmitting}
                  icon={Brain}
                  size="lg"
                  className="text-sm lg:text-base"
                >
                  {user?.reportGenerated ? 'View Your Report' : 'Generate AI Report'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={startNewQuestionnaire}
                  size="lg"
                  className="text-sm lg:text-base"
                >
                  Take New Questionnaire
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                  className="text-sm lg:text-base"
                >
                  Back to Dashboard
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentQuestionIndex === QUESTIONNAIRE_QUESTIONS.length - 1;
  const canProceed = answers[currentQuestion.id];

  if (error && !sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connection Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 sm:mb-8"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-3 sm:mb-4">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            Relationship Questionnaire
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Question {currentQuestionIndex + 1} of {QUESTIONNAIRE_QUESTIONS.length}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 sm:mb-8"
        >
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 sm:h-3 rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 sm:p-6 lg:p-8 mb-4 sm:mb-8">
              <div className="mb-4 sm:mb-6">
                <div className="inline-block px-2 py-1 sm:px-3 sm:py-1 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                  {currentQuestion.category}
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
                  {currentQuestion.text}
                </h2>
              </div>

              {renderQuestionInput(currentQuestion)}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0"
        >
          <Button
            variant="outline"
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            icon={ChevronLeft}
            size="sm"
            className="w-full sm:w-auto"
          >
            Previous
          </Button>

          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-first sm:order-none">
            {Object.keys(answers).length} of {QUESTIONNAIRE_QUESTIONS.length} answered
          </div>

          {isLastQuestion ? (
            <Button
              variant="primary"
              onClick={handleCompleteQuestionnaire}
              disabled={!canProceed || !sessionId}
              loading={isSubmitting}
              icon={Save}
              size="sm"
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Completing...' : 'Complete Questionnaire'}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={nextQuestion}
              disabled={!canProceed}
              icon={ChevronRight}
              size="sm"
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
};