import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  Download,
  Share2,
  Shield,
  Users,
  MessageCircle,
  Target,
  Eye,
  AlertCircle,
  Home,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import axios from 'axios';

interface ReportData {
  emotional_summary: string;
  emotional_tags: string[];
  communication_score: number;
  emotional_burden_score: number;
  trust_score: number;
  intimacy_score: number;
  conflict_resolution_score: number;
  future_alignment_score: number;
  family_influence_score: number;
  cultural_adaptation_score: number;
  love_language_estimate: string;
  pain_points: string[];
  strengths: string[];
  recommendations: string[];
  red_flags: string[];
  deep_insights: string[];
  cultural_insights: string[];
  counselor_notes: string[];
}

export const Report: React.FC = () => {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem('relationsync_token');
      const response = await axios.get('/api/ai/report', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReport(response.data.data.analysis);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Generating your personalized relationship insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Report Not Available</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Button onClick={() => navigate('/questionnaire')}>
            Take Questionnaire
          </Button>
        </Card>
      </div>
    );
  }

  if (!report) return null;

  const categoryScores = [
    { name: 'Communication', score: report.communication_score, color: 'purple', icon: MessageCircle },
    { name: 'Trust & Security', score: report.trust_score, color: 'green', icon: Shield },
    { name: 'Emotional Intimacy', score: report.intimacy_score, color: 'pink', icon: Heart },
    { name: 'Conflict Resolution', score: report.conflict_resolution_score, color: 'orange', icon: Target },
    { name: 'Future Alignment', score: report.future_alignment_score, color: 'blue', icon: TrendingUp },
    { name: 'Family Influence', score: report.family_influence_score, color: 'indigo', icon: Home },
    { name: 'Cultural Adaptation', score: report.cultural_adaptation_score, color: 'teal', icon: Users },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600 dark:text-green-400';
    if (score >= 5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Needs Work';
    if (score >= 3) return 'Concerning';
    return 'Critical';
  };

  const overallScore = (report.communication_score + report.trust_score + report.intimacy_score + 
                       report.conflict_resolution_score + report.future_alignment_score) / 5;

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
            <Brain className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Solo Relationship Analysis
          </h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-4 lg:mb-6">
            Professional insights from Dr. Priya Sharma - Relationship Counselor
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

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-6 mb-6 lg:mb-8"
        >
          <Card className="p-4 lg:p-6 text-center">
            <div className={`text-2xl lg:text-3xl font-bold mb-2 ${getScoreColor(overallScore)}`}>
              {overallScore.toFixed(1)}/10
            </div>
            <div className="text-sm lg:text-base text-gray-600 dark:text-gray-300">Overall Score</div>
            <div className={`text-xs lg:text-sm mt-1 font-medium ${getScoreColor(overallScore)}`}>
              {getScoreLabel(overallScore)}
            </div>
          </Card>

          <Card className="p-4 lg:p-6 text-center">
            <div className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {report.love_language_estimate}
            </div>
            <div className="text-sm lg:text-base text-gray-600 dark:text-gray-300">Love Language</div>
            <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">Primary Pattern</div>
          </Card>

          <Card className="p-4 lg:p-6 text-center">
            <div className={`text-2xl lg:text-3xl font-bold mb-2 ${
              report.emotional_burden_score <= 5 ? 'text-green-600 dark:text-green-400' : 
              report.emotional_burden_score <= 7 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {report.emotional_burden_score}/10
            </div>
            <div className="text-sm lg:text-base text-gray-600 dark:text-gray-300">Emotional Load</div>
            <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {report.emotional_burden_score <= 5 ? 'Manageable' : 
               report.emotional_burden_score <= 7 ? 'Moderate' : 'High Stress'}
            </div>
          </Card>
        </motion.div>

        {/* Counselor's Assessment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 lg:mb-8"
        >
          <Card className="p-4 lg:p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-full">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">Dr. Priya's Assessment</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">Professional counselor perspective</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg border-l-4 border-purple-500">
              <p className="text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed italic">
                "{report.emotional_summary}"
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Category Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 lg:mb-8"
        >
          <Card className="p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-4 lg:mb-6">
              Detailed Analysis
            </h2>
            <div className="grid gap-3 lg:gap-4">
              {categoryScores.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <category.icon className={`w-4 h-4 lg:w-5 lg:h-5 text-${category.color}-600 dark:text-${category.color}-400`} />
                    <span className="font-medium text-gray-900 dark:text-white text-sm lg:text-base">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className="flex-1 sm:w-24 lg:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`bg-${category.color}-500 h-2 rounded-full transition-all duration-1000`}
                        style={{ width: `${category.score * 10}%` }}
                      />
                    </div>
                    <span className={`font-semibold text-sm lg:text-base ${getScoreColor(category.score)} min-w-[3rem]`}>
                      {category.score}/10
                    </span>
                    <span className={`text-xs lg:text-sm font-medium ${getScoreColor(category.score)} min-w-[4rem] text-right`}>
                      {getScoreLabel(category.score)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Cultural Insights */}
        {report.cultural_insights && report.cultural_insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 lg:mb-8"
          >
            <Card className="p-4 lg:p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-700">
              <div className="flex items-center space-x-3 mb-4">
                <Home className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600 dark:text-orange-400" />
                <h2 className="text-lg lg:text-xl font-semibold text-orange-900 dark:text-orange-300">Cultural Context</h2>
              </div>
              <div className="space-y-3 lg:space-y-4">
                {report.cultural_insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-3 lg:p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-orange-500"
                  >
                    <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300">{insight}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 mb-6 lg:mb-8">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-4 lg:p-6 h-full">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">Your Strengths</h2>
              </div>
              <div className="space-y-2 lg:space-y-3">
                {report.strengths.map((strength, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-3 p-2 lg:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300">{strength}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Pain Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-4 lg:p-6 h-full">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600 dark:text-orange-400" />
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">Areas of Concern</h2>
              </div>
              <div className="space-y-2 lg:space-y-3">
                {report.pain_points.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start space-x-3 p-2 lg:p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300">{point}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Counselor Notes */}
        {report.counselor_notes && report.counselor_notes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-6 lg:mb-8"
          >
            <Card className="p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
              <div className="flex items-center space-x-3 mb-4">
                <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg lg:text-xl font-semibold text-blue-900 dark:text-blue-300">Personal Observations</h2>
              </div>
              <div className="space-y-3 lg:space-y-4">
                {report.counselor_notes.map((note, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="p-3 lg:p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-blue-500"
                  >
                    <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300 italic">"{note}"</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Red Flags */}
        {report.red_flags && report.red_flags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-6 lg:mb-8"
          >
            <Card className="p-4 lg:p-6 border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600 dark:text-red-400" />
                <h2 className="text-lg lg:text-xl font-semibold text-red-900 dark:text-red-300">Critical Patterns</h2>
              </div>
              <div className="space-y-2 lg:space-y-3">
                {report.red_flags.map((flag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-start space-x-3 p-2 lg:p-3 bg-red-100 dark:bg-red-800/20 rounded-lg border-l-4 border-red-500"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm lg:text-base text-red-800 dark:text-red-300 font-medium">{flag}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Deep Insights */}
        {report.deep_insights && report.deep_insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-6 lg:mb-8"
          >
            <Card className="p-4 lg:p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
              <div className="flex items-center space-x-3 mb-4">
                <Lightbulb className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" />
                <h2 className="text-lg lg:text-xl font-semibold text-purple-900 dark:text-purple-300">Breakthrough Insights</h2>
              </div>
              <div className="space-y-3 lg:space-y-4">
                {report.deep_insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                    className="p-3 lg:p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-purple-500"
                  >
                    <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300 italic font-medium">💡 {insight}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-6 lg:mb-8"
        >
          <Card className="p-4 lg:p-6">
            <div className="flex items-center space-x-3 mb-4 lg:mb-6">
              <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">Your Action Plan</h2>
            </div>
            <div className="grid gap-3 lg:gap-4">
              {report.recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500"
                >
                  <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs lg:text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300">{recommendation}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="text-center"
        >
          <Card className="p-6 lg:p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Ready for Deeper Connection?
            </h2>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-6">
              Connect with your partner to unlock couple insights and start your journey together
            </p>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/pair')}
                icon={Users}
                className="text-sm lg:text-base"
              >
                Connect with Partner
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                onClick={() => navigate('/dashboard')}
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
};