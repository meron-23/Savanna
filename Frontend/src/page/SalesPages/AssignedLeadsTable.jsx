import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignedLeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Effect to get the current user's data from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('name');
    const userRole = localStorage.getItem('role');

    if (userId && userName && userRole) {
      setCurrentUser({
        userId,
        name: userName,
        role: userRole,
      });
    } else {
      setError('User data not found. Please log in.');
      setLoading(false);
    }
  }, []);

  // Effect to fetch leads from the API
  useEffect(() => {
    const fetchLeads = async () => {
      // Don't fetch if we don't have user data yet
      if (!currentUser) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('http://localhost:5000/api/full-details');

        if (!response.data || !Array.isArray(response.data.data)) {
          throw new Error('API response data is not in the expected format.');
        }

        // Filter the leads here, right after receiving the response
        const userLeads = response.data.data.filter(
          (lead) => lead.agent_id === currentUser.userId
        );

        setLeads(userLeads);
      } catch (err) {
        console.error('Failed to fetch leads:', err);
        setError(err.response?.data?.message || 'Failed to load leads. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchLeads();
    }
  }, [currentUser]); // This effect now depends on `currentUser`

  // --- Rendering Logic ---

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full flex justify-center items-center h-48">
        <p className="text-blue-700 text-lg">Loading your leads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full flex justify-center items-center h-48">
        <p className="text-red-500 text-lg font-medium">Error: {error}</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full flex justify-center items-center h-48">
        <p className="text-gray-600 text-lg text-center">
          No leads are currently assigned to you. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#333333]">Your Assigned Leads</h2>
          {currentUser && (
            <p className="text-sm text-gray-500">Logged in as: {currentUser.name} ({currentUser.role})</p>
          )}
        </div>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
          {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">Lead</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">Phone</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4">Prospect Source</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4">Status</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">Date Added</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.lead_id} className="hover:bg-gray-50">
                <td className="px-3 py-3 whitespace-nowrap sm:px-4">
                  <div className="font-medium text-gray-900">{lead.lead_name}</div>
                  <div className="text-xs text-gray-500 line-clamp-1">{lead.lead_interest}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 sm:px-4">
                  {lead.phone}
                </td>
                <td className="px-3 py-3 text-sm text-gray-500 sm:px-4">
                  <div className="font-medium">{lead.prospect_name || lead.lead_name}</div>
                  <div className="text-xs text-gray-400">{lead.method} • {lead.site}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap sm:px-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 sm:px-4">
                  {new Date(lead.date_added).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper function for status colors
const getStatusColor = (status) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'new': return 'bg-blue-100 text-blue-800';
    case 'contacted': return 'bg-purple-100 text-purple-800';
    case 'interested': return 'bg-yellow-100 text-yellow-800';
    case 'qualified': return 'bg-green-100 text-green-800';
    case 'converted': return 'bg-indigo-100 text-indigo-800';
    case 'closed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default AssignedLeadsTable;