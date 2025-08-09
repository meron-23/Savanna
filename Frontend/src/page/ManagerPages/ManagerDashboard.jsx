import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ManagerDashboard = ({ user }) => {
  // Sample data for charts
  const weeklyVisitsData = [
    { name: 'Team A', visits: 100 },
    { name: 'Team B', visits: 90 },
    { name: 'Team C', visits: 60 },
    { name: 'Team D', visits: 30 }
  ];

  const comparisonData = [
    { name: 'Mon', lastWeek: 40, thisWeek: 45 },
    { name: 'Tue', lastWeek: 35, thisWeek: 42 },
    { name: 'Wed', lastWeek: 50, thisWeek: 55 },
    { name: 'Thu', lastWeek: 45, thisWeek: 50 },
    { name: 'Fri', lastWeek: 30, thisWeek: 38 },
    { name: 'Sat', lastWeek: 20, thisWeek: 25 },
    { name: 'Sun', lastWeek: 15, thisWeek: 18 }
  ];

  const visitsDistribution = [
    { name: 'Site Visits', value: 57 },
    { name: 'Office Visits', value: 19 },
    { name: 'Other', value: 24 }
  ];

  const salesSourceData = [
    { name: 'Sales Team', value: 85 },
    { name: 'Digital Dept', value: 14 },
    { name: 'Other', value: 1 }
  ];

  const COLORS = ['#333333', '#FFD700', '#F4C430'];

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome, Back!</h1> {/* Assuming supervisorName comes from a user context or login */}
              <p className="text-gray-600">Role: Manager</p>
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
      <div className="mb-8">
        
        {/* Performance Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
          <h4 className="font-medium text-gray-600 mb-4">Role Manager</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-gray-600 mb-2">Total Prospects</h5>
              <p className="text-2xl font-bold">7,435</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-gray-600 mb-2">Prospects This Week</h5>
              <p className="text-2xl font-bold">198</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-gray-600 mb-2">Prospects Today</h5>
              <p className="text-2xl font-bold">65</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-gray-600 mb-2">Total Sales Amount</h5>
              <p className="text-2xl font-bold">160,027,140 ETB</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-gray-600 mb-2">Total Sold Properties</h5>
              <p className="text-2xl font-bold">7</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Visits Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Office & Site Visits per Team</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyVisitsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="visits" fill="#F4C430" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Last Week vs. This Week Visits</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="lastWeek" fill="#F4C430" />
                  <Bar dataKey="thisWeek" fill="#333333" />
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
              <div>
                <h5 className="text-gray-600">Total Supervisors</h5>
                <p className="text-xl font-bold">2</p>
              </div>
              <div>
                <h5 className="text-gray-600">Total Other Visits</h5>
                <p className="text-xl font-bold">42</p>
              </div>
              <div>
                <h5 className="text-gray-600">Total Sales Agents</h5>
                <p className="text-xl font-bold">20</p>
              </div>
              <div>
                <h5 className="text-gray-600">Total Site Visits</h5>
                <p className="text-xl font-bold">285</p>
              </div>
              <div>
                <h5 className="text-gray-600">Today's Activity</h5>
                <p className="text-xl font-bold">350</p>
              </div>
            </div>
          </div>

          {/* Visits Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Office vs Site Visits Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={visitsDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {visitsDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales Source */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Sales Source Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;