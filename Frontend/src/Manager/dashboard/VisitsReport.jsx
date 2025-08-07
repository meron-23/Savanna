import React, { useState } from 'react';

// Main VisitReport component
const VisitReport = () => {
  // Sample data for visits
  const [visitsData, setVisitsData] = useState([
    { id: 1, clientName: 'Wro Helina', phoneNumber: '0910869504', visitDate: 'Aug 6, 2025', visitTime: '3:00 AM', salesAgent: 'Amanuel Tsegaya', clientFeedback: 'Interested in 3 bedroom and need a bank', siteVisit: 'Yes', officeVisit: 'No', site: 'Other', remark: 'Follow up for closing' },
    { id: 2, clientName: 'Wro meseret', phoneNumber: '+251910869504', visitDate: 'Aug 6, 2025', visitTime: '3:00 AM', salesAgent: 'Bisrat Behailu', clientFeedback: 'Interested to buy 2 bedroom apartment', siteVisit: 'Yes', officeVisit: 'No', site: 'Other', remark: 'Follow up for closing' },
    { id: 3, clientName: 'Ato Gashaws', phoneNumber: '+251911406530', visitDate: 'Aug 4, 2025', visitTime: '3:00 AM', salesAgent: 'Hana Abebawu', clientFeedback: 'They need the full finished apartment', siteVisit: 'Yes', officeVisit: 'No', site: 'Other', remark: 'Trying to convert to yiba' },
    { id: 4, clientName: 'Mahalet', phoneNumber: '0944070409', visitDate: 'Aug 4, 2025', visitTime: '3:00 AM', salesAgent: 'Amanuel Tsegaya', clientFeedback: 'Villa to buy with bank', siteVisit: 'Yes', officeVisit: 'No', site: 'Other', remark: 'Follow up for closing she need a time' },
    { id: 5, clientName: 'Wro MESERET', phoneNumber: '0913713668', visitDate: 'Aug 4, 2025', visitTime: '3:00 AM', salesAgent: 'Eliab Etsubdink', clientFeedback: 'Interested in 3 bedroom villa', siteVisit: 'Yes', officeVisit: 'No', site: 'Other', remark: 'Follow up for closing' },
    { id: 6, clientName: 'Helina', phoneNumber: '0910869504', visitDate: 'Aug 4, 2025', visitTime: '3:00 AM', salesAgent: 'Amanuel Tsegaya', clientFeedback: 'Interested intersted in 3 bedroom apartment for 2nd vist', siteVisit: 'Yes', officeVisit: 'No', site: 'Other', remark: 'Follow up for closing' },
    { id: 7, clientName: 'Ato Amsalu', phoneNumber: '+251925045194', visitDate: 'Aug 2, 2025', visitTime: '3:00 AM', salesAgent: 'Hana Abebawu', clientFeedback: '3 bedroom ground', siteVisit: 'Yes', officeVisit: 'No', site: 'Other', remark: 'Follow up for closing' },
    { id: 8, clientName: 'Mr.X', phoneNumber: '+251799993969', visitDate: 'Jul 31, 2025', visitTime: '3:00 AM', salesAgent: 'Eliab Etsubdink', clientFeedback: 'Interested in 3 bedroom', siteVisit: 'Yes', officeVisit: 'No', site: 'Other', remark: 'Ground floor' },
    { id: 9, clientName: 'belachewu', phoneNumber: '0911361396', visitDate: 'Jul 30, 2025', visitTime: '3:00 AM', salesAgent: 'Edilawit sefefe', clientFeedback: 'Visited 3 bedroom and doesn\'t like the apartment', siteVisit: 'Yes', officeVisit: 'No', site: 'Other', remark: 'Follow up to vist yiba African Union site' },
    { id: 10, clientName: 'Wro Sara', phoneNumber: '0902', visitDate: 'Jul 30, 2025', visitTime: '3:00 AM', salesAgent: 'Robel Tadesse', clientFeedback: 'Interested in 3 bedroom block 3 ground floor', siteVisit: 'Yes', officeVisit: 'No', site: 'Other', remark: 'Follow up for closing' },
  ]);

  // Filter states
  const [clientPhoneFilter, setClientPhoneFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [siteFilter, setSiteFilter] = useState('');
  const [visitTypeFilter, setVisitTypeFilter] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items to display per page

  // Filtered visits based on all applied filters
  const filteredVisits = visitsData.filter(visit => {
    const matchesClientPhone = clientPhoneFilter === '' || visit.phoneNumber.includes(clientPhoneFilter);
    const matchesTeam = teamFilter === '' || visit.team === teamFilter; // Assuming 'team' field exists in data
    const matchesAgent = agentFilter === '' || visit.salesAgent.toLowerCase().includes(agentFilter.toLowerCase());
    const matchesSite = siteFilter === '' || visit.site.toLowerCase().includes(siteFilter.toLowerCase());
    const matchesVisitType = visitTypeFilter === '' || (visit.siteVisit === 'Yes' && visitTypeFilter === 'Site Visit') || (visit.officeVisit === 'Yes' && visitTypeFilter === 'Office Visit');

    // Date range filtering (simple string comparison for demonstration)
    const visitDate = new Date(visit.visitDate);
    const startDate = dateRangeStart ? new Date(dateRangeStart) : null;
    const endDate = dateRangeEnd ? new Date(dateRangeEnd) : null;

    const matchesDateRange = (!startDate || visitDate >= startDate) && (!endDate || visitDate <= endDate);

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
    setAgentFilter('');
    setSiteFilter('');
    setVisitTypeFilter('');
    setDateRangeStart('');
    setDateRangeEnd('');
    setCurrentPage(1); // Reset to first page after clearing filters
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-inter">
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

      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Visits Report</h1>

        {/* Header/Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Visits Card */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-blue-100 text-blue-500 rounded-full p-3 mr-4">
              <i className="fas fa-chart-line text-2xl"></i>
            </div>
            <div>
              <p className="text-gray-500">Total Visits</p>
              <p className="text-2xl font-bold text-gray-900">297</p>
            </div>
          </div>
          {/* Office Visits Card */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-green-100 text-green-500 rounded-full p-3 mr-4">
              <i className="fas fa-building text-2xl"></i>
            </div>
            <div>
              <p className="text-gray-500">Office Visits</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
          </div>
          {/* Site Visits Card */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-purple-100 text-purple-500 rounded-full p-3 mr-4">
              <i className="fas fa-map-marker-alt text-2xl"></i>
            </div>
            <div>
              <p className="text-gray-500">Site Visits</p>
              <p className="text-2xl font-bold text-gray-900">285</p>
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Filters</h3>
              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
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
              {/* Team Filter */}
              <div>
                <label htmlFor="team" className="block text-sm font-medium text-gray-700">Team</label>
                <select
                  id="team"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                >
                  <option value="">All Teams</option>
                  {/* Add dynamic options here */}
                </select>
              </div>
              {/* Agent Filter */}
              <div>
                <label htmlFor="agent" className="block text-sm font-medium text-gray-700">Agent</label>
                <select
                  id="agent"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={agentFilter}
                  onChange={(e) => setAgentFilter(e.target.value)}
                >
                  <option value="">All Agents</option>
                  <option value="Amanuel Tsegaya">Amanuel Tsegaya</option>
                  <option value="Bisrat Behailu">Bisrat Behailu</option>
                  <option value="Hana Abebawu">Hana Abebawu</option>
                  <option value="Eliab Etsubdink">Eliab Etsubdink</option>
                  <option value="Edilawit sefefe">Edilawit sefefe</option>
                  <option value="Robel Tadesse">Robel Tadesse</option>
                </select>
              </div>
              {/* Site Filter */}
              <div>
                <label htmlFor="site" className="block text-sm font-medium text-gray-700">Site</label>
                <select
                  id="site"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={siteFilter}
                  onChange={(e) => setSiteFilter(e.target.value)}
                >
                  <option value="">All Sites</option>
                  <option value="Other">Other</option>
                  {/* Add dynamic options here */}
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
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">Date Range</label>
                <div className="flex mt-1">
                  <input
                    type="date"
                    className="block w-1/2 border border-gray-300 rounded-l-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={dateRangeStart}
                    onChange={(e) => setDateRangeStart(e.target.value)}
                  />
                  <span className="flex items-center px-2 text-gray-500">-</span>
                  <input
                    type="date"
                    className="block w-1/2 border border-gray-300 rounded-r-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={dateRangeEnd}
                    onChange={(e) => setDateRangeEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Visits Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Agent</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Feedback</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Visit</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office Visit</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentVisits.map((visit) => (
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-end items-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <i className="fas fa-chevron-left"></i>
              </button>
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === number + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {number + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <i className="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitReport;
