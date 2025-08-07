import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const MethodsPieChart = ({ chartData }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill its container
    plugins: {
      legend: {
        position: 'right', // Position legend to the right as in the image
      },
      title: {
        display: false, // Title is in the parent component
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default MethodsPieChart;