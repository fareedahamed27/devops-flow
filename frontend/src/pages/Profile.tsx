import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  Heart,
  Users,
  AlertTriangle,
  CheckCircle,
  UserX,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import axios from 'axios';

interface PairRequest {
  id: number;
  requester_id: number;
  receiver_id: number;
  receiver_identifier: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  requester_name?: string;
  receiver_name?: string;
}

export const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState<PairRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<PairRequest[]>([]);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    gender: user?.gender || '',
    relationship_status: user?.relationshipStatus || '',
  });

  useEffect(() => {
    fetchPairRequests();
  }, []);

  const fetchPairRequests = async () => {
    try {
      const token = localStorage.getItem('relationsync_token');
      
      // Fetch incoming requests
      const incomingResponse = await axios.get('/api/pair-requests/incoming', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncomingRequests(incomingResponse.data.data || []);
      
      // Fetch outgoing requests
      const outgoingResponse = await axios.get('/api/pair-requests/outgoing', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOutgoingRequests(outgoingResponse.data.data || []);
    } catch (err) {
      console.error('Failed to fetch pair requests:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('relationsync_token');
      const response = await axios.put(`/api/users/${user?.id}`, {
        name: formData.name,
        age: parseInt(String(formData.age)),
        gender: formData.gender,
        relationship_status: formData.relationship_status,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      updateUser(response.data.data);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('relationsync_token');
      await axios.delete(`/api/users/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      logout();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  const handlePairRequest = async (requestId: number, action: 'accept' | 'reject') => {
    try {
      const token = localStorage.getItem('relationsync_token');
      await axios.post(`/api/pair-requests/${requestId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess(`Request ${action}ed successfully!`);
      fetchPairRequests();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${action} request`);
    }
  };

  const cancelOutgoingRequest = async (requestId: number) => {
    try {
      const token = localStorage.getItem('relationsync_token');
      await axios.delete(`/api/pair-requests/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Request cancelled successfully!');
      fetchPairRequests();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel request');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 lg:mb-8"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4">
            <User className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
            Manage your account and relationship preferences
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

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h2>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Edit3}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Save}
                      onClick={handleSave}
                      loading={loading}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={X}
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name || '',
                          email: user.email || '',
                          age: user.age || '',
                          gender: user.gender || '',
                          relationship_status: user.relationshipStatus || '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <Input
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      helperText="Email cannot be changed"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleInputChange}
                      />

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Relationship Status
                      </label>
                      <select
                        name="relationship_status"
                        value={formData.relationship_status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select</option>
                        <option value="dating">Dating</option>
                        <option value="married">Married</option>
                        <option value="separated">Separated</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.age} years old</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">{user.gender}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Relationship Status</p>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">{user.relationshipStatus}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Account Status */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Account Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Questionnaire</span>
                  <div className="flex items-center space-x-2">
                    {user.questionnaireTaken ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      user.questionnaireTaken ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {user.questionnaireTaken ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">AI Report</span>
                  <div className="flex items-center space-x-2">
                    {user.reportGenerated ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      user.reportGenerated ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {user.reportGenerated ? 'Generated' : 'Not Available'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <h2 className="text-xl font-semibold text-red-900 dark:text-red-400 mb-4">
                Danger Zone
              </h2>
              <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              
              {!showDeleteConfirm ? (
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Account
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    Are you absolutely sure?
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleDeleteAccount}
                      loading={loading}
                    >
                      Yes, Delete Forever
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Pair Requests */}
        {(incomingRequests.length > 0 || outgoingRequests.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Partner Requests
              </h2>

              {/* Incoming Requests */}
              {incomingRequests.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <UserPlus className="w-5 h-5 mr-2 text-green-600" />
                    Incoming Requests ({incomingRequests.length})
                  </h3>
                  <div className="space-y-3">
                    {incomingRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {request.requester_name || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Sent {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handlePairRequest(request.id, 'accept')}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePairRequest(request.id, 'reject')}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Outgoing Requests */}
              {outgoingRequests.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <UserX className="w-5 h-5 mr-2 text-orange-600" />
                    Sent Requests ({outgoingRequests.length})
                  </h3>
                  <div className="space-y-3">
                    {outgoingRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            To: {request.receiver_identifier}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Status: <span className="capitalize font-medium">{request.status}</span>
                          </p>
                        </div>
                        {request.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelOutgoingRequest(request.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};