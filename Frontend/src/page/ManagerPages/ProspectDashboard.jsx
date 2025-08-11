import React, { useState, useEffect } from 'react';

const ProspectsDashboard = () => {
  // State for prospects data, loading status, and error messages
  const [prospects, setProspects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for dynamically populated dropdown options
  const [availableAgents, setAvailableAgents] = useState(['All Agents']);
  const [availableSites, setAvailableSites] = useState(['All Sites']);

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  // const [selectedTeam, setSelectedTeam] = useState('All Teams'); // Commented out as per user's current code
  const [selectedAgent, setSelectedAgent] = useState('All Agents');
  const [selectedSite, setSelectedSite] = useState('All Sites');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page for pagination

  // useEffect hook to fetch data from the API
  useEffect(() => {
    const fetchProspects = async () => {
      setIsLoading(true); // Set loading to true before fetching
      setError(null);     // Clear any previous errors
      try {
        // Updated API endpoint as per your latest information
        const response = await fetch('http://localhost:5000/api/prospects-with-agents');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        if (!responseData.success || !Array.isArray(responseData.data)) {
          throw new Error('API response data is not in expected format or success is false.');
        }

        // Map API response data to match component's expected structure
        const mappedProspects = responseData.data.map(item => ({
          id: item.prospect_id, // Use prospect_id for the prospect's unique ID
          name: item.prospect_name, // Use prospect_name for the prospect's name
          phone: item.phoneNumber, // Use phoneNumber for prospect's phone
          date: item.dateNow || item.date, // Prioritize dateNow, fallback to date
          // Corrected: Use item.agent_name for the agent field.
          // If agent_name is missing or null, default to 'Unassigned'.
          agent: item.agent_name || 'Unassigned',
          interest: item.interest,
          method: item.method,
          site: item.site,
          comment: item.comment,
          // Include other agent details if needed for display or other logic
          agent_id: item.agent_id,
          agent_email: item.agent_email,
          agent_phone: item.agent_phone,
          agent_gender: item.agent_gender,
          agent_role: item.agent_role,
          supervisor: item.supervisor,
          creationTime: item.creationTime,
          lastSignInTime: item.lastSignInTime,
        }));

        // Sort prospects by date in descending order (most recent first)
        const sortedProspects = mappedProspects.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        setProspects(sortedProspects);
      } catch (error) {
        console.error("Failed to fetch prospects:", error);
        setError(`Failed to load prospects: ${error.message}. Please try again later.`);
      } finally {
        setIsLoading(false); // Set loading to false after fetch attempt
      }
    };

    fetchProspects();
  }, []); // Empty dependency array means this runs once on component mount

  // useEffect to populate dropdown options once prospects data is available
  useEffect(() => {
    if (prospects.length > 0) {
      // Extract unique agent names where role is 'Sales Agent'
      const uniqueAgents = [...new Set(prospects
        .filter(p => p.agent_role === 'Sales Agent' && p.agent !== 'Unassigned') // Filter for actual sales agents and exclude 'Unassigned'
        .map(p => p.agent) // Map to their name (which is now correctly populated from agent_name)
      )].sort();
      setAvailableAgents(['All Agents', ...uniqueAgents]);

      const uniqueSites = [...new Set(prospects.map(p => p.site))].sort();
      setAvailableSites(['All Sites', ...uniqueSites]);
    }
  }, [prospects]); // Rerun when prospects data changes

  // Filtered prospects based on current filters
  const filteredProspects = prospects.filter(prospect => {
    const matchesSearchTerm = searchTerm === '' ||
      Object.values(prospect).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Note: 'team' field is not directly in the provided API snippet for prospect.
    // If your API provides team per prospect, ensure it's mapped in the first useEffect.
    // const matchesTeam = selectedTeam === 'All Teams' || prospect.team === selectedTeam; // Commented out as per user's current code
    const matchesAgent = selectedAgent === 'All Agents' || prospect.agent === selectedAgent;
    const matchesSite = selectedSite === 'All Sites' || prospect.site === selectedSite;

    const prospectDate = new Date(prospect.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesDateRange = (!start || prospectDate >= start) && (!end || prospectDate <= end);

    // return matchesSearchTerm && matchesTeam && matchesAgent && matchesSite && matchesDateRange; // Original line
    return matchesSearchTerm && matchesAgent && matchesSite && matchesDateRange; // Updated line
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProspects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProspects = filteredProspects.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    // setSelectedTeam('All Teams'); // Commented out as per user's current code
    setSelectedAgent('All Agents');
    setSelectedSite('All Sites');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Helper to format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  // Function to handle Export
  const handleExport = () => {
    if (filteredProspects.length === 0) {
      alert("No data to export."); // Using alert for simplicity, replace with custom modal if preferred
      return;
    }

    // Define CSV headers
    const headers = [
      "ID", "Name", "Phone", "Date", "Agent", "Interest", "Method", "Site", "Comment",
      "Agent ID", "Agent Email", "Agent Phone", "Agent Gender", "Agent Role", "Supervisor",
      "Creation Time", "Last Sign In Time"
    ];

    // Map data to CSV rows
    const csvRows = filteredProspects.map(p => [
      p.id, p.name, p.phone, formatDate(p.date), p.agent, p.interest, p.method, p.site, p.comment,
      p.agent_id, p.agent_email, p.agent_phone, p.agent_gender, p.agent_role, p.supervisor,
      formatDate(p.creationTime), formatDate(p.lastSignInTime)
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')); // Enclose fields in quotes and escape internal quotes

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Create a Blob and download it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { // Feature detection for download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'prospects_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL object
    } else {
      alert("Your browser does not support downloading files directly. Please copy the data manually.");
    }
  };

  // Function to handle Delete Duplicates
  const handleDeleteDuplicates = () => {
    if (prospects.length === 0) {
      alert("No prospects to check for duplicates.");
      return;
    }

    const uniqueProspects = [];
    const seenPhoneNumbers = new Set();
    let duplicatesRemovedCount = 0;

    prospects.forEach(prospect => {
      // Assuming phoneNumber is the key for identifying duplicates
      if (prospect.phone && !seenPhoneNumbers.has(prospect.phone)) {
        uniqueProspects.push(prospect);
        seenPhoneNumbers.add(prospect.phone);
      } else if (prospect.phone && seenPhoneNumbers.has(prospect.phone)) {
        duplicatesRemovedCount++;
      }
    });

    if (duplicatesRemovedCount > 0) {
      // For a real application, you'd likely send a request to your backend
      // to delete these duplicates from the database.
      // For now, we'll update the local state.
      setProspects(uniqueProspects);
      alert(`${duplicatesRemovedCount} duplicate(s) removed from the display. (Note: This only affects local display, not the backend.)`);
    } else {
      alert("No duplicates found based on phone number.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Prospects Dashboard</h1>
        </div>

        {/* Loading and Error Indicators */}
        {isLoading && (
          <div className="text-center py-4 text-gray-700">Loading prospects...</div>
        )}
        {error && (
          <div className="text-center py-4 text-red-600 font-medium">{error}</div>
        )}

        {/* Only render content if not loading and no error, or if data is available */}
        {!isLoading && !error && (
          <>
            {/* Summary Cards: Responsive grid that stacks on small screens */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Total Prospects</p>
                  <p className="text-2xl font-bold text-gray-900">{prospects.length}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.125A7.5 7.5 0 0112 21.75 7.5 7.5 0 019 19.125m3-12.75a4.5 4.5 0 110 9 4.5 4.5 0 010-9zM12 18v.75a.75.75 0 00.75.75H13.5a.75.75 0 00.75-.75V18m-9.75-2.25h-.75a.75.75 0 00-.75.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75M12 3.75v.75a.75.75 0 00.75.75H13.5a.75.75 0 00.75-.75V3.75m-9.75 1.5h-.75a.75.75 0 00-.75.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75" />
                </svg>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Unique Agents</p>
                  <p className="text-2xl font-bold text-gray-900">{availableAgents.length - 1}</p> {/* Subtracting 'All Agents' */}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-2xl font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Prospects Management Section */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-xl font-semibold text-gray-800">Prospects Management</h2>
                <span className="text-sm text-gray-600">{filteredProspects.length} prospects found</span>
              </div>

              {/* Filters Section: Responsive grid that stacks on small screens, adjusts columns on larger */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="phone-search" className="sr-only">Search by Phone Number</label>
                  <input
                    id="phone-search"
                    type="text"
                    placeholder="Search by Name, Phone No, or Agent"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* <div>
                  <label htmlFor="team-select" className="sr-only">Team</label>
                  <select
                    id="team-select"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                  >
                    
                    {['All Teams', 'Team A', 'Team B'].map((team, index) => (
                      <option key={index} value={team}>{team}</option>
                    ))}
                  </select>
                </div> */}
                <div>
                  <label htmlFor="agent-select" className="sr-only">Agent</label>
                  <select
                    id="agent-select"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                  >
                    {availableAgents.map((agent, index) => (
                      <option key={index} value={agent}>{agent}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="site-select" className="sr-only">Site</label>
                  <select
                    id="site-select"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={selectedSite}
                    onChange={(e) => setSelectedSite(e.target.value)}
                  >
                    {availableSites.map((site, index) => (
                      <option key={index} value={site}>{site}</option>
                    ))}
                  </select>
                </div>
                {/* Date Range Filters: Uses flex-wrap to stack on smaller screens, and min-w-0 for inputs */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-2"> {/* Adjusted col-span to 3 as 'Team' filter is commented out */}
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 whitespace-nowrap hidden sm:block">Date Range:</label>
                  <input
                    id="start-date"
                    type="date"
                    placeholder="Start date"
                    className="flex-1 min-w-0 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <span className="text-gray-500 hidden sm:block">-</span> {/* Separator for desktop */}
                  <input
                    type="date"
                    placeholder="End date"
                    className="flex-1 min-w-0 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons: Uses flex-wrap for responsiveness */}
              <div className="flex flex-wrap gap-2 justify-end mb-6">
                <button
                  onClick={handleExport} // Added onClick handler
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Export
                </button>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear Filters
                </button>
              </div>

              {/* Prospects Table: Uses overflow-x-auto for horizontal scrolling on small screens */}
              <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Agent</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Interest</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Method</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Site</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Comment</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentProspects.length > 0 ? (
                      currentProspects.map((prospect) => (
                        <tr key={prospect.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prospect.name}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{prospect.phone}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(prospect.date)}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {/* Display agent name directly, no 'Unassigned' check here as it's handled in mapping */}
                            {prospect.agent}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{prospect.interest}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{prospect.method}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{prospect.site}</td>
                          <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">{prospect.comment}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-4 py-4 text-center text-gray-500">No matching prospects found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === page ? 'bg-[#F4A300] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProspectsDashboard;
