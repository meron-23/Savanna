import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API_BASE_URL = 'http://localhost:5000/api';
const COLORS = ['#333333', '#FFD700', '#F4C430', '#FF8042'];

const SupervisorDashboard = ({ user }) => { // Changed from supervisorId to user prop
  const [dashboardData, setDashboardData] = useState({
    loading: true,
    error: null,
    stats: {
      totalProspects: 7435,
      totalFeedbacks: 198,
      officeVisits: 65,
      totalSales: 7,
      siteVisits: 285,
      salesAmount: 160027140
    },
    agentsPerformance: [
      { name: 'Team A', totalSales: 100, officeVisits: 45, siteVisits: 55 },
      { name: 'Team B', totalSales: 90, officeVisits: 42, siteVisits: 48 },
      { name: 'Team C', totalSales: 60, officeVisits: 30, siteVisits: 30 },
      { name: 'Team D', totalSales: 30, officeVisits: 15, siteVisits: 15 }
    ],
    visitDistribution: [
      { name: 'Site Visits', value: 57 },
      { name: 'Office Visits', value: 19 },
      { name: 'Other', value: 24 }
    ],
    salesTrend: [
      { name: 'Mon', sales: 40 },
      { name: 'Tue', sales: 35 },
      { name: 'Wed', sales: 50 },
      { name: 'Thu', sales: 45 },
      { name: 'Fri', sales: 30 },
      { name: 'Sat', sales: 20 },
      { name: 'Sun', sales: 15 }
    ],
    recentFeedbacks: []
  });

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true, error: null }));
        
        // If you want to fetch data later, you can use:
        // const response = await axios.get(`${API_BASE_URL}/supervisor/dashboard`);
        // setDashboardData({ ...response.data.data, loading: false });
        
        // For now using mock data
        setTimeout(() => {
          setDashboardData(prev => ({ ...prev, loading: false }));
        }, 1000);
      } catch (error) {
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: error.response?.data?.message || 'Failed to load dashboard data'
        }));
      }
    };

    loadData();
  }, [dateRange]);

  const handleDateChange = (e, type) => {
    setDateRange(prev => ({
      ...prev,
      [type]: new Date(e.target.value)
    }));
  };

  if (dashboardData.loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  if (dashboardData.error) {
    return <div className="text-red-500 p-4">Error: {dashboardData.error}</div>;
  }

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
    <div className="p-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name || 'Supervisor'}!</h1>
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
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
        <h4 className="font-medium text-gray-600 mb-4">Role Supervisor</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Prospects" value={dashboardData.stats.totalProspects} />
          <StatCard title="Prospects This Week" value={dashboardData.stats.totalFeedbacks} />
          <StatCard title="Prospects Today" value={dashboardData.stats.officeVisits} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard title="Total Sales Amount" value={`${dashboardData.stats.salesAmount.toLocaleString()} ETB`} />
          <StatCard title="Total Sold Properties" value={dashboardData.stats.totalSales} />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agent Performance Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Agent Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.agentsPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalSales" fill="#F4C430" name="Total Sales" />
                <Bar dataKey="officeVisits" fill="#FF8042" name="Office Visits" />
                <Bar dataKey="siteVisits" fill="#333333" name="Site Visits" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Sales Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#F4C430" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stats and Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Visits Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Visits Summary</h3>
          <div className="space-y-4">
            <StatCardSmall title="Total Agents" value="20" />
            <StatCardSmall title="Total Site Visits" value={dashboardData.stats.siteVisits} />
            <StatCardSmall title="Total Office Visits" value={dashboardData.stats.officeVisits} />
            <StatCardSmall title="Today's Activity" value="350" />
          </div>
        </div>

        {/* Visits Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Visits Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.visitDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
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

        {/* Recent Feedback */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Client Feedback</h3>
          {dashboardData.recentFeedbacks && dashboardData.recentFeedbacks.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {dashboardData.recentFeedbacks.map((feedback, index) => (
                <li key={index} className="py-3">
                  <p className="text-sm font-medium text-gray-900">{feedback.clientName}</p>
                  <p className="text-sm text-gray-500">{feedback.feedback}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent feedback available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable StatCard components
const StatCard = ({ title, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h5 className="text-gray-600 mb-2">{title}</h5>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const StatCardSmall = ({ title, value }) => (
  <div>
    <h5 className="text-gray-600">{title}</h5>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export default SupervisorDashboard;