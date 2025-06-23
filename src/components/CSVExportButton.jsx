import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useRoyalties } from '../context/RoyaltiesContext';

const { FiDownload } = FiIcons;

function CSVExportButton({ className = "" }) {
  const { royalties } = useRoyalties();

  const exportToCSV = () => {
    if (royalties.length === 0) {
      alert('No data to export');
      return;
    }

    // Define CSV headers
    const headers = [
      'Song Title',
      'Artist Name', 
      'Store',
      'Quarter',
      'Year',
      'Streams',
      'Amount',
      'Currency',
      'Date',
      'Territory'
    ];

    // Convert royalties data to CSV format
    const csvData = royalties.map(royalty => [
      `"${royalty.songTitle}"`,
      `"${royalty.artistName}"`,
      `"${royalty.store}"`,
      `"${royalty.quarter}"`,
      royalty.year,
      royalty.streams,
      royalty.amount,
      `"${royalty.currency}"`,
      `"${royalty.date}"`,
      `"${royalty.territory || ''}"`
    ]);

    // Combine headers and data
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `royalties_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.button
      onClick={exportToCSV}
      className={`flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <SafeIcon icon={FiDownload} className="h-4 w-4" />
      <span>Export CSV</span>
    </motion.button>
  );
}

export default CSVExportButton;