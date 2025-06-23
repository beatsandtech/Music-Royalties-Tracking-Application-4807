import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { useRoyalties } from '../context/RoyaltiesContext';

function ReportsPage() {
  const { royalties, settings, convertCurrency } = useRoyalties();

  const getArtistPerformanceData = () => {
    const artistData = {};
    
    royalties.forEach(royalty => {
      const convertedAmount = convertCurrency(royalty.amount, royalty.currency, settings.baseCurrency);
      
      if (!artistData[royalty.artistName]) {
        artistData[royalty.artistName] = {
          totalEarnings: 0,
          totalStreams: 0
        };
      }
      
      artistData[royalty.artistName].totalEarnings += convertedAmount;
      artistData[royalty.artistName].totalStreams += royalty.streams;
    });

    const sortedArtists = Object.entries(artistData)
      .sort(([,a], [,b]) => b.totalEarnings - a.totalEarnings)
      .slice(0, 10);

    return {
      artists: sortedArtists.map(([name]) => name),
      earnings: sortedArtists.map(([,data]) => Math.round(data.totalEarnings)),
      streams: sortedArtists.map(([,data]) => data.totalStreams)
    };
  };

  const getStoreDistributionData = () => {
    const storeData = {};
    
    royalties.forEach(royalty => {
      const convertedAmount = convertCurrency(royalty.amount, royalty.currency, settings.baseCurrency);
      
      if (!storeData[royalty.store]) {
        storeData[royalty.store] = 0;
      }
      
      storeData[royalty.store] += convertedAmount;
    });

    return Object.entries(storeData).map(([name, value]) => ({
      name,
      value: Math.round(value)
    }));
  };

  const artistData = getArtistPerformanceData();
  const storeData = getStoreDistributionData();

  const artistChartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['Earnings', 'Streams']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: artistData.artists,
      axisLabel: {
        rotate: 45,
        color: '#6b7280'
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Earnings ($)',
        position: 'left',
        axisLabel: {
          color: '#6b7280',
          formatter: '${value}'
        }
      },
      {
        type: 'value',
        name: 'Streams',
        position: 'right',
        axisLabel: {
          color: '#6b7280'
        }
      }
    ],
    series: [
      {
        name: 'Earnings',
        type: 'bar',
        data: artistData.earnings,
        itemStyle: {
          color: '#0ea5e9'
        }
      },
      {
        name: 'Streams',
        type: 'line',
        yAxisIndex: 1,
        data: artistData.streams,
        itemStyle: {
          color: '#22c55e'
        }
      }
    ]
  };

  const storeChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ${c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Store Distribution',
        type: 'pie',
        radius: '50%',
        data: storeData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">Analyze your royalty performance and trends</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Artist Performance</h3>
            <div className="h-96">
              <ReactECharts option={artistChartOption} style={{ height: '100%', width: '100%' }} />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Store</h3>
            <div className="h-96">
              <ReactECharts option={storeChartOption} style={{ height: '100%', width: '100%' }} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default ReportsPage;