import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  Download,
  Share2,
  Sparkles,
  Eye,
  Lightbulb,
  Target,
  Home
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface CoupleReportData {
  compatibility_score: number;
  communication_harmony: number;
  trust_alignment: number;
  intimacy_balance: number;
  conflict_resolution_style: number;
  future_vision_alignment: number;
  cultural_adaptation_sync: number;
  shared_strengths: string[];
  growth_areas: string[];
  couple_recommendations: string[];
  partner_messages: {
    to_partner_a: string;
    to_partner_b: string;
  };
  relationship_insights: string[];
  compatibility_level: string;
  couple_summary: string;
}

export const CoupleReport: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState<CoupleReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    checkCoupleEligibility();
  }, []);

  const checkCoupleEligibility = async () => {
    try {
      const token = localStorage.getItem('relationsync_token');
      
      // Check pair status
      const pairResponse = await axios.get('/api/pair/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const pairStatus = pairResponse.data.data;
      
      if (!pairStatus.isConnected) {
        setError('You need to be connected with a partner to view couple reports.');
        setLoading(false);
        return;
      }

      // Try to fetch existing couple report
      try {
        const reportResponse = await axios.get('/api/ai/couple-report', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReport(reportResponse.data.data.analysis);
      } catch (reportError: any) {
        if (reportError.response?.status === 404) {
          // No report exists, check if both partners completed questionnaire
          if (!user?.questionnaireTaken || !pairStatus.partnerQuestionnaireTaken) {
            setError('Both partners need to complete the questionnaire before generating a couple report.');
          }
        } else {
          setError('Failed to load couple report');
        }
      }
    } catch (err: any) {
      setError('Failed to check couple status');
    } finally {
      setLoading(false);
    }
  };

  const generateCoupleReport = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('relationsync_token');
      const response = await axios.post('/api/ai/generate-couple-report', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setReport(response.data.data.analysis);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate couple report');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading couple report...</p>
        </div>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Couple Report Not Available</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <div className="space-y-2">
            <Button onClick={() => navigate('/pair')}>
              Manage Partner Connection
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Generate Your Couple Report</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Both you and your partner have completed the questionnaire. Generate your comprehensive couple analysis now!
          </p>
          <Button 
            onClick={generateCoupleReport}
            loading={generating}
            icon={Sparkles}
            size="lg"
          >
            {generating ? 'Generating Report...' : 'Generate Couple Report'}
          </Button>
        </Card>
      </div>
    );
  }

  const categoryScores = [
    { name: 'Overall Compatibility', score: report.compatibility_score, color: 'purple', icon: Heart },
    { name: 'Communication Harmony', score: report.communication_harmony, color: 'blue', icon: MessageCircle },
    { name: 'Trust Alignment', score: report.trust_alignment, color: 'green', icon: CheckCircle },
    { name: 'Intimacy Balance', score: report.intimacy_balance, color: 'pink', icon: Heart },
    { name: 'Conflict Resolution', score: report.conflict_resolution_style, color: 'orange', icon: Target },
    { name: 'Future Vision', score: report.future_vision_alignment, color: 'indigo', icon: TrendingUp },
    { name: 'Cultural Sync', score: report.cultural_adaptation_sync, color: 'teal', icon: Home },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400';
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getCompatibilityEmoji = (level: string) => {
    switch (level.toLowerCase()) {
      case 'excellent': return '💖';
      case 'very good': return '💕';
      case 'good': return '💗';
      case 'fair': return '💛';
      default: return '💙';
    }
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 lg:mb-8"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4">
            <Users className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Couple Analysis
          </h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-4 lg:mb-6">
            Comprehensive relationship insights for both partners
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-2 lg:gap-4">
            <Button variant="outline" size="sm" icon={Download} className="text-xs lg:text-sm">
              Download PDF
            </Button>
            <Button variant="outline" size="sm" icon={Share2} className="text-xs lg:text-sm">
              Share Results
            </Button>
          </div>
        </motion.div>

        {/* Compatibility Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 lg:mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
            <div className="text-center">
              <div className="text-4xl mb-4">{getCompatibilityEmoji(report.compatibility_level)}</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {report.compatibility_level} Compatibility
              </h2>
              <div className={`text-3xl font-bold mb-4 ${getScoreColor(report.compatibility_score)}`}>
                {report.compatibility_score}/10
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic max-w-3xl mx-auto">
                "{report.couple_summary}"
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Partner Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 lg:mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <MessageCircle className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Messages for Each Other</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">For You:</h3>
                <p className="text-blue-800 dark:text-blue-200 italic">
                  "{report.partner_messages.to_partner_a}"
                </p>
              </div>
              
              <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border-l-4 border-pink-500">
                <h3 className="font-medium text-pink-900 dark:text-pink-300 mb-2">For Your Partner:</h3>
                <p className="text-pink-800 dark:text-pink-200 italic">
                  "{report.partner_messages.to_partner_b}"
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Detailed Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 lg:mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Relationship Dimensions
            </h2>
            <div className="grid gap-4">
              {categoryScores.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <category.icon className={`w-5 h-5 text-${category.color}-600 dark:text-${category.color}-400`} />
                    <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`bg-${category.color}-500 h-2 rounded-full transition-all duration-1000`}
                        style={{ width: `${category.score * 10}%` }}
                      />
                    </div>
                    <span className={`font-semibold ${getScoreColor(category.score)} min-w-[3rem]`}>
                      {category.score}/10
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Shared Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Shared Strengths</h2>
              </div>
              <div className="space-y-3">
                {report.shared_strengths.map((strength, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Growth Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Growth Opportunities</h2>
              </div>
              <div className="space-y-3">
                {report.growth_areas.map((area, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{area}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Relationship Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
            <div className="flex items-center space-x-3 mb-4">
              <Lightbulb className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300">Deep Relationship Insights</h2>
            </div>
            <div className="space-y-4">
              {report.relationship_insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-blue-500"
                >
                  <span className="text-gray-700 dark:text-gray-300 italic font-medium">💡 {insight}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Couple Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Couple Action Plan</h2>
            </div>
            <div className="grid gap-4">
              {report.couple_recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500"
                >
                  <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center"
        >
          <Card className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Continue Your Journey Together
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Use these insights to strengthen your bond and build a deeper connection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="text-sm lg:text-base"
              >
                Back to Dashboard
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                onClick={() => navigate('/report')}
                className="text-sm lg:text-base"
              >
                View Solo Report
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};