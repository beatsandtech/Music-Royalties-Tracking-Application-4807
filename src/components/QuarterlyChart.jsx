import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { useRoyalties } from '../context/RoyaltiesContext';

function QuarterlyChart() {
  const { royalties, settings, convertCurrency } = useRoyalties();

  const getChartData = () => {
    const quarterlyData = {};
    
    royalties.forEach(royalty => {
      const key = `${royalty.year}-${royalty.quarter}`;
      const convertedAmount = convertCurrency(royalty.amount, royalty.currency, settings.baseCurrency);
      
      if (!quarterlyData[key]) {
        quarterlyData[key] = {
          quarter: royalty.quarter,
          year: royalty.year,
          earnings: 0,
          streams: 0
        };
      }
      
      quarterlyData[key].earnings += convertedAmount;
      quarterlyData[key].streams += royalty.streams;
    });

    const sortedData = Object.values(quarterlyData).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.quarter.localeCompare(b.quarter);
    });

    return {
      categories: sortedData.map(d => `${d.quarter} ${d.year}`),
      earnings: sortedData.map(d => Math.round(d.earnings)),
      streams: sortedData.map(d => d.streams)
    };
  };

  const chartData = getChartData();

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function(params) {
        let result = `<strong>${params[0].axisValue}</strong><br/>`;
        params.forEach(param => {
          const value = param.seriesName === 'Earnings' 
            ? `$${param.value.toLocaleString()}` 
            : param.value.toLocaleString();
          result += `${param.marker} ${param.seriesName}: ${value}<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: ['Earnings', 'Streams'],
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.categories,
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#6b7280'
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Earnings ($)',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        axisLabel: {
          color: '#6b7280',
          formatter: '${value}'
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6'
          }
        }
      },
      {
        type: 'value',
        name: 'Streams',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        axisLabel: {
          color: '#6b7280',
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: 'Earnings',
        type: 'bar',
        data: chartData.earnings,
        itemStyle: {
          color: '#0ea5e9'
        },
        emphasis: {
          itemStyle: {
            color: '#0284c7'
          }
        }
      },
      {
        name: 'Streams',
        type: 'line',
        yAxisIndex: 1,
        data: chartData.streams,
        itemStyle: {
          color: '#22c55e'
        },
        lineStyle: {
          color: '#22c55e',
          width: 3
        },
        symbol: 'circle',
        symbolSize: 6
      }
    ]
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quarterly Performance</h3>
      <div className="h-80">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </motion.div>
  );
}

export default QuarterlyChart;