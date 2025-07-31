import React, { useState, useEffect } from 'react';
import ProspectsBarChart from './ProspectsBarChart'; 
import MethodsPieChart from './MethodsPieChart';     
import { isToday, isThisWeek } from '../../utils/dateHelpers'; // <--- UPDATED IMPORT PATH


const DashboardOverview = () => {
  const [prospectsData, setProspectsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [followUpNumberInput, setFollowUpNumberInput] = useState('');

  const handleSubmitFollowUpInput = () => {
    console.log("Submitting daily follow-up number:", followUpNumberInput);
    alert(`Daily follow-up count submitted: ${followUpNumberInput}`);
    setFollowUpNumberInput(''); 
  };

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/prospects'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setProspectsData(result.data); 
        } else {
          setError(result.message || 'Failed to fetch prospects');
        }
      } catch (err) {
        console.error("Error fetching prospects:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProspects();
  }, []);

  // --- Data for Metric Cards ---
  const totalProspects = prospectsData.length; 
  const officeVisits = prospectsData.filter(p => p.method === 'Office Visit').length; 
  const siteVisits = prospectsData.filter(p => p.site === 'Visited').length; 
  const salesCount = prospectsData.filter(p => p.remark === 'Closed-Won').length; 
  const followUpsMetric = prospectsData.filter(p => p.method === 'Follow-up').length; 

  // --- Data for Bar Chart (Prospects Overview) ---
  const dailyProspects = prospectsData.filter(p => isToday(p.dateNow)).length;
  const weeklyProspects = prospectsData.filter(p => isThisWeek(p.dateNow)).length;

  const barChartData = {
    labels: ['Daily', 'Weekly', 'Total'],
    datasets: [
      {
        label: 'Prospects Count',
        data: [dailyProspects, weeklyProspects, totalProspects],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', 
          'rgba(255, 159, 64, 0.6)', 
          'rgba(54, 162, 235, 0.6)'  
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // --- Data for Pie Chart (Methods Distribution) ---
  const methodsCount = {};
  prospectsData.forEach(p => {
    const method = p.method || 'Unknown'; 
    methodsCount[method] = (methodsCount[method] || 0) + 1;
  });

  const pieChartLabels = Object.keys(methodsCount);
  const pieChartDataValues = Object.values(methodsCount);

  const pieChartData = {
    labels: pieChartLabels,
    datasets: [
      {
        data: pieChartDataValues,
        backgroundColor: [
          '#FF6384', 
          '#FFCE56', 
          '#8A2BE2', 
          '#00CED1', 
          '#36A2EB', 
          '#4CAF50', 
          '#FF9800',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#FFCE56',
          '#8A2BE2',
          '#00CED1',
          '#36A2EB',
          '#4CAF50',
          '#FF9800',
        ],
      },
    ],
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 w-full">
      {/* Today's Follow-ups Section (input field) */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="text-red-500 text-xl mr-1">*</span> 
          Today's Follow-ups
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <input
            type="number" 
            placeholder="Enter number"
            value={followUpNumberInput}
            onChange={(e) => setFollowUpNumberInput(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent text-gray-700"
          />
          <button 
            onClick={handleSubmitFollowUpInput}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition duration-200 w-full sm:w-auto"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Prospects Overview Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Prospects Overview</h3>
          <div className="w-full h-80"> 
            <ProspectsBarChart chartData={barChartData} />
          </div>
        </div>

        {/* Methods Distribution Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Methods Distribution</h3>
          <div className="w-full h-80 flex justify-center items-center"> 
            <MethodsPieChart chartData={pieChartData} />
          </div>
        </div>
      </div>

      {/* "Filter By Date" section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter By Date</h3>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">From Date :</label>
            <div className="relative">
              <input
                type="date" 
                id="fromDate"
                className="w-full p-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent text-gray-700"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h.01M7 12h.01M7 15h.01M15 11h.01M15 12h.01M15 15h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">To Date :</label>
            <div className="relative">
              <input
                type="date" 
                id="toDate"
                className="w-full p-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent text-gray-700"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h.01M7 12h.01M7 15h.01M15 11h.01M15 12h.01M15 15h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid (same as before) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Prospects Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-2.625-2.625C15.447 14.126 13.012 12.5 10 12.5S4.553 14.126 2.5 16.503c-.24.78-.292 1.58-.15 2.385.122.754.542 1.487 1.157 2.083A9.338 9.338 0 0010 21c2.257 0 4.368-.618 6.128-1.672zM12 11.25a3.25 3.25 0 100-6.5 3.25 3.25 0 000 6.5z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Prospects</p>
            <p className="text-2xl font-bold text-gray-800">{totalProspects}</p> 
          </div>
        </div>
        
        {/* Office Visits card */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-full text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-2v-4.724A2.25 2.25 0 0 1 5.405 12H10.5M7.5 7.5v.008v-.008Zm2.25 0v.008v-.008Zm2.25 0v.008v-.008Zm2.25 0v.008v-.008Zm2.25 0v.008v-.008Zm2.25 0v.008v-.008Zm-15 1.5H6M12 12H6m6 2.25H6M12 14.25H6m6-6.75h.008v.008H12ZM15.75 7.5h.008v.008h-.008ZM18.75 7.5h.008v.008h-.008ZM15.75 12h.008v.008h-.008ZM18.75 12h.008v.008h-.008ZM15.75 16.5h.008v.008h-.008ZM18.75 16.5h.008v.008h-.008Z" />
                </svg>
            </div>
            <div>
                <p className="text-gray-500 text-sm">Office Visits</p>
                <p className="text-2xl font-bold text-gray-800">{officeVisits}</p> 
            </div>
        </div>
        
        {/* Site Visits card */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
            </div>
            <div>
                <p className="text-gray-500 text-sm">Site Visits</p>
                <p className="text-2xl font-bold text-gray-800">{siteVisits}</p> 
            </div>
        </div>

        {/* Sales card */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0 1.25-.8 2.296-2 2.766V15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-.234c-1.2-.47-2-1.516-2-2.766 0-1.25.8-2.296 2-2.766V9a2 2 0 0 1 2-2h7.5a2 2 0 0 1 2 2v.234c1.2.47 2 1.516 2 2.766Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m-3-3h6" />
                </svg>
            </div>
            <div>
                <p className="text-gray-500 text-sm">Sales</p>
                <p className="text-2xl font-bold text-gray-800">{salesCount}</p> 
            </div>
        </div>

        {/* Follow-ups metric card */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
          <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 10.5h12M8.25 14.25h12M8.25 18h12M3.75 6.75h.008v.008H3.75V6.75ZM3.75 10.5h.008v.008H3.75V10.5ZM3.75 14.25h.008v.008H3.75V14.25ZM3.75 18h.008v.008H3.75V18Z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Follow-ups</p>
            <p className="text-2xl font-bold text-gray-800">{followUpsMetric}</p> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;