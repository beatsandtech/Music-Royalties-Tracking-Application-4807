import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useRoyalties } from '../context/RoyaltiesContext';

const { FiX, FiUpload, FiDownload, FiAlertCircle, FiCheck } = FiIcons;

function CSVImportModal({ isOpen, onClose }) {
  const { dispatch } = useRoyalties();
  const [dragActive, setDragActive] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setIsProcessing(true);
    setImportResults(null);

    try {
      const text = await file.text();
      const results = parseCSV(text);
      setImportResults(results);
    } catch (error) {
      console.error('Error processing file:', error);
      setImportResults({
        success: 0,
        errors: ['Failed to process file. Please check the file format.'],
        imported: []
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      throw new Error('Empty file');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const results = {
      success: 0,
      errors: [],
      imported: []
    };

    // Define possible column mappings for different distributors
    const columnMappings = {
      songTitle: ['song title', 'track title', 'song', 'title', 'track name'],
      artistName: ['artist name', 'artist', 'primary artist', 'main artist'],
      store: ['store', 'platform', 'service', 'dsp', 'retailer'],
      quarter: ['quarter', 'reporting period', 'period'],
      year: ['year', 'reporting year'],
      streams: ['streams', 'quantity', 'units', 'plays', 'stream count'],
      amount: ['amount', 'earnings', 'revenue', 'royalty', 'net revenue'],
      currency: ['currency', 'currency code'],
      date: ['date', 'reporting date', 'period end', 'statement date'],
      territory: ['territory', 'country', 'region', 'market']
    };

    // Create header mapping
    const headerMap = {};
    Object.keys(columnMappings).forEach(field => {
      const headerIndex = headers.findIndex(header => 
        columnMappings[field].some(mapping => 
          header.toLowerCase().includes(mapping.toLowerCase())
        )
      );
      if (headerIndex !== -1) {
        headerMap[field] = headerIndex;
      }
    });

    // Process data rows
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        
        if (values.length < 2) continue; // Skip empty or invalid rows

        const royalty = {
          songTitle: getValue(values, headerMap.songTitle) || 'Unknown Song',
          artistName: getValue(values, headerMap.artistName) || 'Unknown Artist',
          store: getValue(values, headerMap.store) || 'Unknown Store',
          quarter: parseQuarter(getValue(values, headerMap.quarter)) || 'Q1',
          year: parseInt(getValue(values, headerMap.year)) || new Date().getFullYear(),
          streams: parseInt(getValue(values, headerMap.streams)) || 0,
          amount: parseFloat(getValue(values, headerMap.amount)) || 0,
          currency: getValue(values, headerMap.currency) || 'USD',
          date: parseDate(getValue(values, headerMap.date)) || new Date().toISOString().split('T')[0],
          territory: getValue(values, headerMap.territory) || ''
        };

        // Validate required fields
        if (!royalty.songTitle || royalty.songTitle === 'Unknown Song' ||
            !royalty.artistName || royalty.artistName === 'Unknown Artist' ||
            royalty.amount <= 0) {
          results.errors.push(`Row ${i + 1}: Missing required data (song, artist, or amount)`);
          continue;
        }

        results.imported.push(royalty);
        results.success++;
      } catch (error) {
        results.errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    return results;
  };

  const parseCSVLine = (line) => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current.trim());
    return values;
  };

  const getValue = (values, index) => {
    return index !== undefined && values[index] !== undefined ? values[index].replace(/"/g, '').trim() : '';
  };

  const parseQuarter = (value) => {
    if (!value) return null;
    const quarter = value.toUpperCase().match(/Q[1-4]/);
    return quarter ? quarter[0] : null;
  };

  const parseDate = (value) => {
    if (!value) return null;
    
    try {
      // Try different date formats
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (error) {
      // If parsing fails, return null
    }
    
    return null;
  };

  const confirmImport = () => {
    if (importResults && importResults.imported.length > 0) {
      importResults.imported.forEach(royalty => {
        dispatch({ type: 'ADD_ROYALTY', payload: royalty });
      });
      
      alert(`Successfully imported ${importResults.success} royalty records!`);
      onClose();
      setImportResults(null);
    }
  };

  const downloadTemplate = () => {
    const template = `Song Title,Artist Name,Store,Quarter,Year,Streams,Amount,Currency,Date,Territory
"Summer Nights","The Melody Makers","Spotify","Q1",2024,125000,850.50,"USD","2024-01-15","United States"
"Electric Dreams","Neon Pulse","Apple Music","Q1",2024,89000,712.30,"EUR","2024-02-20","Germany"`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'royalties_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <motion.div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Import CSV Data</h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="h-6 w-6" />
                  </button>
                </div>

                {!importResults ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">CSV Format Requirements</h4>
                      <p className="text-blue-800 text-sm mb-3">
                        Your CSV should contain columns for: Song Title, Artist Name, Store, Quarter, Year, Streams, Amount, Currency, Date, and Territory.
                      </p>
                      <button
                        onClick={downloadTemplate}
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <SafeIcon icon={FiDownload} className="h-4 w-4" />
                        <span>Download Template</span>
                      </button>
                    </div>

                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive 
                          ? 'border-primary-400 bg-primary-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <SafeIcon 
                        icon={FiUpload} 
                        className={`mx-auto h-12 w-12 mb-4 ${
                          dragActive ? 'text-primary-500' : 'text-gray-400'
                        }`} 
                      />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {dragActive ? 'Drop your CSV file here' : 'Upload CSV File'}
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Drag and drop your CSV file here, or click to browse
                      </p>
                      <label className="inline-block">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileInput}
                          className="hidden"
                        />
                        <motion.span
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-primary-700 transition-colors inline-block"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Choose File
                        </motion.span>
                      </label>
                    </div>

                    {isProcessing && (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        <p className="text-gray-600 mt-2">Processing your file...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h4 className="font-medium text-gray-900 mb-4">Import Results</h4>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2 text-green-600">
                          <SafeIcon icon={FiCheck} className="h-5 w-5" />
                          <span className="font-medium">{importResults.success} records ready to import</span>
                        </div>
                        
                        {importResults.errors.length > 0 && (
                          <div className="flex items-center space-x-2 text-red-600">
                            <SafeIcon icon={FiAlertCircle} className="h-5 w-5" />
                            <span className="font-medium">{importResults.errors.length} errors</span>
                          </div>
                        )}
                      </div>

                      {importResults.errors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <h5 className="font-medium text-red-900 mb-2">Errors:</h5>
                          <ul className="text-red-800 text-sm space-y-1">
                            {importResults.errors.slice(0, 5).map((error, index) => (
                              <li key={index}>• {error}</li>
                            ))}
                            {importResults.errors.length > 5 && (
                              <li className="text-red-600">
                                ... and {importResults.errors.length - 5} more errors
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {importResults.imported.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <h5 className="font-medium text-green-900 mb-2">Preview of imported data:</h5>
                          <div className="max-h-40 overflow-y-auto">
                            {importResults.imported.slice(0, 3).map((royalty, index) => (
                              <div key={index} className="text-green-800 text-sm py-1">
                                {royalty.songTitle} by {royalty.artistName} - {royalty.store} ({royalty.currency} {royalty.amount})
                              </div>
                            ))}
                            {importResults.imported.length > 3 && (
                              <div className="text-green-600 text-sm">
                                ... and {importResults.imported.length - 3} more records
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-3">
                      <motion.button
                        onClick={() => setImportResults(null)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Back
                      </motion.button>
                      
                      {importResults.success > 0 && (
                        <motion.button
                          onClick={confirmImport}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Import {importResults.success} Records
                        </motion.button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CSVImportModal;