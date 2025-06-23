import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';

const { FiMusic, FiHome, FiDollarSign, FiBarChart3, FiSettings, FiLogOut } = FiIcons;

function Header() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/royalties', label: 'Royalties', icon: FiDollarSign },
    { path: '/reports', label: 'Reports', icon: FiBarChart3 },
    { path: '/settings', label: 'Settings', icon: FiSettings }
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-500 p-2 rounded-lg">
              <SafeIcon icon={FiMusic} className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Royalties Tracker</h1>
          </div>

          <div className="flex items-center space-x-1">
            <nav className="flex space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} className="relative">
                    <motion.div
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <SafeIcon icon={item.icon} className="h-4 w-4" />
                      <span>{item.label}</span>
                    </motion.div>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                        layoutId="activeTab"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="ml-4 pl-4 border-l border-gray-200">
              <motion.button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiLogOut} className="h-4 w-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;