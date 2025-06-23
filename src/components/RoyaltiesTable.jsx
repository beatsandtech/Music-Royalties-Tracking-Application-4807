import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useRoyalties } from '../context/RoyaltiesContext';

const { FiEdit2, FiTrash2, FiArrowUp, FiArrowDown } = FiIcons;

function RoyaltiesTable() {
  const { royalties, filters, settings, convertCurrency, dispatch } = useRoyalties();

  const filteredAndSortedRoyalties = useMemo(() => {
    let filtered = royalties.filter(royalty => {
      if (filters.quarter && royalty.quarter !== filters.quarter) return false;
      if (filters.year && royalty.year !== filters.year) return false;
      if (filters.artist && royalty.artistName !== filters.artist) return false;
      if (filters.song && royalty.songTitle !== filters.song) return false;
      if (filters.store && royalty.store !== filters.store) return false;
      return true;
    });

    filtered.sort((a, b) => {
      let aValue = a[filters.sortBy];
      let bValue = b[filters.sortBy];

      if (filters.sortBy === 'amount') {
        aValue = convertCurrency(a.amount, a.currency, settings.baseCurrency);
        bValue = convertCurrency(b.amount, b.currency, settings.baseCurrency);
      }

      if (filters.sortBy === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [royalties, filters, settings, convertCurrency]);

  const formatCurrency = (amount, currency) => {
    const convertedAmount = convertCurrency(amount, currency, settings.baseCurrency);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.baseCurrency
    }).format(convertedAmount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this royalty record?')) {
      dispatch({ type: 'DELETE_ROYALTY', payload: id });
    }
  };

  const getSortIcon = (column) => {
    if (filters.sortBy !== column) return null;
    return filters.sortOrder === 'asc' ? FiArrowUp : FiArrowDown;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-4 px-6 font-medium text-gray-600">
              <div className="flex items-center space-x-1">
                <span>Song</span>
                <SafeIcon icon={getSortIcon('songTitle')} className="h-3 w-3" />
              </div>
            </th>
            <th className="text-left py-4 px-6 font-medium text-gray-600">
              <div className="flex items-center space-x-1">
                <span>Artist</span>
                <SafeIcon icon={getSortIcon('artistName')} className="h-3 w-3" />
              </div>
            </th>
            <th className="text-left py-4 px-6 font-medium text-gray-600">
              <div className="flex items-center space-x-1">
                <span>Store</span>
                <SafeIcon icon={getSortIcon('store')} className="h-3 w-3" />
              </div>
            </th>
            <th className="text-left py-4 px-6 font-medium text-gray-600">Period</th>
            <th className="text-right py-4 px-6 font-medium text-gray-600">
              <div className="flex items-center justify-end space-x-1">
                <span>Streams</span>
                <SafeIcon icon={getSortIcon('streams')} className="h-3 w-3" />
              </div>
            </th>
            <th className="text-right py-4 px-6 font-medium text-gray-600">
              <div className="flex items-center justify-end space-x-1">
                <span>Earnings ({settings.baseCurrency})</span>
                <SafeIcon icon={getSortIcon('amount')} className="h-3 w-3" />
              </div>
            </th>
            <th className="text-left py-4 px-6 font-medium text-gray-600">
              <div className="flex items-center space-x-1">
                <span>Date</span>
                <SafeIcon icon={getSortIcon('date')} className="h-3 w-3" />
              </div>
            </th>
            <th className="text-center py-4 px-6 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedRoyalties.map((royalty, index) => (
            <motion.tr
              key={royalty.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <td className="py-4 px-6">
                <div className="font-medium text-gray-900">{royalty.songTitle}</div>
              </td>
              <td className="py-4 px-6 text-gray-600">{royalty.artistName}</td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {royalty.store}
                </span>
              </td>
              <td className="py-4 px-6 text-gray-600">
                {royalty.quarter} {royalty.year}
              </td>
              <td className="py-4 px-6 text-right font-medium text-gray-900">
                {formatNumber(royalty.streams)}
              </td>
              <td className="py-4 px-6 text-right font-medium text-gray-900">
                {formatCurrency(royalty.amount, royalty.currency)}
                {royalty.currency !== settings.baseCurrency && (
                  <div className="text-xs text-gray-500">
                    ({royalty.currency} {royalty.amount.toFixed(2)})
                  </div>
                )}
              </td>
              <td className="py-4 px-6 text-gray-600">
                {format(new Date(royalty.date), 'MMM dd, yyyy')}
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center justify-center space-x-2">
                  <motion.button
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <SafeIcon icon={FiEdit2} className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(royalty.id)}
                    className="text-gray-400 hover:text-danger-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                  </motion.button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      
      {filteredAndSortedRoyalties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No royalties found matching your filters.</p>
        </div>
      )}
    </div>
  );
}

export default RoyaltiesTable;