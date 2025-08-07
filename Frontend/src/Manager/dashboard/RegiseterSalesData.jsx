import React from 'react';

const RegiseterSalesData = () => {
  const salesData = [
    {
      amount: "46,000,000 ETB",
      agent: "Ellab Etsubdink",
      type: "N/A",
      site: "Other",
      area: "204",
      location: "Hayat",
      date: "Jul 16, 2025",
      soldTo: "Unknown"
    },
    {
      amount: "13,673,700 ETB",
      agent: "Amanuel Tsegaya",
      type: "Apartment",
      site: "N/A",
      area: "152.99",
      location: "Hayat",
      date: "Jul 16, 2025",
      soldTo: "Unknown"
    },
    {
      amount: "47,000,000 ETB",
      agent: "Amanuel Tsegaya",
      type: "N/A",
      site: "Other",
      area: "204",
      location: "Hayat",
      date: "Jul 9, 2025",
      soldTo: "Ato Girma - +251 91 658 1807"
    },
    {
      amount: "14,357,070 ETB",
      agent: "Ellab Etsubdink",
      type: "Apartment",
      site: "Other",
      area: "151.93",
      location: "Ayat",
      date: "Jun 11, 2025",
      soldTo: "Stedele - +251911094990"
    },
    {
      amount: "14,357,070 ETB",
      agent: "Amanuel Tsegaya",
      type: "Apartment",
      site: "Other",
      area: "151.93",
      location: "Ayat",
      date: "Jun 7, 2025",
      soldTo: "Unknown"
    },
    {
      amount: "20,025,000 ETB",
      agent: "Ashenafi Alena",
      type: "Apartment",
      site: "Yebe Real Estate",
      area: "200",
      location: "Au",
      date: "Apr 21, 2025",
      soldTo: "Meselech - 0966255463"
    },
    {
      amount: "4,614,300 ETB",
      agent: "Digital Department",
      type: "Shop",
      site: "N/A",
      area: "17.09",
      location: "Bulgaria",
      date: "Apr 11, 2025",
      soldTo: "Elias - +1 (619) 730-5162"
    }
  ];

  const totalSales = 7;
  const totalAmount = "160,027,140 ETB";
  const averageSale = "22,861,020 ETB";

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Sales Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
          <p className="text-2xl font-bold text-gray-800">{totalSales}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
          <p className="text-2xl font-bold text-gray-800">{totalAmount}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Average Sale</h3>
          <p className="text-2xl font-bold text-gray-800">{averageSale}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Management</h2>
        <p className="text-gray-600 mb-4">{totalSales} sales found</p>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="text" 
              placeholder="Search phone" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
            <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option>All Teams</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
            <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option>All Agents</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="flex space-x-2">
              <input 
                type="date" 
                placeholder="Start date" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <input 
                type="date" 
                placeholder="End date" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Sales Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (ETB)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area (SQM)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold To</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.map((sale, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.agent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.site}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.area}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.soldTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegiseterSalesData;