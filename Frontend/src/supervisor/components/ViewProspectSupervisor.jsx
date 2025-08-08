import React, { useState, useEffect } from 'react';

// This component displays a table of prospect data with filtering and searching capabilities.
const ViewProspectSupervisor = () => {
  // State for prospect data, filter options, and loading status.
  const [prospects, setProspects] = useState([]);
  const [filteredProspects, setFilteredProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchPhone: '',
    startDate: '',
    endDate: '',
    agent: '',
  });

  // Effect to fetch data from the backend when the component mounts.
  useEffect(() => {
    const fetchProspects = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:5000/api/prospects');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        if (!Array.isArray(responseData.data)) {
          throw new Error('API response data is not an array.');
        }

        const sortedProspects = responseData.data.sort((a, b) => {
          return new Date(b.dateNow) - new Date(a.dateNow);
        });

        setProspects(sortedProspects);
        setFilteredProspects(sortedProspects);
      } catch (error) {
        console.error("Failed to fetch prospects:", error);
        setError("Failed to load prospects. Please try again later.");
        setProspects([]);
        setFilteredProspects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProspects();
  }, []);

  // Effect to apply filters whenever filter state or prospect list changes.
  useEffect(() => {
    const applyFilters = () => {
      let filteredData = prospects;

      if (filters.searchPhone) {
        filteredData = filteredData.filter(prospect =>
          // Add a safety check to ensure phoneNumber is a string before calling includes.
          typeof prospect.phoneNumber === 'string' && prospect.phoneNumber.includes(filters.searchPhone)
        );
      }
      
      // Filter by date range - using `prospect.dateNow` for consistency with the sorting logic.
      if (filters.startDate) {
        const start = new Date(filters.startDate);
        filteredData = filteredData.filter(prospect => new Date(prospect.dateNow) >= start);
      }
      
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        filteredData = filteredData.filter(prospect => new Date(prospect.dateNow) <= end);
      }
      
      // Filter by agent
      if (filters.agent) {
        filteredData = filteredData.filter(prospect =>
          prospect.agent === filters.agent
        );
      }

      setFilteredProspects(filteredData);
    };

    applyFilters();
  }, [filters, prospects]);

  // Handler for all input changes in the filter section.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchPhone: '',
      startDate: '',
      endDate: '',
      agent: '',
    });
  };
  
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full">

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-200 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Prospect Management
          </h2>
        </div>

        {/* Filter and Search Section */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            
            {/* Search Phone Filter */}
            <div>
              <label htmlFor="searchPhone" className="block text-sm font-medium text-gray-700">
                Search Phone
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="searchPhone"
                  id="searchPhone"
                  value={filters.searchPhone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
                  placeholder="Search phone numbers"
                />
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Date Range
              </label>
              <div className="mt-1 flex gap-2 items-center">
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
                />
                <span className="self-center text-gray-500">to</span>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
                />
              </div>
            </div>

            {/* Filter by Agent */}
            <div>
              <label htmlFor="agent" className="block text-sm font-medium text-gray-700">
                Filter by Agent
              </label>
              <div className="mt-1">
                <select
                  id="agent"
                  name="agent"
                  value={filters.agent}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
                >
                  <option value="">Select agent</option>
                  <option>Nefetalem Mulu</option>
                  <option>Abebe Girmay</option>
                </select>
              </div>
            </div>
            
            {/* Clear Filters Button */}
            <div>
              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Showing: <span className="font-semibold">{filteredProspects.length}</span> prospects
          </p>
        </div>

        {/* The table itself */}
        <div className="p-6 md:p-8">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-gray-500">Loading prospects...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-48 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
            <table className="w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Site
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remark
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {Array.isArray(filteredProspects) && filteredProspects.map((prospect) => (
                  <tr key={prospect.id}>
                    <td className="px-2 py-2 text-gray-900">
                      {prospect.name}
                    </td>
                    <td className="px-2 py-2 text-gray-500">
                      {prospect.phoneNumber}
                    </td>
                    <td className="px-2 py-2 text-gray-500">
                      {prospect.agent}
                    </td>
                    <td className="px-2 py-2 text-gray-500">
                      {prospect.date}
                    </td>
                    <td className="px-2 py-2 text-gray-500">
                      {prospect.interest}
                    </td>
                    <td className="px-2 py-2 text-gray-500">
                      {prospect.site}
                    </td>
                    <td className="px-2 py-2 text-gray-500">
                      {prospect.method}
                    </td>
                    <td className="px-2 py-2 text-gray-500">
                      {prospect.comment}
                    </td>
                    <td className="px-2 py-2 text-gray-500">
                      {prospect.remark}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProspectSupervisor;
