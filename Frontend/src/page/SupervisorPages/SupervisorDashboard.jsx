// DashboardOverview.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// IMPORTANT: Update API_BASE_URL to point to your backend
const API_BASE_URL = 'http://localhost:5000/api'; // Your backend URL
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SupervisorDashboard = ({ supervisorId }) => { // Ensure supervisorId is passed as a prop
  const [dashboardData, setDashboardData] = useState({
    loading: true,
    error: null,
    stats: {
      totalProspects: 0,
      totalFeedbacks: 0, // Changed from followUps to totalFeedbacks to match backend
      officeVisits: 0,
      totalSales: 0,
      siteVisits: 0,
      salesAmount: 0
    },
    agentsPerformance: [],
    visitDistribution: [],
    salesTrend: []
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });

  useEffect(() => {
    const loadData = async () => {
      if (!supervisorId) { // Ensure supervisorId is available before fetching
        setDashboardData(prev => ({ ...prev, loading: false, error: 'Supervisor ID not provided.' }));
        return;
      }

      try {
        setDashboardData(prev => ({ ...prev, loading: true, error: null }));
        // UPDATED API CALL: Now points to the supervisor-specific route
        const response = await axios.get(`${API_BASE_URL}/${supervisorId}/dashboard`);

        setDashboardData({
          loading: false,
          error: null,
          ...response.data.data
        });
      } catch (error) {
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: error.response?.data?.message || 'Failed to load dashboard data'
        }));
      }
    };

    loadData();
  }, [supervisorId, dateRange]); // Dependency array includes supervisorId

  const handleDateChange = (e, type) => {
    setDateRange(prev => ({
      ...prev,
      [type]: new Date(e.target.value)
    }))
  };

  if (dashboardData.loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  if (dashboardData.error) {
    return <div className="text-red-500 p-4">Error: {dashboardData.error}</div>;
  }

  // Helper for rendering PieChart labels
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen font-inter">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, Supervisor!</h1> {/* Assuming supervisorName comes from a user context or login */}
            <p className="text-gray-600">Role: Supervisor</p>
            <p className="text-gray-800 mt-2">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
              <input
                type="date"
                value={dateRange.startDate.toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(e, 'startDate')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End date</label>
              <input
                type="date"
                value={dateRange.endDate.toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(e, 'endDate')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Prospects" value={dashboardData.stats.totalProspects} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>} />
        <StatCard title="Total Feedbacks" value={dashboardData.stats.totalFeedbacks} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.455 3.63 2.745 7.5 2.745s7.5-1.29 7.5-2.745m-.75-6.09c0 1.455-3.63 2.745-7.5 2.745S5.25 9.165 5.25 7.71M4.5 18.75h15c.621 0 1.125-.504 1.125-1.125V9.25a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 9.25v8.375c0 .621.504 1.125 1.125 1.125z" /></svg>} />
        <StatCard title="Office Visits" value={dashboardData.stats.officeVisits} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
        <StatCard title="Site Visits" value={dashboardData.stats.siteVisits} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
        <StatCard title="Total Sales" value={dashboardData.stats.totalSales} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Sales Amount" value={`$${dashboardData.stats.salesAmount.toLocaleString()}`} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.79 12 12 12c-.725 0-1.45-.22-2.003-.659-1.172-.879-1.172-2.303 0-3.182s2.913-.659 4.242 0M12 6V4m0 2v10m0-10a2 2 0 00-2 2v4a2 2 0 002 2M4 16h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Agent Performance Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Agent Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.agentsPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalSales" fill="#8884d8" name="Total Sales" />
              <Bar dataKey="officeVisits" fill="#82ca9d" name="Office Visits" />
              <Bar dataKey="siteVisits" fill="#ffc658" name="Site Visits" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Visit Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Visit Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.visitDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {dashboardData.visitDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dashboardData.salesTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" name="Sales Amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Feedback Section (Example) */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Client Feedback</h2>
        {dashboardData.recentFeedbacks && dashboardData.recentFeedbacks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {dashboardData.recentFeedbacks.map((feedback) => (
              <li key={feedback.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{feedback.clientName}</p>
                  <p className="text-sm text-gray-500">{feedback.feedback}</p>
                </div>
                {/* Add more details or actions here if needed */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent feedback available.</p>
        )}
      </div>
    </div>
  );
};

// Simple StatCard component for reusability
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
    <div className="flex-shrink-0 p-3 rounded-full bg-gray-100">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);


export default SupervisorDashboard;