import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useRoyalties } from '../context/RoyaltiesContext';
import RoyaltiesTable from '../components/RoyaltiesTable';
import RoyaltiesFilters from '../components/RoyaltiesFilters';
import AddRoyaltyModal from '../components/AddRoyaltyModal';
import CSVImportModal from '../components/CSVImportModal';

const { FiPlus, FiUpload } = FiIcons;

function RoyaltiesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Royalties</h1>
            <p className="text-gray-600">Manage and track all your music royalties</p>
          </div>
          
          <div className="flex space-x-3">
            <motion.button
              onClick={() => setShowImportModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-green-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={FiUpload} className="h-4 w-4" />
              <span>Import CSV</span>
            </motion.button>
            
            <motion.button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={FiPlus} className="h-4 w-4" />
              <span>Add Royalty</span>
            </motion.button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <RoyaltiesFilters />
          <RoyaltiesTable />
        </div>

        <AddRoyaltyModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
        />
        
        <CSVImportModal 
          isOpen={showImportModal} 
          onClose={() => setShowImportModal(false)} 
        />
      </motion.div>
    </div>
  );
}

export default RoyaltiesPage;