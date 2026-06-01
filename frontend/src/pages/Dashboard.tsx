// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { 
//   FileText, 
//   Users, 
//   Brain, 
//   Calendar, 
//   CheckCircle, 
//   Clock, 
//   ArrowRight,
//   Heart,
//   UserPlus,
//   TrendingUp,
//   Sparkles
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { Button } from '../components/ui/Button';
// import { Card } from '../components/ui/Card';
// import axios from 'axios';

// interface PairStatus {
//   pairId: string;
//   isConnected: boolean;
//   partnerName?: string;
//   partnerEmail?: string;
//   partnerQuestionnaireTaken?: boolean;
// }

// export const Dashboard: React.FC = () => {
//   const { user, refreshUserData } = useAuth();
//   const navigate = useNavigate();
//   const [pairStatus, setPairStatus] = useState<PairStatus | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchPairStatus();
//     refreshUserData();
//   }, []);

//   const fetchPairStatus = async () => {
//     try {
//       const token = localStorage.getItem('relationsync_token');
//       const response = await axios.get('/api/pair/status', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setPairStatus(response.data.data);
//     } catch (error) {
//       console.error('Failed to fetch pair status:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextSteps = [
//     {
//       title: 'Complete Your Profile',
//       description: 'Add more details to get better AI insights',
//       icon: Users,
//       action: () => navigate('/profile'),
//       completed: true,
//     },
//     {
//       title: 'Take the Questionnaire',
//       description: '40 deep questions to understand your relationship patterns',
//       icon: FileText,
//       action: () => navigate('/questionnaire'),
//       completed: user?.questionnaireTaken || false,
//     },
//     {
//       title: 'View Your Solo Report',
//       description: 'Get personalized insights about your relationship style',
//       icon: Brain,
//       action: () => navigate('/report'),
//       completed: user?.reportGenerated || false,
//       disabled: !user?.questionnaireTaken,
//     },
//     {
//       title: 'Connect with Partner',
//       description: 'Sync accounts to unlock couple features',
//       icon: UserPlus,
//       action: () => navigate('/pair'),
//       completed: pairStatus?.isConnected || false,
//     },
//   ];

//   const stats = [
//     { 
//       label: 'Questionnaire Progress', 
//       value: user?.questionnaireTaken ? '100%' : '0%',
//       color: user?.questionnaireTaken ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'
//     },
//     { 
//       label: 'AI Insights Generated', 
//       value: user?.reportGenerated ? '1' : '0',
//       color: user?.reportGenerated ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
//     },
//     { 
//       label: 'Partner Connection', 
//       value: pairStatus?.isConnected ? 'Connected' : 'Pending',
//       color: pairStatus?.isConnected ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
//     },
//     { 
//       label: 'Weekly Syncs', 
//       value: '0',
//       color: 'text-gray-600 dark:text-gray-400'
//     },
//   ];

//   const canGenerateCoupleReport = pairStatus?.isConnected && 
//                                   user?.questionnaireTaken && 
//                                   pairStatus?.partnerQuestionnaireTaken;

//   return (
//     <div className="min-h-screen p-2 sm:p-4 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Welcome Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-4 sm:mb-8"
//         >
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
//             Welcome back, {user?.name}! 👋
//           </h1>
//           <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
//             Continue your relationship journey and discover deeper connections
//           </p>
//         </motion.div>

//         {/* Stats Grid */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8"
//         >
//           {stats.map((stat, index) => (
//             <Card key={index} className="p-3 sm:p-6 text-center">
//               <div className={`text-lg sm:text-2xl font-bold mb-1 ${stat.color}`}>
//                 {stat.value}
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
//             </Card>
//           ))}
//         </motion.div>

//         {/* Couple Report Section */}
//         {pairStatus?.isConnected && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.15 }}
//             className="mb-4 sm:mb-8"
//           >
//             <Card className={`p-4 sm:p-6 ${canGenerateCoupleReport ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800' : 'bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800'}`}>
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
//                 <div className="flex items-center space-x-4">
//                   <div className={`p-3 rounded-full ${canGenerateCoupleReport ? 'bg-green-100 dark:bg-green-800' : 'bg-orange-100 dark:bg-orange-800'}`}>
//                     <Sparkles className={`w-6 h-6 ${canGenerateCoupleReport ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`} />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                       Couple Report with {pairStatus.partnerName}
//                     </h3>
//                     <p className="text-sm text-gray-600 dark:text-gray-300">
//                       {canGenerateCoupleReport 
//                         ? 'Both questionnaires completed! Generate your couple insights now.'
//                         : `Waiting for ${pairStatus.partnerName} to complete their questionnaire.`
//                       }
//                     </p>
//                   </div>
//                 </div>
//                 <Button
//                   variant={canGenerateCoupleReport ? "primary" : "outline"}
//                   size="sm"
//                   disabled={!canGenerateCoupleReport}
//                   onClick={() => navigate('/couple-report')}
//                   icon={canGenerateCoupleReport ? Sparkles : Clock}
//                   className="w-full sm:w-auto"
//                 >
//                   {canGenerateCoupleReport ? 'Generate Couple Report' : 'Waiting for Partner'}
//                 </Button>
//               </div>
//             </Card>
//           </motion.div>
//         )}

//         {/* Next Steps */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="mb-4 sm:mb-8"
//         >
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-6">Your Journey</h2>
//           <div className="grid gap-2 sm:gap-4">
//             {nextSteps.map((step, index) => (
//               <Card key={index} hover className="p-3 sm:p-6">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
//                   <div className="flex items-center space-x-3 sm:space-x-4">
//                     <div className={`p-2 sm:p-3 rounded-lg ${
//                       step.completed 
//                         ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400' 
//                         : step.disabled
//                         ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
//                         : 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-400'
//                     }`}>
//                       {step.completed ? (
//                         <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
//                       ) : (
//                         <step.icon className="w-4 h-4 sm:w-6 sm:h-6" />
//                       )}
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{step.title}</h3>
//                       <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{step.description}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
//                     {step.completed && (
//                       <span className="text-green-600 dark:text-green-400 text-xs sm:text-sm font-medium">
//                         Completed
//                       </span>
//                     )}
//                     <Button
//                       variant={step.completed ? "outline" : step.disabled ? "ghost" : "primary"}
//                       size="sm"
//                       onClick={step.action}
//                       disabled={step.disabled}
//                       className="text-xs sm:text-sm"
//                     >
//                       {step.completed ? 'Review' : step.disabled ? 'Locked' : 'Start'}
//                       <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
//                     </Button>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </motion.div>

//         {/* Quick Actions */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="grid md:grid-cols-2 gap-3 sm:gap-6"
//         >
//           <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
//             <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
//               <div className="p-2 sm:p-3 bg-purple-600 rounded-lg">
//                 <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Solo Relationship Insights</h3>
//                 <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Discover your relationship patterns</p>
//               </div>
//             </div>
//             <Button 
//               variant="primary" 
//               size="sm"
//               onClick={() => navigate(user?.questionnaireTaken ? '/report' : '/questionnaire')}
//               className="w-full sm:w-auto text-xs sm:text-sm"
//             >
//               {user?.questionnaireTaken ? 'View Solo Report' : 'Take Questionnaire'}
//             </Button>
//           </Card>

//           <Card className="p-4 sm:p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-700">
//             <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
//               <div className="p-2 sm:p-3 bg-teal-600 rounded-lg">
//                 <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Partner Connection</h3>
//                 <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
//                   {pairStatus?.isConnected ? 'Generate couple insights' : 'Sync with your partner\'s account'}
//                 </p>
//               </div>
//             </div>
//             <Button 
//               variant="secondary" 
//               size="sm"
//               onClick={() => navigate(pairStatus?.isConnected ? '/couple-report' : '/pair')}
//               disabled={pairStatus?.isConnected && !canGenerateCoupleReport}
//               className="w-full sm:w-auto text-xs sm:text-sm"
//             >
//               {pairStatus?.isConnected 
//                 ? (canGenerateCoupleReport ? 'Couple Report' : 'Waiting for Partner')
//                 : 'Connect Partner'
//               }
//             </Button>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// };
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { 
//   FileText, 
//   Users, 
//   Brain, 
//   Calendar, 
//   CheckCircle, 
//   Clock, 
//   ArrowRight,
//   Heart,
//   UserPlus,
//   TrendingUp,
//   Sparkles
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { Button } from '../components/ui/Button';
// import { Card } from '../components/ui/Card';
// import axios from 'axios';

// interface PairStatus {
//   pairId: string;
//   isConnected: boolean;
//   partnerName?: string;
//   partnerEmail?: string;
//   partnerQuestionnaireTaken?: boolean;
//   partnerReportGenerated?: boolean;
// }

// export const Dashboard: React.FC = () => {
//   const { user, refreshUserData } = useAuth();
//   const navigate = useNavigate();
//   const [pairStatus, setPairStatus] = useState<PairStatus | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchPairStatus();
//     refreshUserData();
//   }, []);

//   const fetchPairStatus = async () => {
//     try {
//       const token = localStorage.getItem('relationsync_token');
//       const response = await axios.get('/api/pair/status', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setPairStatus(response.data.data);
//     } catch (error) {
//       console.error('Failed to fetch pair status:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextSteps = [
//     {
//       title: 'Complete Your Profile',
//       description: 'Add more details to get better AI insights',
//       icon: Users,
//       action: () => navigate('/profile'),
//       completed: true,
//     },
//     {
//       title: 'Take the Questionnaire',
//       description: '40 deep questions to understand your relationship patterns',
//       icon: FileText,
//       action: () => navigate('/questionnaire'),
//       completed: user?.questionnaireTaken || false,
//     },
//     {
//       title: 'View Your Solo Report',
//       description: 'Get personalized insights about your relationship style',
//       icon: Brain,
//       action: () => navigate('/report'),
//       completed: user?.reportGenerated || false,
//       disabled: !user?.questionnaireTaken,
//     },
//     {
//       title: 'Connect with Partner',
//       description: 'Sync accounts to unlock couple features',
//       icon: UserPlus,
//       action: () => navigate('/pair'),
//       completed: pairStatus?.isConnected || false,
//     },
//   ];

//   const stats = [
//     { 
//       label: 'Questionnaire Progress', 
//       value: user?.questionnaireTaken ? '100%' : '0%',
//       color: user?.questionnaireTaken ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'
//     },
//     { 
//       label: 'AI Insights Generated', 
//       value: user?.reportGenerated ? '1' : '0',
//       color: user?.reportGenerated ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
//     },
//     { 
//       label: 'Partner Connection', 
//       value: pairStatus?.isConnected ? 'Connected' : 'Pending',
//       color: pairStatus?.isConnected ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
//     },
//     { 
//       label: 'Weekly Syncs', 
//       value: '0',
//       color: 'text-gray-600 dark:text-gray-400'
//     },
//   ];

//   // Check if both partners have completed questionnaire AND generated reports
//   const canGenerateCoupleReport = pairStatus?.isConnected && 
//                                   user?.questionnaireTaken && 
//                                   user?.reportGenerated &&
//                                   pairStatus?.partnerQuestionnaireTaken &&
//                                   pairStatus?.partnerReportGenerated;

//   const getCoupleReportStatus = () => {
//     if (!pairStatus?.isConnected) {
//       return { message: 'Connect with partner first', color: 'orange' };
//     }
//     if (!user?.questionnaireTaken) {
//       return { message: 'Complete your questionnaire first', color: 'orange' };
//     }
//     if (!user?.reportGenerated) {
//       return { message: 'Generate your solo report first', color: 'orange' };
//     }
//     if (!pairStatus?.partnerQuestionnaireTaken) {
//       return { message: `Waiting for ${pairStatus.partnerName} to complete questionnaire`, color: 'orange' };
//     }
//     if (!pairStatus?.partnerReportGenerated) {
//       return { message: `Waiting for ${pairStatus.partnerName} to generate their report`, color: 'orange' };
//     }
//     return { message: 'Ready to generate couple report!', color: 'green' };
//   };

//   const coupleReportStatus = getCoupleReportStatus();

//   return (
//     <div className="min-h-screen p-2 sm:p-4 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Welcome Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-4 sm:mb-8"
//         >
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
//             Welcome back, {user?.name}! 👋
//           </h1>
//           <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
//             Continue your relationship journey and discover deeper connections
//           </p>
//         </motion.div>

//         {/* Stats Grid */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8"
//         >
//           {stats.map((stat, index) => (
//             <Card key={index} className="p-3 sm:p-6 text-center">
//               <div className={`text-lg sm:text-2xl font-bold mb-1 ${stat.color}`}>
//                 {stat.value}
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
//             </Card>
//           ))}
//         </motion.div>

//         {/* Couple Report Section */}
//         {pairStatus?.isConnected && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.15 }}
//             className="mb-4 sm:mb-8"
//           >
//             <Card className={`p-4 sm:p-6 ${canGenerateCoupleReport ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800' : 'bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800'}`}>
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
//                 <div className="flex items-center space-x-4">
//                   <div className={`p-3 rounded-full ${canGenerateCoupleReport ? 'bg-green-100 dark:bg-green-800' : 'bg-orange-100 dark:bg-orange-800'}`}>
//                     <Sparkles className={`w-6 h-6 ${canGenerateCoupleReport ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`} />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                       Couple Report with {pairStatus.partnerName}
//                     </h3>
//                     <p className="text-sm text-gray-600 dark:text-gray-300">
//                       {coupleReportStatus.message}
//                     </p>
//                   </div>
//                 </div>
//                 <Button
//                   variant={canGenerateCoupleReport ? "primary" : "outline"}
//                   size="sm"
//                   disabled={!canGenerateCoupleReport}
//                   onClick={() => navigate('/couple-report')}
//                   icon={canGenerateCoupleReport ? Sparkles : Clock}
//                   className="w-full sm:w-auto"
//                 >
//                   {canGenerateCoupleReport ? 'Generate Couple Report' : 'Requirements Not Met'}
//                 </Button>
//               </div>
//             </Card>
//           </motion.div>
//         )}

//         {/* Next Steps */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="mb-4 sm:mb-8"
//         >
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-6">Your Journey</h2>
//           <div className="grid gap-2 sm:gap-4">
//             {nextSteps.map((step, index) => (
//               <Card key={index} hover className="p-3 sm:p-6">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
//                   <div className="flex items-center space-x-3 sm:space-x-4">
//                     <div className={`p-2 sm:p-3 rounded-lg ${
//                       step.completed 
//                         ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400' 
//                         : step.disabled
//                         ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
//                         : 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-400'
//                     }`}>
//                       {step.completed ? (
//                         <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
//                       ) : (
//                         <step.icon className="w-4 h-4 sm:w-6 sm:h-6" />
//                       )}
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{step.title}</h3>
//                       <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{step.description}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
//                     {step.completed && (
//                       <span className="text-green-600 dark:text-green-400 text-xs sm:text-sm font-medium">
//                         Completed
//                       </span>
//                     )}
//                     <Button
//                       variant={step.completed ? "outline" : step.disabled ? "ghost" : "primary"}
//                       size="sm"
//                       onClick={step.action}
//                       disabled={step.disabled}
//                       className="text-xs sm:text-sm"
//                     >
//                       {step.completed ? 'Review' : step.disabled ? 'Locked' : 'Start'}
//                       <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
//                     </Button>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </motion.div>

//         {/* Quick Actions */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="grid md:grid-cols-2 gap-3 sm:gap-6"
//         >
//           <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
//             <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
//               <div className="p-2 sm:p-3 bg-purple-600 rounded-lg">
//                 <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Solo Relationship Insights</h3>
//                 <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Discover your relationship patterns</p>
//               </div>
//             </div>
//             <Button 
//               variant="primary" 
//               size="sm"
//               onClick={() => navigate(user?.questionnaireTaken ? '/report' : '/questionnaire')}
//               className="w-full sm:w-auto text-xs sm:text-sm"
//             >
//               {user?.questionnaireTaken ? 'View Solo Report' : 'Take Questionnaire'}
//             </Button>
//           </Card>

//           <Card className="p-4 sm:p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-700">
//             <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
//               <div className="p-2 sm:p-3 bg-teal-600 rounded-lg">
//                 <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Partner Connection</h3>
//                 <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
//                   {pairStatus?.isConnected ? 'Generate couple insights' : 'Sync with your partner\'s account'}
//                 </p>
//               </div>
//             </div>
//             <Button 
//               variant="secondary" 
//               size="sm"
//               onClick={() => navigate(pairStatus?.isConnected ? '/couple-report' : '/pair')}
//               disabled={pairStatus?.isConnected && !canGenerateCoupleReport}
//               className="w-full sm:w-auto text-xs sm:text-sm"
//             >
//               {pairStatus?.isConnected 
//                 ? (canGenerateCoupleReport ? 'Couple Report' : 'Requirements Not Met')
//                 : 'Connect Partner'
//               }
//             </Button>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Brain, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Heart,
  UserPlus,
  TrendingUp,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import axios from 'axios';

interface PairStatus {
  pairId: string;
  isConnected: boolean;
  partnerName?: string;
  partnerEmail?: string;
  partnerQuestionnaireTaken?: boolean;
  partnerReportGenerated?: boolean;
}

export const Dashboard: React.FC = () => {
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [pairStatus, setPairStatus] = useState<PairStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPairStatus();
    refreshUserData();
  }, []);

  const fetchPairStatus = async () => {
    try {
      const token = localStorage.getItem('relationsync_token');
      const response = await axios.get('/api/pair/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPairStatus(response.data.data);
    } catch (error) {
      console.error('Failed to fetch pair status:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSteps = [
    {
      title: 'Complete Your Profile',
      description: 'Add more details to get better AI insights',
      icon: Users,
      action: () => navigate('/profile'),
      completed: true,
    },
    {
      title: 'Take the Questionnaire',
      description: '40 deep questions to understand your relationship patterns',
      icon: FileText,
      action: () => navigate('/questionnaire'),
      completed: user?.questionnaireTaken || false,
    },
    {
      title: 'View Your Solo Report',
      description: 'Get personalized insights about your relationship style',
      icon: Brain,
      action: () => navigate('/report'),
      completed: user?.reportGenerated || false,
      disabled: !user?.questionnaireTaken,
    },
    {
      title: 'Connect with Partner',
      description: 'Sync accounts to unlock couple features',
      icon: UserPlus,
      action: () => navigate('/pair'),
      completed: pairStatus?.isConnected || false,
    },
    {
      title: 'Chat with AI Assistant',
      description: 'Get real-time relationship advice and insights',
      icon: MessageSquare,
      action: () => navigate('/chatbot'),
      completed: false,
    },
  ];

  const stats = [
    { 
      label: 'Questionnaire Progress', 
      value: user?.questionnaireTaken ? '100%' : '0%',
      color: user?.questionnaireTaken ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'
    },
    { 
      label: 'AI Insights Generated', 
      value: user?.reportGenerated ? '1' : '0',
      color: user?.reportGenerated ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
    },
    { 
      label: 'Partner Connection', 
      value: pairStatus?.isConnected ? 'Connected' : 'Pending',
      color: pairStatus?.isConnected ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
    },
    { 
      label: 'Weekly Syncs', 
      value: '0',
      color: 'text-gray-600 dark:text-gray-400'
    },
  ];

  // Check if both partners have completed questionnaire AND generated reports
  const canGenerateCoupleReport = pairStatus?.isConnected && 
                                  user?.questionnaireTaken && 
                                  user?.reportGenerated &&
                                  pairStatus?.partnerQuestionnaireTaken &&
                                  pairStatus?.partnerReportGenerated;

  const getCoupleReportStatus = () => {
    if (!pairStatus?.isConnected) {
      return { message: 'Connect with partner first', color: 'orange' };
    }
    if (!user?.questionnaireTaken) {
      return { message: 'Complete your questionnaire first', color: 'orange' };
    }
    if (!user?.reportGenerated) {
      return { message: 'Generate your solo report first', color: 'orange' };
    }
    if (!pairStatus?.partnerQuestionnaireTaken) {
      return { message: `Waiting for ${pairStatus.partnerName} to complete questionnaire`, color: 'orange' };
    }
    if (!pairStatus?.partnerReportGenerated) {
      return { message: `Waiting for ${pairStatus.partnerName} to generate their report`, color: 'orange' };
    }
    return { message: 'Ready to generate couple report!', color: 'green' };
  };

  const coupleReportStatus = getCoupleReportStatus();

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Continue your relationship journey and discover deeper connections
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="p-3 sm:p-6 text-center">
              <div className={`text-lg sm:text-2xl font-bold mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </Card>
          ))}
        </motion.div>

        {/* Couple Report Section */}
        {pairStatus?.isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-4 sm:mb-8"
          >
            <Card className={`p-4 sm:p-6 ${canGenerateCoupleReport ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800' : 'bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800'}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${canGenerateCoupleReport ? 'bg-green-100 dark:bg-green-800' : 'bg-orange-100 dark:bg-orange-800'}`}>
                    <Sparkles className={`w-6 h-6 ${canGenerateCoupleReport ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Couple Report with {pairStatus.partnerName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {coupleReportStatus.message}
                    </p>
                  </div>
                </div>
                <Button
                  variant={canGenerateCoupleReport ? "primary" : "outline"}
                  size="sm"
                  disabled={!canGenerateCoupleReport}
                  onClick={() => navigate('/couple-report')}
                  icon={canGenerateCoupleReport ? Sparkles : Clock}
                  className="w-full sm:w-auto"
                >
                  {canGenerateCoupleReport ? 'Generate Couple Report' : 'Requirements Not Met'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-6">Your Journey</h2>
          <div className="grid gap-2 sm:gap-4">
            {nextSteps.map((step, index) => (
              <Card key={index} hover className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className={`p-2 sm:p-3 rounded-lg ${
                      step.completed 
                        ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400' 
                        : step.disabled
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                        : 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-400'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                      ) : (
                        <step.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                    {step.completed && (
                      <span className="text-green-600 dark:text-green-400 text-xs sm:text-sm font-medium">
                        Completed
                      </span>
                    )}
                    <Button
                      variant={step.completed ? "outline" : step.disabled ? "ghost" : "primary"}
                      size="sm"
                      onClick={step.action}
                      disabled={step.disabled}
                      className="text-xs sm:text-sm"
                    >
                      {step.completed ? 'Review' : step.disabled ? 'Locked' : 'Start'}
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-3 sm:gap-6"
        >
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-purple-600 rounded-lg">
                <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Solo Relationship Insights</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Discover your relationship patterns</p>
              </div>
            </div>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => navigate(user?.questionnaireTaken ? '/report' : '/questionnaire')}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              {user?.questionnaireTaken ? 'View Solo Report' : 'Take Questionnaire'}
            </Button>
          </Card>

          <Card className="p-4 sm:p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-700">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-teal-600 rounded-lg">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Partner Connection</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                  {pairStatus?.isConnected ? 'Generate couple insights' : 'Sync with your partner\'s account'}
                </p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => navigate(pairStatus?.isConnected ? '/couple-report' : '/pair')}
              disabled={pairStatus?.isConnected && !canGenerateCoupleReport}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              {pairStatus?.isConnected 
                ? (canGenerateCoupleReport ? 'Couple Report' : 'Requirements Not Met')
                : 'Connect Partner'
              }
            </Button>
          </Card>

          <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-blue-600 rounded-lg">
                <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">AI Chat Assistant</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Get personalized relationship advice</p>
              </div>
            </div>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => navigate('/chatbot')}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Start Chat
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};