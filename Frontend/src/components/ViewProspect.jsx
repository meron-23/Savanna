import React, { useState, useEffect } from 'react';

const ViewProspect = () => {
  const [prospects, setProspects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        // Replace with your actual API endpoint if different in production
        const response = await fetch('http://localhost:3000/api/prospects');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        if (!Array.isArray(responseData.data)) {
          throw new Error('API response data is not an array.');
        }

        // Sort prospects by dateNow in descending order (most recent first)
        const sortedProspects = responseData.data.sort((a, b) => {
          return new Date(b.dateNow) - new Date(a.dateNow);
        });

        setProspects(sortedProspects);
      } catch (error) {
        console.error("Failed to fetch prospects:", error);
        setError("Failed to load prospects. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProspects();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter prospects based on the search term across multiple fields
  const filteredProspects = prospects.filter(prospect =>
    prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.interest.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prospect.comment && prospect.comment.toLowerCase().includes(searchTerm.toLowerCase())) || // Check for existence before calling toLowerCase
    (prospect.remark && prospect.remark.toLowerCase().includes(searchTerm.toLowerCase())) ||   // Check for existence
    (prospect.periodTime && prospect.periodTime.toLowerCase().includes(searchTerm.toLowerCase())) || // Check for existence
    (prospect.date && new Date(prospect.date).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase())) ||
    (prospect.dateNow && new Date(prospect.dateNow).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Loading state UI
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full flex justify-center items-center h-48">
        <p className="text-gray-600 text-lg">Loading prospects...</p>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full flex justify-center items-center h-48">
        <p className="text-red-600 text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 overflow-hidden"> {/* Added overflow-hidden to contain table */}
      {/* Header and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className='flex flex-col space-y-1'>
          <h2 className="text-2xl font-bold text-[#333333]">
            Prospect Management
          </h2>
          <p className="text-gray-600 text-sm md:text-base">{prospects.length} Total Prospects</p>
        </div>
        <div className="relative w-full sm:w-auto"> {/* Adjusted width for responsiveness */}
          <input
            type="text"
            placeholder="Search all fields..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] w-full sm:text-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* No Prospects Found Message */}
      {filteredProspects.length === 0 && !isLoading && !error ? (
        <p className="text-gray-600 text-center py-8">No matching prospects found. Try a different search term.</p>
      ) : (
        /* Table Container with Horizontal Scroll */
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm"> {/* Added border and shadow for table container */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Table Headers - Adjusted padding for smaller screens */}
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">
                  Name
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">
                  Phone
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4">
                  Interest
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">
                  Method
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4">
                  Site
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">
                  Period Time
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">
                  Date
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">
                  Date Now
                </th>
                {/* Removed Comment and Remark from default view to reduce column count on small screens */}
                {/* You can add them back with conditional rendering for larger screens if needed */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProspects.map((prospect) => (
                <tr key={prospect.id} className="hover:bg-gray-50">
                  {/* Table Data Cells - Adjusted padding, removed unnecessary whitespace-nowrap */}
                  <td className="px-3 py-3 text-sm text-gray-900 align-top sm:px-4">
                    <div className="line-clamp-2">{prospect.name}</div>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500 align-top whitespace-nowrap sm:px-4">
                    {prospect.phoneNumber}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500 align-top sm:px-4">
                    <div className="line-clamp-2">{prospect.interest}</div>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500 align-top whitespace-nowrap sm:px-4">
                    {prospect.method}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500 align-top sm:px-4">
                    <div className="line-clamp-2">{prospect.site}</div>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500 align-top whitespace-nowrap sm:px-4">
                    {prospect.periodTime}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500 align-top whitespace-nowrap sm:px-4">
                    {prospect.date ? new Date(prospect.date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500 align-top whitespace-nowrap sm:px-4">
                    {prospect.dateNow ? new Date(prospect.dateNow).toLocaleDateString() : 'N/A'}
                  </td>
                  {/* Removed Comment and Remark from default view */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewProspect;