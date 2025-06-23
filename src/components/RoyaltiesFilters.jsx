import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import CSVExportButton from './CSVExportButton';
import { useRoyalties } from '../context/RoyaltiesContext';

const { FiSearch, FiFilter } = FiIcons;

function RoyaltiesFilters() {
  const { filters, dispatch, royalties } = useRoyalties();

  const handleFilterChange = (key, value) => {
    dispatch({ type: 'SET_FILTERS', payload: { [key]: value } });
  };

  const getUniqueValues = (key) => {
    return [...new Set(royalties.map(r => r[key]))].filter(Boolean).sort();
  };

  const clearAllFilters = () => {
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: {
        quarter: '',
        year: '',
        artist: '',
        song: '',
        store: '',
        sortBy: 'date',
        sortOrder: 'desc'
      }
    });
  };

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const years = getUniqueValues('year');
  const artists = getUniqueValues('artistName');
  const songs = getUniqueValues('songTitle');
  const stores = getUniqueValues('store');

  const hasActiveFilters = filters.quarter || filters.year || filters.artist || filters.song || filters.store;

  return (
    <motion.div
      className="p-6 border-b border-gray-200 bg-gray-50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiFilter} className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        
        <CSVExportButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quarter</label>
          <select
            value={filters.quarter}
            onChange={(e) => handleFilterChange('quarter', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Quarters</option>
            {quarters.map(quarter => (
              <option key={quarter} value={quarter}>{quarter}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value ? parseInt(e.target.value) : '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
          <select
            value={filters.artist}
            onChange={(e) => handleFilterChange('artist', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Artists</option>
            {artists.map(artist => (
              <option key={artist} value={artist}>{artist}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Song</label>
          <select
            value={filters.song}
            onChange={(e) => handleFilterChange('song', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Songs</option>
            {songs.map(song => (
              <option key={song} value={song}>{song}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Store</label>
          <select
            value={filters.store}
            onChange={(e) => handleFilterChange('store', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Stores</option>
            {stores.map(store => (
              <option key={store} value={store}>{store}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="streams">Streams</option>
            <option value="songTitle">Song Title</option>
            <option value="artistName">Artist Name</option>
            <option value="store">Store</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Sort Order:</label>
          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {royalties.length} total records
        </div>
      </div>
    </motion.div>
  );
}

export default RoyaltiesFilters;