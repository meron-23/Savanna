import React, { useState, useEffect } from 'react';

const ViewProspect = () => {
  const [prospects, setProspects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProspects = async () => {
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

  const filteredProspects = prospects.filter(prospect =>
    prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.interest.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.remark.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.periodTime.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full">
        <p className="text-gray-600">Loading prospects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <div className='flex flex-col space-y-2'>
          <h2 className="text-xl font-bold text-[#333333]">
            Prospect Management
          </h2>
          <p>{prospects.length} Prospects</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {filteredProspects.length === 0 && !isLoading && !error ? (
        <p className="text-gray-600">No matching prospects found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Phone
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Interest
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Method
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Site
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Period Time
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Date Now
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProspects.map((prospect) => (
                <tr key={prospect.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900 align-middle">
                    <div className="line-clamp-2">{prospect.name}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                    {prospect.phoneNumber}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 align-middle">
                    <div className="line-clamp-2">{prospect.interest}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                    {prospect.method}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 align-middle">
                    <div className="line-clamp-2">{prospect.site}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                    {prospect.periodTime}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                    {prospect.date ? new Date(prospect.date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                    {prospect.dateNow ? new Date(prospect.dateNow).toLocaleDateString() : 'N/A'}
                  </td>
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