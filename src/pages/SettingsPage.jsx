import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useRoyalties } from '../context/RoyaltiesContext';

const { FiSave, FiDollarSign, FiRefreshCw } = FiIcons;

function SettingsPage() {
  const { settings, dispatch } = useRoyalties();
  const [exchangeRates, setExchangeRates] = useState(settings.exchangeRates);
  const [baseCurrency, setBaseCurrency] = useState(settings.baseCurrency);

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        baseCurrency,
        exchangeRates
      }
    });
    alert('Settings saved successfully!');
  };

  const handleExchangeRateChange = (currency, rate) => {
    setExchangeRates({
      ...exchangeRates,
      [currency]: parseFloat(rate) || 0
    });
  };

  const resetToDefaults = () => {
    const defaultRates = {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      CAD: 1.25,
      AUD: 1.35,
      JPY: 110
    };
    setExchangeRates(defaultRates);
    setBaseCurrency('USD');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure your currency preferences and exchange rates</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <SafeIcon icon={FiDollarSign} className="h-5 w-5" />
                <span>Base Currency</span>
              </h3>
              <p className="text-gray-600 mb-4">
                Select your preferred base currency for displaying converted amounts.
              </p>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exchange Rates</h3>
              <p className="text-gray-600 mb-4">
                Set exchange rates relative to USD. These rates will be used to convert royalties to your base currency.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currencies.map(currency => (
                  <div key={currency} className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currency} to USD
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      min="0"
                      value={exchangeRates[currency]}
                      onChange={(e) => handleExchangeRateChange(currency, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter rate"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      1 USD = {exchangeRates[currency]} {currency}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <motion.button
                onClick={resetToDefaults}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiRefreshCw} className="h-4 w-4" />
                <span>Reset to Defaults</span>
              </motion.button>

              <motion.button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiSave} className="h-4 w-4" />
                <span>Save Settings</span>
              </motion.button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Note about Exchange Rates</h4>
          <p className="text-blue-800 text-sm">
            Exchange rates are manually set and should be updated regularly to reflect current market rates. 
            Consider using a financial data service for real-time rates in a production environment.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default SettingsPage;