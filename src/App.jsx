import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

import { AuthProvider } from './context/AuthContext';
import { RoyaltiesProvider } from './context/RoyaltiesContext';
import questConfig from './config/questConfig';

import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';
import RoyaltiesPage from './pages/RoyaltiesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

// Quest SDK Provider with fallback
function QuestProviderWrapper({ children }) {
  const [QuestProvider, setQuestProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestSDK = async () => {
      try {
        const questModule = await import('@questlabs/react-sdk');
        await import('@questlabs/react-sdk/dist/style.css');
        setQuestProvider(() => questModule.QuestProvider);
      } catch (error) {
        console.warn('Quest SDK not available:', error);
        setQuestProvider(() => ({ children }) => children);
      } finally {
        setLoading(false);
      }
    };

    loadQuestSDK();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const Provider = QuestProvider || (({ children }) => children);

  return (
    <Provider
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      {children}
    </Provider>
  );
}

function App() {
  return (
    <QuestProviderWrapper>
      <AuthProvider>
        <RoyaltiesProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Header />
                      <motion.main
                        className="pt-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/royalties" element={<RoyaltiesPage />} />
                          <Route path="/reports" element={<ReportsPage />} />
                          <Route path="/settings" element={<SettingsPage />} />
                        </Routes>
                      </motion.main>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </RoyaltiesProvider>
      </AuthProvider>
    </QuestProviderWrapper>
  );
}

export default App;