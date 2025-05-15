import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Process } from '../../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProcessStatusChartProps {
  processes: Process[];
}

const ProcessStatusChart: React.FC<ProcessStatusChartProps> = ({ processes }) => {
  // Count processes by status
  const statusCounts = processes.reduce((counts, process) => {
    counts[process.status] = (counts[process.status] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  // Format labels
  const formatLabel = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Chart data
  const data = {
    labels: Object.keys(statusCounts).map(formatLabel),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          '#3B82F6', // blue-500
          '#10B981', // green-500
          '#8B5CF6', // purple-500
          '#F59E0B', // amber-500
          '#EF4444', // red-500
          '#6B7280', // gray-500
          '#F472B6', // pink-500
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default ProcessStatusChart;