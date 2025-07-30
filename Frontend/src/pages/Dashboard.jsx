// src/pages/Dashboard.jsx
import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Users</h2>
          <p className="text-2xl font-bold">120</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Revenue</h2>
          <p className="text-2xl font-bold">$7,530</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Orders</h2>
          <p className="text-2xl font-bold">245</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-2">
          <li className="text-gray-700">👤 New user signed up: <span className="font-medium">Jane Doe</span></li>
          <li className="text-gray-700">🛒 New order placed: <span className="font-medium">#3456</span></li>
          <li className="text-gray-700">💰 Payment received from <span className="font-medium">John Smith</span></li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
