import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProspectsBarChart = ({ chartData }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill its container
    plugins: {
      legend: {
        position: 'top', // Position legend at the top
      },
      title: {
        display: false, // Title is in the parent component
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Prospects Count', // Y-axis label
        },
      },
      x: {
        title: {
          display: false, // X-axis label, already clear from labels
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default ProspectsBarChart;