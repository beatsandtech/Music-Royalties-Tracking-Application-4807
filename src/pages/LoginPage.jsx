import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import questConfig from '../config/questConfig';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMusic, FiTrendingUp, FiDollarSign } = FiIcons;

// Demo Login Component
function DemoLogin({ onSubmit }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Demo Mode</h3>
        <p className="text-gray-600 mb-6">Experience the full application without authentication</p>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={() => onSubmit({ 
            userId: 'demo-user-new', 
            token: 'demo-token', 
            newUser: true 
          })}
          className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Continue as New User (with Onboarding)
        </button>
        
        <button
          onClick={() => onSubmit({ 
            userId: 'demo-user-existing', 
            token: 'demo-token', 
            newUser: false 
          })}
          className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Continue as Existing User
        </button>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>This demo includes all features with sample data</p>
      </div>
    </div>
  );
}

function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [QuestLogin, setQuestLogin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestLogin = async () => {
      try {
        const questModule = await import('@questlabs/react-sdk');
        setQuestLogin(() => questModule.QuestLogin);
      } catch (error) {
        console.warn('Quest SDK not available, using demo mode');
        setQuestLogin(() => DemoLogin);
      } finally {
        setLoading(false);
      }
    };

    loadQuestLogin();
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = ({ userId, token, newUser }) => {
    login({ userId, token, newUser });
    if (newUser) {
      navigate('/onboarding');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Left Section - Branding */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 p-12 text-white relative overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 rounded-full bg-white"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full bg-white"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center max-w-md">
          <div className="mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl w-fit mb-6">
              <SafeIcon icon={FiMusic} className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Royalties Tracker
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Track your music earnings, analyze performance, and manage your royalties all in one place.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <SafeIcon icon={FiDollarSign} className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Track Earnings</h3>
                <p className="text-blue-100">Monitor royalties across all platforms</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <SafeIcon icon={FiTrendingUp} className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Analyze Performance</h3>
                <p className="text-blue-100">Get insights on your best performing tracks</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Section - Login Form */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="bg-blue-600 p-4 rounded-2xl w-fit mx-auto mb-4">
              <SafeIcon icon={FiMusic} className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Royalties Tracker</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to continue to your dashboard</p>
            </div>

            <div style={{ minHeight: '400px' }}>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : QuestLogin ? (
                <QuestLogin
                  onSubmit={handleLogin}
                  email={true}
                  google={false}
                  accent={questConfig.PRIMARY_COLOR}
                />
              ) : (
                <DemoLogin onSubmit={handleLogin} />
              )}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;