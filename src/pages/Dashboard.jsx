import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useRoyalties } from '../context/RoyaltiesContext';
import StatsCard from '../components/StatsCard';
import QuarterlyChart from '../components/QuarterlyChart';
import TopPerformers from '../components/TopPerformers';
import RecentRoyalties from '../components/RecentRoyalties';

const { FiDollarSign, FiMusic, FiTrendingUp, FiUsers } = FiIcons;

function Dashboard() {
  const { royalties, settings, convertCurrency } = useRoyalties();

  const calculateStats = () => {
    const currentYear = new Date().getFullYear();
    const currentYearRoyalties = royalties.filter(r => r.year === currentYear);
    
    const totalEarnings = currentYearRoyalties.reduce((sum, royalty) => {
      return sum + convertCurrency(royalty.amount, royalty.currency, settings.baseCurrency);
    }, 0);

    const totalStreams = currentYearRoyalties.reduce((sum, royalty) => sum + royalty.streams, 0);
    
    const uniqueSongs = new Set(currentYearRoyalties.map(r => r.songTitle)).size;
    const uniqueArtists = new Set(currentYearRoyalties.map(r => r.artistName)).size;

    return {
      totalEarnings,
      totalStreams,
      uniqueSongs,
      uniqueArtists
    };
  };

  const stats = calculateStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.baseCurrency
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your music royalties and performance metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Earnings"
            value={formatCurrency(stats.totalEarnings)}
            icon={FiDollarSign}
            color="primary"
            trend="+12.5%"
          />
          <StatsCard
            title="Total Streams"
            value={formatNumber(stats.totalStreams)}
            icon={FiTrendingUp}
            color="success"
            trend="+8.3%"
          />
          <StatsCard
            title="Active Songs"
            value={stats.uniqueSongs}
            icon={FiMusic}
            color="warning"
            trend="+2"
          />
          <StatsCard
            title="Artists"
            value={stats.uniqueArtists}
            icon={FiUsers}
            color="danger"
            trend="0"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <QuarterlyChart />
          <TopPerformers />
        </div>

        <RecentRoyalties />
      </motion.div>
    </div>
  );
}

export default Dashboard;