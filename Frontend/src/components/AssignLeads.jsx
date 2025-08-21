import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Import axios for network requests
import { FiUser, FiSend, FiX, FiSearch, FiRefreshCw, FiPlus, FiUpload } from 'react-icons/fi';

// IMPORTANT: Update API_BASE_URL and any hardcoded IDs in a real application.
const API_BASE_URL = 'http://localhost:5000/api';
// CURRENT_MANAGER_ID would typically come from authentication context (e.g., localStorage after login)
const CURRENT_MANAGER_ID = localStorage.getItem('userId') || "manager-default"; 
const CURRENT_MANAGER_NAME = "Manager Name"; // Placeholder, replace with actual manager name

const AssignLeads = () => {
    // State management
    const [leads, setLeads] = useState([]);
    const [allUsers, setAllUsers] = useState([]); // Stores all users (Supervisors and SalesAgents)
    const [supervisors, setSupervisors] = useState([]); // Filtered list of supervisors
    const [agents, setAgents] = useState([]); // Filtered list of agents
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
    const [selectedAgent, setSelectedAgent] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // State for success messages
    const [statusFilter, setStatusFilter] = useState('all');
    // sourceFilter state is kept for the parsing logic if 'source' column exists in CSV,
    // but its UI dropdown is removed as per your request.
    const [sourceFilter, setSourceFilter] = useState(''); 
    
    // Add Lead Modal State
    const [showAddLeadModal, setShowAddLeadModal] = useState(false);
    const [newLead, setNewLead] = useState({
        name: '',
        phone: '',
        interest: '',
        status: 'new',
        user_id: '' // This might be assigned_to in your backend, clarify if needed
    });

    // Ref for hidden file input for Excel import
    const fileInputRef = useRef(null);

    // Common data fetching function
    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null); // Clear previous errors
            setSuccessMessage(null); // Clear previous success messages

            // Fetch leads
            const leadsResponse = await axios.get(`${API_BASE_URL}/allLeads`);
            setLeads(leadsResponse.data.data || []);

            // Fetch all users
            const usersResponse = await axios.get(`${API_BASE_URL}/users`);
            const users = usersResponse.data.data || usersResponse.data.users || [];
            setAllUsers(users); // Store all users
            
            // Filter supervisors and agents from all users
            setSupervisors(users.filter(user => user.role === 'Supervisor'));
            setAgents(users.filter(user => user.role === 'SalesAgent' || user.role === 'Agent')); // Assuming 'Agent' for sales agents
            
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    // Filter agents based on selected supervisor ID (for nested assignment)
    const filteredAgentsBySupervisor = selectedSupervisorId
        ? agents.filter(agent => agent.supervisor === selectedSupervisorId) // No String() conversion
        : [];

    // Handle form input changes for Add Lead modal
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLead(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission for adding a new lead
    const handleAddLead = async (e) => {
      e.preventDefault();
      try {
          setIsLoading(true);
          setError(null);
          setSuccessMessage(null);

          const now = new Date();
          const mysqlDatetime = now.toISOString().slice(0, 19).replace('T', ' ');
          
          const response = await fetch(`${API_BASE_URL}/leads`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  ...newLead,
                  date_added: mysqlDatetime,
                  user_id: null 
              })
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to add lead');
          }
          
          const result = await response.json();
          
          // OPTIMIZATION: Both add to local state AND refresh from server
          // This gives instant UI update while ensuring data consistency
          setLeads(prev => [result.data, ...prev]);
          await fetchData(); // Refresh from server to ensure complete consistency
          
          // Reset form and hide modal
          setNewLead({
              name: '',
              phone: '',
              interest: '',
              status: 'new',
              user_id: ''
          });
          setShowAddLeadModal(false);
          setSuccessMessage('Lead added successfully!');
          setTimeout(() => setSuccessMessage(null), 3000); 
          
      } catch (error) {
          console.error("Add Lead error:", error);
          setError(error.message);
      } finally {
          setIsLoading(false);
      }
  };
    // --- Handle Excel/CSV Import ---
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = [
            'text/csv', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel' // .xls
        ];
        if (!allowedTypes.includes(file.type)) {
            setError('Unsupported file type. Please upload a .xlsx, .xls, or .csv file.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            try {
                // IMPORTANT: This parseCsv function is very basic and only handles CSV.
                // For .xlsx and .xls, you would need a more robust library like 'xlsx'
                // and more complex parsing logic here.
                const parsedLeads = parseCsv(text); 
                if (parsedLeads.length === 0) {
                    throw new Error('No valid leads found in the file. Ensure correct headers (name, phone, interest, source).');
                }

                // Send parsed data to a new bulk upload API endpoint
                const response = await axios.post(`${API_BASE_URL}/leads/bulk`, { leads: parsedLeads });

                if (response.status === 200) {
                    setSuccessMessage(`${response.data.count} leads imported successfully!`);
                    setTimeout(() => setSuccessMessage(null), 3000);
                    fetchData(); // Refresh leads to show new additions
                } else {
                    throw new Error(response.data.message || 'Failed to import leads.');
                }
            } catch (err) {
                console.error('Error importing leads:', err);
                setError(err.message || 'An error occurred during import.');
            } finally {
                setIsLoading(false);
            }
        };
        reader.readAsText(file); // Reads as text, assuming CSV
    };

    // Simple CSV parser (expects headers: name, phone, interest, source)
    const parseCsv = (csvText) => {
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return [];

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length !== headers.length) {
                console.warn(`Skipping row ${i + 1} due to inconsistent column count.`);
                continue;
            }
            const lead = {};
            for (let j = 0; j < headers.length; j++) {
                let value = values[j] ? values[j].trim() : '';
                if (headers[j] === 'status' && !value) {
                    value = 'new'; 
                }
                if (headers[j] === 'phone' && value && !value.startsWith('2519')) {
                    value = `2519${value.substring(value.length - 8)}`; 
                }
                lead[headers[j]] = value;
            }
            if (lead.name && lead.phone && lead.interest) {
                if (!lead.status) lead.status = 'new';
                // For leads imported by manager, assigned_to could be null initially
                // or assigned to CURRENT_MANAGER_ID for later distribution.
                if (!lead.assigned_to) lead.assigned_to = null; 
                data.push(lead);
            } else {
                console.warn(`Skipping row ${i + 1} due to missing required fields (name, phone, interest).`);
            }
        }
        return data;
    };

    // Function to trigger the hidden file input click
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Filter leads based on search term and filters
    const filteredLeads = leads.filter(lead => {
        const matchesSearch = (lead.name && lead.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                              (lead.phone && lead.phone.includes(searchTerm));
        
        let matchesStatus = false;
        if (statusFilter === 'all') {
            matchesStatus = true;
        } else if (statusFilter === 'assigned') {
            // A lead is "assigned" if its status is 'assigned' AND it has an assigned_to ID
            matchesStatus = lead.status === 'assigned';
        } else if (statusFilter === 'new') {
            // "New" leads are those with status 'new' and not assigned to anyone
            matchesStatus = lead.status === 'new';
        } else if (statusFilter === 'contacted') {
            // For other specific statuses like 'contacted'
            matchesStatus = lead.status === 'contacted';
        }

        // sourceFilter is not used in UI but kept for potential future use or backend consistency
        const matchesSource = !sourceFilter || (lead.source && lead.source === sourceFilter);
        
        // For a manager, leads to display would include unassigned leads,
        // and leads assigned to any supervisor or agent.
        // If a lead has assigned_to, check if that ID exists in allUsers.
        const isManagedByManager = 
            !lead.assigned_to || // Unassigned leads
            allUsers.some(user => user.userId === lead.assigned_to); // Assigned to any user (supervisor or agent)

        return matchesSearch && matchesStatus && matchesSource && isManagedByManager;
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

    // Handle select all filtered leads
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedLeads([...filteredLeads]);
        } else {
            setSelectedLeads([]);
        }
    };

    // Handle lead assignment
    const handleAssign = async () => {
        // Validation: Must select leads AND either a supervisor or an agent
        if (selectedLeads.length === 0 || (!selectedSupervisorId && !selectedAgent)) {
            setError("Please select at least one lead and either a supervisor or an agent for assignment.");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            setSuccessMessage(null);

            const assignmentPromises = selectedLeads.map(lead => 
                axios.patch(`${API_BASE_URL}/leads/${lead.id}/status`, {
                    status: 'assigned', // Status is explicitly set to 'assigned'
                    assigned_to: selectedAgent || selectedSupervisorId // Assign to agent if selected, else supervisor
                })
            );

            const responses = await Promise.all(assignmentPromises);
            const allSuccessful = responses.every(response => response.status === 200);
            
            if (!allSuccessful) {
                throw new Error('Some assignments failed');
            }

            // Immediately remove assigned leads from the current `leads` state.
            // This ensures they disappear from "New Leads" view instantly.
            setLeads(prevLeads => prevLeads.filter(lead => !selectedLeads.some(sLead => sLead.id === lead.id)));
            setSelectedLeads([]); // Clear selection
            setSelectedSupervisorId(''); // Clear supervisor selection
            setSelectedAgent(''); // Clear agent selection
            
            // Re-fetch all leads to get the latest statuses from the backend.
            // This is crucial to ensure that when the "Assigned Leads" filter is selected,
            // the newly assigned leads appear correctly.
            await fetchData(); 

            // Constructing a more informative success message
            const assignedToName = 
                (selectedAgent && allUsers.find(u => u.userId === selectedAgent)?.name) || 
                (selectedSupervisorId && allUsers.find(u => u.userId === selectedSupervisorId)?.name) || 
                'unknown';
            setSuccessMessage(`Successfully assigned ${selectedLeads.length} lead(s) to ${assignedToName}! Check 'Assigned Leads' to view.`);
            setTimeout(() => setSuccessMessage(null), 5000); // Clear message after 5 seconds

        } catch (err) {
            console.error("Assignment error:", err);
            setError(err.response?.data?.message || err.message || 'An unexpected error occurred during assignment.');
        } finally {
            setIsLoading(false);
        }
    };

    // Refresh data function
    const handleRefresh = () => {
        setSearchTerm('');
        setSourceFilter(''); 
        setSelectedLeads([]);
        setSelectedSupervisorId('');
        setSelectedAgent('');
        setError(null); 
        setSuccessMessage(null); 
        fetchData(); 
    };

    // Check if all filtered leads are currently selected
    const allLeadsSelected = filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length;

    // Format source for display
    const formatSource = (source) => {
        if (!source) return 'Unknown';
        return source
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Loading state UI
    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <FiRefreshCw className="animate-spin text-4xl text-[#F4A300]" />
        </div>
    );

    // Error state UI
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Assign Leads</h1>
                <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-2 space-y-2 sm:space-y-0 items-center">
                    {/* Add Lead Button */}
                    <button
                        onClick={() => setShowAddLeadModal(true)}
                        className="flex items-center px-4 py-2 bg-[#F4A300] text-white rounded-md hover:bg-[#e6b82a] transition-colors"
                    >
                        <FiPlus className="mr-2" />
                        Add Lead
                    </button>
                    {/* Import from Spreadsheet Button */}
                    <div className="flex flex-col items-center mt-5">
                        <button
                            onClick={triggerFileInput}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            <FiUpload className="mr-2" />
                            Import from Spreadsheet
                        </button>
                        <span className="text-xs text-gray-500 mt-1">Supported formats: .xlsx, .xls, .csv</span>
                    </div>
                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        // Accept all three file types
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            {/* Add Lead Modal */}
            {showAddLeadModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Add New Lead</h2>
                            <button
                                onClick={() => setShowAddLeadModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FiX className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddLead}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newLead.name}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={newLead.phone}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Interest</label>
                                    <input
                                        type="text"
                                        name="interest"
                                        value={newLead.interest}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={newLead.status}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="new">New</option>
                                        {/* <option value="contacted">Contacted</option>
                                        <option value="interested">Interested</option>
                                        <option value="assigned">Assigned</option>  */}
                                        {/* <option value="followup">Follow-up</option> */}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddLeadModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#F4A300] text-white rounded-md hover:bg-[#e6b82a]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Adding...' : 'Add Lead'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                                <option value="assigned">Assigned Leads</option> {/* Added Assigned Leads option */}
                                <option value="contacted">Contacted</option>
                                {/* <option value="followup">Follow-up</option> */}
                                <option value="all">All Leads</option>
                            </select>
                        </div>
                    </div>

                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline ml-2">{successMessage}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setSuccessMessage(null)}>
                                <FiX className="h-4 w-4 text-green-700"/>
                            </span>
                        </div>
                    )}

                    <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
                        {filteredLeads.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="w-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {filteredLeads.some(lead => lead.status !== 'contacted') && (
                                              <input
                                                  type="checkbox"
                                                  checked={allLeadsSelected}
                                                  onChange={handleSelectAll}
                                                  className="form-checkbox h-4 w-4 text-[#F4A300] rounded"
                                              />
                                            )}
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th> 
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredLeads.map(lead => {
                                        const isSelected = selectedLeads.some(l => l.id === lead.id);
                                        const isContacted = lead.status === 'contacted';
                                        // Find the assigned user (supervisor or agent) name if assigned
                                        const assignedUser = lead.assigned_to ? allUsers.find(user => user.userId === lead.assigned_to) : null;

                                        return (
                                            <tr 
                                                key={lead.id} 
                                                className={`hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                                                onClick={() => handleLeadSelect(lead)}
                                            >
                                                <td className="w-10 px-4 py-4 whitespace-nowrap">
                                                  {!isContacted && (
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        readOnly
                                                        className="form-checkbox h-4 w-4 text-[#F4A300] rounded pointer-events-none"
                                                    />
                                                  )}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {lead.name || 'N/A'}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {lead.phone || 'N/A'}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        lead.interest === 'social_media' ? 'bg-purple-100 text-purple-800' :
                                                        lead.interest === 'cold_call' ? 'bg-blue-100 text-blue-800' :
                                                        lead.interest === 'survey' ? 'bg-green-100 text-green-800' :
                                                        lead.interest === 'referral' ? 'bg-yellow-100 text-yellow-800' :
                                                        lead.interest === 'website' ? 'bg-indigo-100 text-indigo-800' :
                                                        lead.interest === 'event' ? 'bg-pink-100 text-pink-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {formatSource(lead.interest)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                                        lead.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
                                                        lead.status === 'assigned' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {lead.status || 'unknown'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                  {lead.status === 'assigned' || lead.status === 'contacted'
                                                      ? (agents.find(agent => agent.userId === lead.user_name)?.name || lead.user_name)
                                                      : 'Unassigned'}
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

                    {/* Success Message Display */}
                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline ml-2">{successMessage}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setSuccessMessage(null)}>
                                <FiX className="h-4 w-4 text-green-700"/>
                            </span>
                        </div>
                    )}
                    
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

                            {/* Supervisor Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Assign to Supervisor:
                                </label>
                                <select
                                    value={selectedSupervisorId}
                                    onChange={(e) => {
                                        setSelectedSupervisorId(e.target.value);
                                        setSelectedAgent(''); // Clear agent selection when supervisor changes
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select Supervisor</option>
                                    {supervisors.map(supervisor => (
                                        <option key={supervisor.userId} value={supervisor.userId}>
                                            {supervisor.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Agent Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Or assign directly to Agent:
                                </label>
                                {selectedSupervisorId ? (
                                    filteredAgentsBySupervisor.length > 0 ? (
                                        <select
                                            value={selectedAgent}
                                            onChange={(e) => setSelectedAgent(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="">Select Agent</option>
                                            {filteredAgentsBySupervisor.map(agent => (
                                                <option key={agent.userId} value={agent.userId}>
                                                    {agent.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="text-sm text-yellow-600 p-2 bg-yellow-50 rounded">
                                            No agents available for selected supervisor
                                        </div>
                                    )
                                ) : (
                                    <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded">
                                        Please select a supervisor first
                                    </div>
                                )}
                            </div>

                            {/* Assign Button */}
                            <button
                                onClick={handleAssign}
                                // Disable if no leads selected or no assignment target chosen
                                disabled={selectedLeads.length === 0 || (!selectedSupervisorId && !selectedAgent) || isLoading}
                                className={`w-full py-2 px-4 rounded-md text-white flex items-center justify-center ${
                                    (selectedLeads.length === 0 || (!selectedSupervisorId && !selectedAgent) || isLoading)
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

export default AssignLeads;
