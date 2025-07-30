import React, { useState, useEffect } from 'react';

const ViewProspect = () => {
  const [prospects, setProspects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/prospects');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json(); // Renamed to avoid confusion with data.data

        // CORRECTED LINE: Access the 'data' property from the response object
        setProspects(responseData.data);
      } catch (error) {
        console.error("Failed to fetch prospects:", error);
        setError("Failed to load prospects. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProspects();
  }, []);

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
      <h2 className="text-xl font-bold text-[#333333] mb-4">View All Prospects</h2>

      {prospects.length === 0 ? (
        <p className="text-gray-600">No prospects found.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Now</th>
              {/* Add other headers if you want to display comment, remark, etc. */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prospects.map((prospect) => (
              <tr key={prospect.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prospect.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prospect.phoneNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prospect.interest}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prospect.method}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prospect.site}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prospect.periodTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prospect.date ? new Date(prospect.date).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prospect.dateNow ? new Date(prospect.dateNow).toLocaleDateString() : 'N/A'}
                </td>
                {/* You can add more cells for comment, remark, etc., if desired */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewProspect;