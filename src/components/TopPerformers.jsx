import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useRoyalties } from '../context/RoyaltiesContext';

const { FiMusic, FiTrendingUp } = FiIcons;

function TopPerformers() {
  const { royalties, settings, convertCurrency } = useRoyalties();

  const getTopSongs = () => {
    const songStats = {};
    
    royalties.forEach(royalty => {
      const key = `${royalty.songTitle}-${royalty.artistName}`;
      const convertedAmount = convertCurrency(royalty.amount, royalty.currency, settings.baseCurrency);
      
      if (!songStats[key]) {
        songStats[key] = {
          songTitle: royalty.songTitle,
          artistName: royalty.artistName,
          totalEarnings: 0,
          totalStreams: 0
        };
      }
      
      songStats[key].totalEarnings += convertedAmount;
      songStats[key].totalStreams += royalty.streams;
    });

    return Object.values(songStats)
      .sort((a, b) => b.totalEarnings - a.totalEarnings)
      .slice(0, 5);
  };

  const topSongs = getTopSongs();

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
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Songs</h3>
      <div className="space-y-4">
        {topSongs.map((song, index) => (
          <motion.div
            key={`${song.songTitle}-${song.artistName}`}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 p-2 rounded-lg">
                <SafeIcon icon={FiMusic} className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{song.songTitle}</h4>
                <p className="text-sm text-gray-600">{song.artistName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {formatCurrency(song.totalEarnings)}
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <SafeIcon icon={FiTrendingUp} className="h-3 w-3 mr-1" />
                {formatNumber(song.totalStreams)} streams
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default TopPerformers;