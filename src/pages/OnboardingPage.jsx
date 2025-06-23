import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import questConfig from '../config/questConfig';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMusic, FiTarget, FiCheckCircle } = FiIcons;

// Demo Onboarding Component
function DemoOnboarding({ getAnswers }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const steps = [
    {
      title: "Welcome to Your Music Journey!",
      question: "What type of artist are you?",
      options: ["Solo Artist", "Band/Group", "Producer", "Songwriter"]
    },
    {
      title: "Let's Customize Your Experience",
      question: "Which platforms do you primarily use?",
      options: ["Spotify", "Apple Music", "YouTube Music", "All Platforms"]
    },
    {
      title: "Almost Done!",
      question: "What's your primary goal?",
      options: ["Track Earnings", "Analyze Performance", "Manage Royalties", "All of the Above"]
    }
  ];

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [currentStep]: answer };
    setAnswers(newAnswers);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setTimeout(getAnswers, 1000);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 mx-1 rounded-full ${
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{currentStepData.title}</h3>
        <p className="text-gray-600 mb-6">{currentStepData.question}</p>
      </div>
      
      <div className="space-y-3">
        {currentStepData.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            {option}
          </button>
        ))}
      </div>
      
      {currentStep === steps.length - 1 && (
        <div className="text-center text-sm text-gray-500">
          <p>Setting up your personalized dashboard...</p>
        </div>
      )}
    </div>
  );
}

function OnboardingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [OnBoarding, setOnBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const loadOnBoarding = async () => {
      try {
        const questModule = await import('@questlabs/react-sdk');
        setOnBoarding(() => questModule.OnBoarding);
      } catch (error) {
        console.warn('Quest SDK not available, using demo onboarding');
        setOnBoarding(() => DemoOnboarding);
      } finally {
        setLoading(false);
      }
    };

    loadOnBoarding();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isNewUser = localStorage.getItem('isNewUser') === 'true';
  if (!isNewUser) {
    return <Navigate to="/" replace />;
  }

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const getAnswers = () => {
    localStorage.setItem('isNewUser', 'false');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-blue-600 p-12 text-white relative overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-32 left-16 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 rounded-full bg-white"></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-white"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center max-w-md">
          <div className="mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl w-fit mb-6">
              <SafeIcon icon={FiTarget} className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Let's Get Started!</h1>
            <p className="text-xl text-green-100 leading-relaxed">
              We're setting up your personalized royalties tracking experience.
            </p>
          </div>

          <div className="space-y-6">
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white/20 p-3 rounded-lg">
                <SafeIcon icon={FiCheckCircle} className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Personalized Setup</h3>
                <p className="text-green-100">Customize your tracking preferences</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

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
            <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
            <p className="text-gray-600">Let's set up your account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Setup</h2>
              <p className="text-gray-600">Help us personalize your experience</p>
            </div>

            <div style={{ minHeight: '400px', maxWidth: '400px', margin: '0 auto' }}>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : OnBoarding && userId && token ? (
                <OnBoarding
                  userId={userId}
                  token={token}
                  questId={questConfig.QUEST_ONBOARDING_QUESTID}
                  answer={answers}
                  setAnswer={setAnswers}
                  getAnswers={getAnswers}
                  accent={questConfig.PRIMARY_COLOR}
                  singleChoose="modal1"
                  multiChoice="modal2"
                >
                  <OnBoarding.Header />
                  <OnBoarding.Content />
                  <OnBoarding.Footer />
                </OnBoarding>
              ) : (
                <OnBoarding getAnswers={getAnswers} />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default OnboardingPage;