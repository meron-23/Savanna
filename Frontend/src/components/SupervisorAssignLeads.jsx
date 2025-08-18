import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUser, FiSend, FiX, FiSearch, FiRefreshCw } from 'react-icons/fi';

// IMPORTANT: Update API_BASE_URL and a hardcoded supervisor ID
// In a real application, these would come from your authentication context.
const API_BASE_URL = 'http://localhost:5000/api';
const CURRENT_SUPERVISOR_ID = "supervisor-123"; // Use the actual user ID from your backend
const CURRENT_SUPERVISOR_NAME = "Meron Muluye"; // Use the actual user name

const SupervisorLeads = () => {
  // State management
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('new');
  const [sourceFilter, setSourceFilter] = useState('');

  // Fetch data on component mount and refresh
  // const fetchData = async () => {
  //   try {
  //     setIsLoading(true);
  //     setError(null);
  //     const response = await axios.get(`${API_BASE_URL}/supervisors/${CURRENT_SUPERVISOR_ID}/agents`);
  //     const { leads: fetchedLeads, agents: fetchedAgents } = response.data;
      
  //     setLeads(fetchedLeads || []);
  //     setAgents(fetchedAgents || []);
      
  //   } catch (err) {
  //     console.error("Fetch error:", err);
  //     setError("Failed to fetch data. Please check the backend connection.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch leads
        const leadsResponse = await fetch(`http://localhost:5000/api/allLeads`);
        if (!leadsResponse.ok) throw new Error('Failed to fetch leads');
        const leadsData = await leadsResponse.json();
        console.log(leadsData);
        setLeads(leadsData.data || []);

        // Fetch all users
        const usersResponse = await fetch('http://localhost:5000/api/users');
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData = await usersResponse.json();
        
        // Handle different API response structures
        const users = usersData.data || usersData.users || [];
        const filteredUsers = users.filter((user) => {
          return user.role === 'Agent'
        })
        console.log("Filtered Users", filteredUsers);
        console.log("Fetched Users:", users);
        setAgents(filteredUsers);

        console.log("selectedAgent", selectedAgent)
        
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [statusFilter]);

  // Filter leads based on search term and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = (lead.name && lead.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.phone && lead.phone.includes(searchTerm));
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = !sourceFilter || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Handle lead selection
  const handleLeadSelect = (lead) => {
    setSelectedLeads(prev => {
      const isSelected = prev.some(l => l.id === lead.id);
      if (isSelected) {
        return prev.filter(l => l.id !== lead.id);
      } else {
        return [...prev, lead];
      }
    });
  };

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeads([...filteredLeads]);
    } else {
      setSelectedLeads([]);
    }
  };

  // Handle lead assignment
  const handleAssign = async () => {
    if (selectedLeads.length === 0 || !selectedAgent) {
      setError("Please select at least one lead and an agent.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // console.log("selected Agent: ", selectedAgent);

      const assignmentPromises = selectedLeads.map(lead => 
        fetch(`http://localhost:5000/api/leads/${lead.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'new',
            assigned_to: selectedAgent
          })
        })
      );

      const responses = await Promise.all(assignmentPromises);
      const allSuccessful = responses.every(response => response.status === 200);
      
      if (!allSuccessful) {
        throw new Error('Some assignments failed');
      }

      // Update local state
      const assignedLeadIds = selectedLeads.map(lead => lead.id);
      setLeads(leads.filter(lead => !assignedLeadIds.includes(lead.id)));
      setSelectedAgent('');
      setSelectedLeads([]);
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An unexpected error occurred during assignment.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    setSearchTerm('');
    setSourceFilter('');
    setSelectedLeads([]);
    setSelectedAgent('');
    fetchData();
  };

  // Check if all filtered leads are currently selected
  const allLeadsSelected = filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length;

  // Format source for display
  const formatSource = (source) => {
    if (!source) return 'Unknown';
    return source.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Loading state
  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <FiRefreshCw className="animate-spin text-4xl text-[#F4A300]" />
    </div>
  );

  // Error state
  if (error) return (
    <div className="p-4 text-center text-red-500">
      Error: {error}
      <button 
        onClick={handleRefresh}
        className="ml-4 px-4 py-2 bg-[#F4A300] text-white rounded"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Supervisor Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">Viewing leads for: <span className="font-semibold">{CURRENT_SUPERVISOR_NAME}</span></p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads List Column */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-lg font-semibold">Leads ({filteredLeads.length})</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="new">New Leads</option>
                <option value="assigned">Assigned Leads</option>
                <option value="followup">Follow-up</option>
                <option value="all">All Leads</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Sources</option>
                <option value="social_media">Social Media</option>
                <option value="cold_call">Cold Call</option>
                <option value="survey">Survey</option>
                <option value="referral">Referral</option>
                <option value="website">Website</option>
                <option value="event">Event</option>
              </select>
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
            {filteredLeads.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="w-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={allLeadsSelected}
                        onChange={handleSelectAll}
                        className="form-checkbox h-4 w-4 text-[#F4A300] rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map(lead => {
                    const isSelected = selectedLeads.some(l => l.id === lead.id);
                    return (
                      <tr 
                        key={lead.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                        onClick={() => handleLeadSelect(lead)}
                      >
                        <td className="w-10 px-4 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="form-checkbox h-4 w-4 text-[#F4A300] rounded pointer-events-none"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lead.name || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.phone || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            lead.source === 'social_media' ? 'bg-purple-100 text-purple-800' :
                            lead.source === 'cold_call' ? 'bg-blue-100 text-blue-800' :
                            lead.source === 'survey' ? 'bg-green-100 text-green-800' :
                            lead.source === 'referral' ? 'bg-yellow-100 text-yellow-800' :
                            lead.source === 'website' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {formatSource(lead.source)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'assigned' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {lead.status || 'unknown'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No leads available for assignment
                <button 
                  onClick={handleRefresh}
                  className="mt-2 flex items-center justify-center mx-auto text-[#F4A300]"
                >
                  <FiRefreshCw className="mr-1" />
                  Refresh
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Assignment Panel Column */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Assignment Details</h2>
            <button
              onClick={handleRefresh}
              className="text-[#F4A300] hover:text-[#e6b82a]"
            >
              <FiRefreshCw />
            </button>
          </div>
          
          {selectedLeads.length > 0 ? (
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium mb-2">Selected Leads ({selectedLeads.length}):</h3>
                <div className="max-h-40 overflow-y-auto">
                  {selectedLeads.map(lead => (
                    <div key={lead.id} className="flex justify-between items-center py-1 border-b border-gray-100">
                      <div>
                        <p className="font-medium truncate">{lead.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{formatSource(lead.source)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeadSelect(lead);
                        }}
                        className="text-red-400 hover:text-red-600"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to Agent:
                </label>
                {agents.length > 0 ? (
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Agent</option>
                    {agents.map(agent => (
                      <option key={agent.userId} value={agent.userId}>
                        {agent.name || 'Unnamed Agent'}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm text-yellow-600 p-2 bg-yellow-50 rounded">
                    No agents available for this supervisor
                  </div>
                )}
              </div>

              {/* Assign Button */}
              <button
                onClick={handleAssign}
                disabled={!selectedAgent || isLoading}
                className={`w-full py-2 px-4 rounded-md text-white flex items-center justify-center ${
                  !selectedAgent || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#F4A300] hover:bg-[#e6b82a]'
                }`}
              >
                {isLoading ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2" />
                    Assign {selectedLeads.length} Lead{selectedLeads.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>

              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiUser className="mx-auto text-4xl text-gray-300 mb-2" />
              <p>Select one or more leads to assign</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisorLeads;