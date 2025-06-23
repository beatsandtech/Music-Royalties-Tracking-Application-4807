import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useRoyalties } from '../context/RoyaltiesContext';

function RecentRoyalties() {
  const { royalties, settings, convertCurrency } = useRoyalties();

  const recentRoyalties = [...royalties]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Royalties</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Song</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Artist</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Store</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Streams</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Earnings</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentRoyalties.map((royalty, index) => (
              <motion.tr
                key={royalty.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="py-3 px-4 font-medium text-gray-900">{royalty.songTitle}</td>
                <td className="py-3 px-4 text-gray-600">{royalty.artistName}</td>
                <td className="py-3 px-4 text-gray-600">{royalty.store}</td>
                <td className="py-3 px-4 text-gray-600">{formatNumber(royalty.streams)}</td>
                <td className="py-3 px-4 font-medium text-gray-900">
                  {formatCurrency(convertCurrency(royalty.amount, royalty.currency, settings.baseCurrency))}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {format(new Date(royalty.date), 'MMM dd, yyyy')}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default RecentRoyalties;