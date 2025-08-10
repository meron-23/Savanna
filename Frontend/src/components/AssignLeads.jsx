import React, { useState, useEffect } from 'react';
import { FiUser, FiSend, FiX, FiSearch, FiRefreshCw } from 'react-icons/fi';

const AssignLeads = () => {
  // State management
  const [leads, setLeads] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('new');

  // Filter users locally
  const supervisors = allUsers.filter(user => user.role === 'Supervisor');
  const agents = allUsers.filter(user => user.role === 'SalesAgent');

  // Fetch data on component mount and when statusFilter changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch leads
        const leadsResponse = await fetch(`http://localhost:5000/api/allLeads`);
        if (!leadsResponse.ok) throw new Error('Failed to fetch leads');
        const leadsData = await leadsResponse.json();
        setLeads(leadsData.data || []);

        // Fetch all users
        const usersResponse = await fetch('http://localhost:5000/api/users');
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData = await usersResponse.json();
        setAllUsers(usersData.data || []);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [statusFilter]);

  // Filter leads based on search term
  const filteredLeads = leads.filter(lead =>
    (lead.name && lead.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (lead.phone && lead.phone.includes(searchTerm))
  );

  // Filter agents based on selected supervisor
  const filteredAgents = selectedSupervisor
    ? agents.filter(agent => String(agent.supervisor_id) === String(selectedSupervisor))
    : [];

  // Handle lead assignment
  const handleAssign = async () => {
    if (!selectedLead || (!selectedSupervisor && !selectedAgent)) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:5000/api/leads/${selectedLead.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'new',
          assigned_to: selectedAgent || selectedSupervisor
        })
      });

      if (!response.ok) throw new Error('Assignment failed');

      // Update local state
      setLeads(leads.filter(lead => lead.id !== selectedLead.id));
      setSelectedLead(null);
      setSelectedSupervisor('');
      setSelectedAgent('');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    setSearchTerm('');
    setSelectedLead(null);
    setSelectedSupervisor('');
    setSelectedAgent('');
    setIsLoading(true);
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
      <h1 className="text-2xl font-bold mb-6">Assign Leads</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads List Column */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-lg font-semibold">Available Leads</h2>
            
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
                <option value="followup">Follow-up</option>
                <option value="all">All Leads</option>
              </select>
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
            {filteredLeads.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lead.name || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.phone || 'N/A'}
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
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-[#F4A300] hover:text-[#e6b82a] flex items-center"
                        >
                          <FiSend className="inline mr-1" />
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
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
          
          {selectedLead ? (
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium mb-2">Selected Lead:</h3>
                <p><span className="font-semibold">Name:</span> {selectedLead.name || 'N/A'}</p>
                <p><span className="font-semibold">Phone:</span> {selectedLead.phone || 'N/A'}</p>
                <p><span className="font-semibold">Status:</span> 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                    selectedLead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    selectedLead.status === 'assigned' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedLead.status || 'unknown'}
                  </span>
                </p>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="mt-2 text-sm text-red-500 hover:text-red-700 flex items-center"
                >
                  <FiX className="inline mr-1" />
                  Clear selection
                </button>
              </div>

              {/* Supervisor Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Supervisor:</label>
                <select
                  value={selectedSupervisor}
                  onChange={(e) => {
                    setSelectedSupervisor(e.target.value);
                    setSelectedAgent('');
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Supervisor</option>
                  {supervisors.map(supervisor => (
                    <option key={supervisor.id} value={supervisor.id}>
                      {supervisor.name || 'Unnamed Supervisor'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Agent Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Or assign directly to Agent:</label>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={!selectedSupervisor}
                >
                  <option value="">Select Agent</option>
                  {filteredAgents.map(agent => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name || 'Unnamed Agent'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assign Button */}
              <button
                onClick={handleAssign}
                disabled={!selectedSupervisor && !selectedAgent}
                className={`w-full py-2 px-4 rounded-md text-white flex items-center justify-center ${
                  (!selectedSupervisor && !selectedAgent) || isLoading
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
                    Assign Lead
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
              <p>Select a lead to assign</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignLeads;