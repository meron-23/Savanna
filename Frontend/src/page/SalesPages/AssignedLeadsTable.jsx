import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Phone } from 'lucide-react'; // Import the Phone icon from lucide-react

const AssignedLeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('name');
    const userRole = localStorage.getItem('role');

    // Set current user state if data is available
    if (userId && userName && userRole) {
      setCurrentUser({
        userId,
        name: userName,
        role: userRole,
      });
    } else {
      // If user data is missing, set an error and stop loading
      setError('User data not found. Please log in.');
      setLoading(false);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // Function to fetch leads from the API
    const fetchLeads = async () => {
      // Do not fetch if currentUser is not set yet
      if (!currentUser) return;

      setLoading(true); // Start loading
      setError(null);   // Clear any previous errors

      try {
        // Make an API call to fetch full lead details
        const response = await axios.get('http://localhost:5000/api/full-details');

        // Validate API response structure
        if (!response.data || !Array.isArray(response.data.data)) {
          throw new Error('API response data is not in the expected format.');
        }

        // Filter leads to show only those assigned to the current user
        const userLeads = response.data.data.filter(
          (lead) => lead.agent_id === currentUser.userId
        );

        console.log(userLeads)
        console.log(response.data.data)
        console.log(currentUser.userId)

        setLeads(userLeads); // Update leads state
      } catch (err) {
        // Log and set error if fetching fails
        console.error('Failed to fetch leads:', err);
        setError(err.response?.data?.message || 'Failed to load leads. Please try again later.');
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    // Fetch leads only when currentUser is available
    if (currentUser) {
      fetchLeads();
    }
  }, [currentUser]); // Re-run effect when currentUser changes

  // Function to handle making a phone call
  const handleCallLead = async (phoneNumber, leadId) => {
    // ... (keep the existing showMessageBox code)

    if (!phoneNumber) {
      showMessageBox('No phone number available for this lead');
      return;
    }

    try {
      // Update lead status to 'contacted'
      await axios.patch(`http://localhost:5000/api/leads/${leadId}/status`, {
        status: 'contacted',
        assigned_to: currentUser.userId
      });

      // Update the local state to reflect the status change
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.lead_id === leadId 
            ? { ...lead, status: 'contacted' } 
            : lead
        )
      );

      // Initiate phone call
      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
      const telLink = `tel:${cleanedPhoneNumber}`;
      window.location.href = telLink;

      // For desktop browsers
      if (!/Mobi|Android/i.test(navigator.userAgent)) {
        showMessageBox(`Call ${phoneNumber} from your phone`);
      }
    } catch (err) {
      console.error('Failed to update lead status:', err);
      showMessageBox('Failed to update lead status. Please try again.');
    }
  };

  // Helper function to get status badge color
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

  // Loading state UI
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full flex justify-center items-center h-48">
        <p className="text-blue-700 text-lg">Loading your leads...</p>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full flex justify-center items-center h-48">
        <p className="text-red-500 text-lg font-medium">Error: {error}</p>
      </div>
    );
  }

  // No leads found UI
  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full flex justify-center items-center h-48">
        <p className="text-gray-600 text-lg text-center">
          No leads are currently assigned to you. Check back later!
        </p>
      </div>
    );
  }

  // Main table UI
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
              {/* New Action header */}
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr
                key={lead.lead_id}
                className="hover:bg-gray-50" // Removed cursor-pointer and onClick from tr
              >
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
                {/* New Action column with Call button */}
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 sm:px-4">
                  <button
                    onClick={() => handleCallLead(lead.phone, lead.lead_id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedLeadsTable;
