import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';

function StatsCard({ title, value, icon, color = 'primary', trend }) {
  const colorClasses = {
    primary: 'bg-primary-500 text-white',
    success: 'bg-success-500 text-white',
    warning: 'bg-warning-500 text-white',
    danger: 'bg-danger-500 text-white'
  };

  const trendColor = trend?.startsWith('+') ? 'text-success-600' : 
                    trend?.startsWith('-') ? 'text-danger-600' : 'text-gray-500';

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      whileHover={{ y: -2, shadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm font-medium mt-1 ${trendColor}`}>
              {trend} from last quarter
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <SafeIcon icon={icon} className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}

export default StatsCard;