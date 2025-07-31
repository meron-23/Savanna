import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // No longer needed for dummy data

const AssignedLeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data to simulate leads assigned to the user
  const dummyLeads = [
    {
      id: 1,
      name: 'John Doe',
      phoneNumber: '+1-555-1234',
      interest: 'Product A',
      remark: 'New Lead',
      date: '2025-07-30T10:00:00Z',
    },
    {
      id: 2,
      name: 'Jane Smith',
      phoneNumber: '+1-555-5678',
      interest: 'Service B',
      remark: 'Follow-up scheduled',
      date: '2025-07-29T14:30:00Z',
    },
    {
      id: 3,
      name: 'Sam Wilson',
      phoneNumber: '+1-555-9012',
      interest: 'Product A',
      remark: 'Qualified',
      date: '2025-07-28T11:45:00Z',
    },
    {
      id: 4,
      name: 'Maria Garcia',
      phoneNumber: '+1-555-3456',
      interest: 'Service C',
      remark: 'Unqualified - Not interested',
      date: '2025-07-27T16:00:00Z',
    },
    {
      id: 5,
      name: 'Chris Evans',
      phoneNumber: '+1-555-7890',
      interest: 'Product B',
      remark: 'Contacted',
      date: '2025-07-26T09:15:00Z',
    },
  ];

  useEffect(() => {
    // Simulate fetching data from an API with a 1-second delay
    const fetchData = () => {
      setLoading(true);
      setError(null);

      setTimeout(() => {
        try {
          // In a real app, this would be the response from your backend API
          // const response = await axios.get(`http://localhost:5000/api/leads/assigned/${userId}`);
          // setLeads(response.data.data);

          // For now, we'll just set the dummy data directly
          setLeads(dummyLeads);
          setLoading(false);
        } catch (err) {
          // Simulate an error
          setError('Failed to load leads from the server.');
          setLoading(false);
        }
      }, 1000); // 1-second delay
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <p className="text-blue-700 p-4">Loading assigned leads...</p>;
  }

  if (error) {
    return <p className="text-red-500 p-4">Error: {error}</p>;
  }

  if (!leads || leads.length === 0) {
    return <p className="text-gray-600 p-4">You have no assigned leads at this time. Check back later!</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full">
      <h2 className="text-xl font-bold text-[#333333] mb-4">Your Assigned Leads</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
              {/* Add more table headers as needed for leads */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id}> 
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.phoneNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.interest}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.remark}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(lead.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedLeadsTable;