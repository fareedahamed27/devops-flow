// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { UserPlus, Users, Heart, CheckCircle, Copy, RefreshCw, Link2 } from 'lucide-react';
// import { Button } from '../components/ui/Button';
// import { Input } from '../components/ui/Input';
// import { Card } from '../components/ui/Card';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';

// interface UserPairData {
//   pairId: string;
//   isConnected: boolean;
//   partnerName?: string;
//   partnerEmail?: string;
// }

// export const Pair: React.FC = () => {
//   const [pairId, setPairId] = useState('');
//   const [userPairData, setUserPairData] = useState<UserPairData | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [showPairIdInput, setShowPairIdInput] = useState(false);
//   const { user } = useAuth();

//   useEffect(() => {
//     fetchUserPairData();
//   }, []);

//   const fetchUserPairData = async () => {
//     try {
//       const token = localStorage.getItem('relationsync_token');
//       const response = await axios.get('/api/pair/status', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUserPairData(response.data.data);
//     } catch (err: any) {
//       console.error('Failed to fetch pair data:', err);
//     }
//   };

//   const generatePairId = async () => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const token = localStorage.getItem('relationsync_token');
//       const response = await axios.post('/api/pair/generate-id', {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       setUserPairData(response.data.data);
//       setSuccess('Your Pair ID has been generated! Share it with your partner.');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to generate Pair ID');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const connectWithPairId = async () => {
//     if (!pairId.trim()) {
//       setError('Please enter a valid Pair ID');
//       return;
//     }

//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const token = localStorage.getItem('relationsync_token');
//       const response = await axios.post('/api/pair/connect', 
//         { pairId: pairId.trim() },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       setUserPairData(response.data.data);
//       setSuccess('Successfully connected with your partner! 🎉');
//       setPairId('');
//       setShowPairIdInput(false);
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to connect with Pair ID');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const copyPairId = () => {
//     if (userPairData?.pairId) {
//       navigator.clipboard.writeText(userPairData.pairId);
//       setSuccess('Pair ID copied to clipboard!');
//       setTimeout(() => setSuccess(null), 3000);
//     }
//   };

//   const disconnectPartner = async () => {
//     if (!confirm('Are you sure you want to disconnect from your partner?')) return;
    
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem('relationsync_token');
//       await axios.post('/api/pair/disconnect', {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       setUserPairData({ pairId: '', isConnected: false });
//       setSuccess('Disconnected from partner');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to disconnect');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen p-2 sm:p-4 lg:p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-6 lg:mb-8"
//         >
//           <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl mb-4">
//             <Users className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
//           </div>
//           <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
//             Connect with Your Partner
//           </h1>
//           <p className="text-sm lg:text-base text-gray-600 max-w-2xl mx-auto">
//             Use Pair IDs to connect your accounts and unlock couple insights
//           </p>
//         </motion.div>

//         {/* Success/Error Messages */}
//         {success && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6"
//           >
//             {success}
//           </motion.div>
//         )}

//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
//           >
//             {error}
//           </motion.div>
//         )}

//         {/* Connected Status */}
//         {userPairData?.isConnected ? (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-8"
//           >
//             <Card className="p-6 bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <div className="p-3 bg-green-100 rounded-full">
//                     <CheckCircle className="w-6 h-6 text-green-600" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       Connected with {userPairData.partnerName}! 🎉
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       You can now access couple insights and shared features
//                     </p>
//                   </div>
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={disconnectPartner}
//                   className="text-red-600 border-red-300 hover:bg-red-50"
//                 >
//                   Disconnect
//                 </Button>
//               </div>
//             </Card>
//           </motion.div>
//         ) : (
//           <div className="grid lg:grid-cols-2 gap-6 mb-8">
//             {/* Your Pair ID */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//             >
//               <Card className="p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                   Your Pair ID
//                 </h2>
                
//                 {userPairData?.pairId ? (
//                   <div className="space-y-4">
//                     <div className="p-4 bg-purple-50 rounded-lg border-2 border-dashed border-purple-300">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm text-gray-600 mb-1">Share this ID with your partner:</p>
//                           <p className="text-2xl font-mono font-bold text-purple-600">
//                             {userPairData.pairId}
//                           </p>
//                         </div>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={copyPairId}
//                           icon={Copy}
//                         >
//                           Copy
//                         </Button>
//                       </div>
//                     </div>
                    
//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                       <p className="text-blue-800 text-sm">
//                         <strong>How to connect:</strong><br />
//                         1. Share your Pair ID with your partner<br />
//                         2. Have them enter it in their app<br />
//                         3. You'll both be instantly connected!
//                       </p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center space-y-4">
//                     <p className="text-gray-600">
//                       Generate a unique Pair ID to share with your partner
//                     </p>
//                     <Button
//                       onClick={generatePairId}
//                       loading={isLoading}
//                       icon={RefreshCw}
//                       className="w-full"
//                     >
//                       Generate My Pair ID
//                     </Button>
//                   </div>
//                 )}
//               </Card>
//             </motion.div>

//             {/* Connect with Partner */}
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//             >
//               <Card className="p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                   Connect with Partner
//                 </h2>
                
//                 {!showPairIdInput ? (
//                   <div className="text-center space-y-4">
//                     <p className="text-gray-600">
//                       Have your partner's Pair ID? Connect instantly!
//                     </p>
//                     <Button
//                       onClick={() => setShowPairIdInput(true)}
//                       icon={Link2}
//                       className="w-full"
//                     >
//                       Enter Partner's Pair ID
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <Input
//                       label="Partner's Pair ID"
//                       placeholder="Enter 5-digit Pair ID"
//                       value={pairId}
//                       onChange={(e) => setPairId(e.target.value.toUpperCase())}
//                       maxLength={5}
//                       className="text-center text-lg font-mono"
//                     />
                    
//                     <div className="flex gap-2">
//                       <Button
//                         onClick={connectWithPairId}
//                         loading={isLoading}
//                         disabled={!pairId.trim()}
//                         className="flex-1"
//                       >
//                         Connect
//                       </Button>
//                       <Button
//                         variant="outline"
//                         onClick={() => {
//                           setShowPairIdInput(false);
//                           setPairId('');
//                           setError(null);
//                         }}
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </Card>
//             </motion.div>
//           </div>
//         )}

//         {/* Benefits */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//         >
//           <Card className="p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
//               What You'll Unlock Together
//             </h2>

//             <div className="grid md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <div className="flex items-start space-x-3">
//                   <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
//                     <Heart className="w-5 h-5 text-purple-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-gray-900">Combined AI Reports</h3>
//                     <p className="text-gray-600 text-sm">
//                       See how your responses compare and get couple-specific insights
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-3">
//                   <div className="p-2 bg-pink-100 rounded-lg flex-shrink-0">
//                     <Users className="w-5 h-5 text-pink-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-gray-900">Partner Reflections</h3>
//                     <p className="text-gray-600 text-sm">
//                       Understand each other's perspectives and hidden emotions
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex items-start space-x-3">
//                   <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
//                     <CheckCircle className="w-5 h-5 text-teal-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-gray-900">Action Plans</h3>
//                     <p className="text-gray-600 text-sm">
//                       Get personalized exercises and activities to strengthen your bond
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-3">
//                   <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
//                     <UserPlus className="w-5 h-5 text-orange-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-gray-900">Weekly Sync Sessions</h3>
//                     <p className="text-gray-600 text-sm">
//                       Track your relationship progress with regular check-ins
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
//               <p className="text-sm text-gray-700 text-center">
//                 <strong>🔒 Privacy First:</strong> Your individual responses remain private. 
//                 Only combined insights and recommendations are shared.
//               </p>
//             </div>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, Heart, CheckCircle, Copy, RefreshCw, Link2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface UserPairData {
  pairId: string;
  isConnected: boolean;
  partnerName?: string;
  partnerEmail?: string;
}

