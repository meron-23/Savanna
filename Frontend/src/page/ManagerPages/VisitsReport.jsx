import React, { useState, useEffect } from 'react';

// Main VisitReport component
const VisitsReport = () => {
  // State for visits data, loading status, and error messages
  const [visitsData, setVisitsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for dynamically populated dropdown options
  const [availableAgents, setAvailableAgents] = useState(['All Agents']);
  const [availableSites, setAvailableSites] = useState(['All Sites']);

  // Filter states
  const [clientPhoneFilter, setClientPhoneFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState(''); // Assuming 'team' field might exist in future API data
  const [agentFilter, setAgentFilter] = useState('All Agents');
  const [siteFilter, setSiteFilter] = useState('All Sites');
  const [visitTypeFilter, setVisitTypeFilter] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page

  const handlePageChange = (pageNumber) => {
    // Ensure the page number is within valid bounds
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // useEffect hook to fetch data from the API
  useEffect(() => {
    const fetchVisits = async () => {
      setIsLoading(true); // Set loading to true before fetching
      setError(null);     // Clear any previous errors
      try {
        // Updated API endpoint
        const response = await fetch('http://localhost:3000/api/visits-with-prospects-and-agents');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        // Assuming the API returns an array of visit objects directly or under a 'data' key
        const visits = responseData.data || responseData;

        if (!Array.isArray(visits)) {
          throw new Error('API response data is not an array.');
        }

        // Map API response data to match component's expected structure
        const mappedVisits = visits.map(item => ({
          id: item.VisitID,
          clientName: item.prospect_name,
          phoneNumber: item.phoneNumber,
          // Combine VisitDate and VisitTime for consistent date object creation
          visitDate: item.VisitDate.split('T')[0], // Extract only date part
          visitTime: new Date(item.VisitDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          salesAgent: item.agent_name || 'Unassigned', // Use agent_name, fallback to 'Unassigned'
          clientFeedback: item.VisitDetails,
          siteVisit: item.SiteVisit === 1 ? 'Yes' : 'No', // Convert 0/1 to Yes/No
          officeVisit: item.OfficeVisit === 1 ? 'Yes' : 'No', // Convert 0/1 to Yes/No
          site: item.site,
          remark: item.remark || 'N/A', // Assuming remark might be present or needs a default
          // Include other fields if needed for export
          prospect_id: item.prospect_id,
          interest: item.interest,
          method: item.method,
          agent_id: item.agent_id,
          agent_email: item.agent_email,
          agent_role: item.agent_role,
        }));

        // Sort visits by date (and time if available) in descending order
        const sortedVisits = mappedVisits.sort((a, b) => {
          const dateA = new Date(`${a.visitDate} ${a.visitTime}`);
          const dateB = new Date(`${b.visitDate} ${b.visitTime}`);
          return dateB - dateA; // Sort descending
        });

        setVisitsData(sortedVisits);
      } catch (error) {
        console.error("Failed to fetch visits:", error);
        setError(`Failed to load visits: ${error.message}. Please try again later.`);
      } finally {
        setIsLoading(false); // Set loading to false after fetch attempt
      }
    };

    fetchVisits();
  }, []); // Empty dependency array means this runs once on component mount

  // useEffect to populate dropdown options once visitsData is available
  useEffect(() => {
    if (visitsData.length > 0) {
      const uniqueAgents = [...new Set(visitsData.map(visit => visit.salesAgent))].sort();
      setAvailableAgents(['All Agents', ...uniqueAgents]);

      const uniqueSites = [...new Set(visitsData.map(visit => visit.site))].sort();
      setAvailableSites(['All Sites', ...uniqueSites]);
    }
  }, [visitsData]); // Rerun when visitsData changes

  // Filtered visits based on all applied filters
  const filteredVisits = visitsData.filter(visit => {
    const matchesClientPhone = clientPhoneFilter === '' || visit.phoneNumber.includes(clientPhoneFilter);
    const matchesTeam = teamFilter === '' || visit.team === teamFilter; // Assuming 'team' field exists in data
    const matchesAgent = agentFilter === 'All Agents' || visit.salesAgent.toLowerCase().includes(agentFilter.toLowerCase());
    const matchesSite = siteFilter === 'All Sites' || visit.site.toLowerCase().includes(siteFilter.toLowerCase());
    const matchesVisitType = visitTypeFilter === '' ||
                             (visit.siteVisit === 'Yes' && visitTypeFilter === 'Site Visit') ||
                             (visit.officeVisit === 'Yes' && visitTypeFilter === 'Office Visit');

    // Date range filtering
    // Construct a full Date object from visitDate and visitTime for accurate comparison
    const visitDateTime = new Date(`${visit.visitDate} ${visit.visitTime}`);
    const startDateObj = dateRangeStart ? new Date(dateRangeStart) : null;
    const endDateObj = dateRangeEnd ? new Date(dateRangeEnd) : null;

    const matchesDateRange = (!startDateObj || visitDateTime >= startDateObj) &&
                             (!endDateObj || visitDateTime <= endDateObj);

    return matchesClientPhone && matchesTeam && matchesAgent && matchesSite && matchesVisitType && matchesDateRange;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVisits = filteredVisits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const clearFilters = () => {
    setClientPhoneFilter('');
    setTeamFilter('');
    setAgentFilter('All Agents'); // Reset to 'All Agents'
    setSiteFilter('All Sites');   // Reset to 'All Sites'
    setVisitTypeFilter('');
    setDateRangeStart('');
    setDateRangeEnd('');
    setCurrentPage(1); // Reset to first page after clearing filters
  };

  // Calculate summary card values
  const totalVisitsCount = visitsData.length;
  const officeVisitsCount = visitsData.filter(visit => visit.officeVisit === 'Yes').length;
  const siteVisitsCount = visitsData.filter(visit => visit.siteVisit === 'Yes').length;

  // Helper to format dates for display and export
  const formatDateTimeForExport = (datePart, timePart) => {
    if (!datePart) return '';
    const date = new Date(`${datePart} ${timePart}`);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleString('en-US', options);
  };

  // Function to handle Export
  const handleExport = () => {
    if (filteredVisits.length === 0) {
      alert("No data to export."); // Using alert for simplicity, replace with custom modal if preferred
      return;
    }

    // Define CSV headers
    const headers = [
      "Visit ID", "Client Name", "Phone Number", "Visit Date & Time", "Sales Agent",
      "Client Feedback", "Site Visit", "Office Visit", "Site", "Remark",
      "Prospect ID", "Interest", "Method", "Agent ID", "Agent Email", "Agent Role"
    ];

    // Map data to CSV rows
    const csvRows = filteredVisits.map(visit => [
      visit.id,
      visit.clientName,
      visit.phoneNumber,
      formatDateTimeForExport(visit.visitDate, visit.visitTime),
      visit.salesAgent,
      visit.clientFeedback,
      visit.siteVisit,
      visit.officeVisit,
      visit.site,
      visit.remark,
      visit.prospect_id,
      visit.interest,
      visit.method,
      visit.agent_id,
      visit.agent_email,
      visit.agent_role
    ].map(field => `"${String(field || '').replace(/"/g, '""')}"`).join(',')); // Enclose fields in quotes and escape internal quotes

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Create a Blob and download it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { // Feature detection for download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'visits_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL object
    } else {
      alert("Your browser does not support downloading files directly. Please copy the data manually.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-inter">
      {/* Load Font Awesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      {/* Load Tailwind CSS */}
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>

      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Visits Report</h1>

        {/* Loading and Error Indicators */}
        {isLoading && (
          <div className="text-center py-4 text-gray-700">Loading visits data...</div>
        )}
        {error && (
          <div className="text-center py-4 text-red-600 font-medium">{error}</div>
        )}

        {/* Only render content if not loading and no error */}
        {!isLoading && !error && (
          <>
            {/* Header/Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Visits Card */}
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="bg-blue-100 text-[#F4C430] rounded-full p-3 mr-4">
                  <i className="fas fa-chart-line text-2xl"></i>
                </div>
                <div>
                  <p className="text-gray-500">Total Visits</p>
                  <p className="text-2xl font-bold text-gray-900">{totalVisitsCount}</p>
                </div>
              </div>
              {/* Office Visits Card */}
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="bg-green-100 text-[#F4C430] rounded-full p-3 mr-4">
                  <i className="fas fa-building text-2xl"></i>
                </div>
                <div>
                  <p className="text-gray-500">Office Visits</p>
                  <p className="text-2xl font-bold text-gray-900">{officeVisitsCount}</p>
                </div>
              </div>
              {/* Site Visits Card */}
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="bg-purple-100 text-[#F4C430] rounded-full p-3 mr-4">
                  <i className="fas fa-map-marker-alt text-2xl"></i>
                </div>
                <div>
                  <p className="text-gray-500">Site Visits</p>
                  <p className="text-2xl font-bold text-gray-900">{siteVisitsCount}</p>
                </div>
              </div>
            </div>

            {/* Visits Management Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Visits Management</h2>
                <p className="text-gray-600 text-sm mt-2 sm:mt-0">{filteredVisits.length} visits found</p>
              </div>

              {/* Filters Section */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
                  <h3 className="text-lg font-semibold text-gray-700">Filters</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleExport} // Added onClick handler for Export
                      className="bg-[#F4A300] text-white px-4 py-2 rounded-lg hover:bg-[#333333] flex items-center"
                    >
                      <i className="fas fa-file-export mr-2"></i> Export
                    </button>
                    <button onClick={clearFilters} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center">
                      <i className="fas fa-times-circle mr-2"></i> Clear Filters
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Client Phone Filter */}
                  <div>
                    <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">Client Phone</label>
                    <input
                      type="text"
                      id="clientPhone"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Search by phone"
                      value={clientPhoneFilter}
                      onChange={(e) => setClientPhoneFilter(e.target.value)}
                    />
                  </div>
                  {/* Team Filter (still mock, as no team data in API snippet) */}
                  {/* <div>
                    <label htmlFor="team" className="block text-sm font-medium text-gray-700">Team</label>
                    <select
                      id="team"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      value={teamFilter}
                      onChange={(e) => setTeamFilter(e.target.value)}
                    >
                      <option value="">All Teams</option>
                    </select>
                  </div> */}
                  {/* Agent Filter - Dynamically populated */}
                  <div>
                    <label htmlFor="agent" className="block text-sm font-medium text-gray-700">Agent</label>
                    <select
                      id="agent"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      value={agentFilter}
                      onChange={(e) => setAgentFilter(e.target.value)}
                    >
                      {availableAgents.map((agent, index) => (
                        <option key={index} value={agent}>{agent}</option>
                      ))}
                    </select>
                  </div>
                  {/* Site Filter - Dynamically populated */}
                  <div>
                    <label htmlFor="site" className="block text-sm font-medium text-gray-700">Site</label>
                    <select
                      id="site"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      value={siteFilter}
                      onChange={(e) => setSiteFilter(e.target.value)}
                    >
                      {availableSites.map((site, index) => (
                        <option key={index} value={site}>{site}</option>
                      ))}
                    </select>
                  </div>
                  {/* Visit Type Filter */}
                  <div>
                    <label htmlFor="visitType" className="block text-sm font-medium text-gray-700">Visit Type</label>
                    <select
                      id="visitType"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      value={visitTypeFilter}
                      onChange={(e) => setVisitTypeFilter(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="Site Visit">Site Visit</option>
                      <option value="Office Visit">Office Visit</option>
                    </select>
                  </div>
                  {/* Date Range Filter */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-2"> {/* Adjusted col-span for better layout with 6 filters */}
                    <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">Date Range</label>
                    <div className="flex mt-1 space-x-2"> {/* Added space-x-2 for consistent spacing */}
                      <input
                        type="date"
                        className="block w-1/2 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        value={dateRangeStart}
                        onChange={(e) => setDateRangeStart(e.target.value)}
                      />
                      <span className="flex items-center text-gray-500">-</span>
                      <input
                        type="date"
                        className="block w-1/2 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        value={dateRangeEnd}
                        onChange={(e) => setDateRangeEnd(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Visits Table */}
              <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Client Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Phone Number</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Visit Date & Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Sales Agent</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Client Feedback</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Site Visit</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Office Visit</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Site</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Remark</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentVisits.length > 0 ? (
                      currentVisits.map((visit) => (
                        <tr key={visit.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{visit.clientName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.phoneNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.visitDate} <br/> {visit.visitTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.salesAgent}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{visit.clientFeedback}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${visit.siteVisit === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {visit.siteVisit}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${visit.officeVisit === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {visit.officeVisit}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.site}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{visit.remark}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="px-6 py-4 text-center text-gray-500">No matching visits found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
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

export default VisitsReport;