export const Pair: React.FC = () => {
  const [pairId, setPairId] = useState('');
  const [userPairData, setUserPairData] = useState<UserPairData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPairIdInput, setShowPairIdInput] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchUserPairData();
  }, []);

  const fetchUserPairData = async () => {
    try {
      const token = localStorage.getItem('relationsync_token');
      const response = await axios.get('/api/pair/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserPairData(response.data.data);
    } catch (err: any) {
      console.error('Failed to fetch pair data:', err);
    }
  };

  const generatePairId = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('relationsync_token');
      const response = await axios.post('/api/pair/generate-id', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserPairData(response.data.data);
      setSuccess('Your Pair ID has been generated! Share it with your partner.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate Pair ID');
    } finally {
      setIsLoading(false);
    }
  };

  const connectWithPairId = async () => {
    if (!pairId.trim()) {
      setError('Please enter a valid Pair ID');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('relationsync_token');
      const response = await axios.post('/api/pair/connect', 
        { pairId: pairId.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUserPairData(response.data.data);
      setSuccess('Successfully connected with your partner! 🎉');
      setPairId('');
      setShowPairIdInput(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to connect with Pair ID');
    } finally {
      setIsLoading(false);
    }
  };

  const copyPairId = () => {
    if (userPairData?.pairId) {
      navigator.clipboard.writeText(userPairData.pairId);
      setSuccess('Pair ID copied to clipboard!');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const disconnectPartner = async () => {
    if (!confirm('Are you sure you want to disconnect from your partner?')) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('relationsync_token');
      await axios.post('/api/pair/disconnect', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserPairData({ pairId: '', isConnected: false });
      setSuccess('Disconnected from partner');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to disconnect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 lg:mb-8"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl mb-4">
            <Users className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Connect with Your Partner
          </h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Use Pair IDs to connect your accounts and unlock couple insights
          </p>
        </motion.div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-6"
          >
            {success}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Connected Status */}
        {userPairData?.isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 dark:bg-green-800 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Connected with {userPairData.partnerName}! 🎉
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      You can now access couple insights and shared features
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectPartner}
                  className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Disconnect
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Your Pair ID */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Your Pair ID
                </h2>
                
                {userPairData?.pairId ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Share this ID with your partner:</p>
                          <p className="text-2xl font-mono font-bold text-purple-600 dark:text-purple-400">
                            {userPairData.pairId}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyPairId}
                          icon={Copy}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-blue-800 dark:text-blue-300 text-sm">
                        <strong>How to connect:</strong><br />
                        1. Share your Pair ID with your partner<br />
                        2. Have them enter it in their app<br />
                        3. You'll both be instantly connected!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      Generate a unique Pair ID to share with your partner
                    </p>
                    <Button
                      onClick={generatePairId}
                      loading={isLoading}
                      icon={RefreshCw}
                      className="w-full"
                    >
                      Generate My Pair ID
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Connect with Partner */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Connect with Partner
                </h2>
                
                {!showPairIdInput ? (
                  <div className="text-center space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      Have your partner's Pair ID? Connect instantly!
                    </p>
                    <Button
                      onClick={() => setShowPairIdInput(true)}
                      icon={Link2}
                      className="w-full"
                    >
                      Enter Partner's Pair ID
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input
                      label="Partner's Pair ID"
                      placeholder="Enter 5-digit Pair ID"
                      value={pairId}
                      onChange={(e) => setPairId(e.target.value.toUpperCase())}
                      maxLength={5}
                      className="text-center text-lg font-mono dark:text-white"
                    />
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={connectWithPairId}
                        loading={isLoading}
                        disabled={!pairId.trim()}
                        className="flex-1"
                      >
                        Connect
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPairIdInput(false);
                          setPairId('');
                          setError(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        )}

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              What You'll Unlock Together
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg flex-shrink-0">
                    <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Combined AI Reports</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      See how your responses compare and get couple-specific insights
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-pink-100 dark:bg-pink-800 rounded-lg flex-shrink-0">
                    <Users className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Partner Reflections</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Understand each other's perspectives and hidden emotions
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-teal-100 dark:bg-teal-800 rounded-lg flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Action Plans</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Get personalized exercises and activities to strengthen your bond
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg flex-shrink-0">
                    <UserPlus className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Weekly Sync Sessions</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Track your relationship progress with regular check-ins
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                <strong>🔒 Privacy First:</strong> Your individual responses remain private. 
                Only combined insights and recommendations are shared.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};