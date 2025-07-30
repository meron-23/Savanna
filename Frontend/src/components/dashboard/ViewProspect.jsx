import React from 'react'

const ViewProspect = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full">
      <h2 className="text-xl font-bold text-[#333333] mb-4">View All Prospects</h2>
      <p className="text-gray-600">This is where your list or table of prospects will be displayed.</p>
      {/* You can add a table here to display prospect data */}
      <table className="min-w-full divide-y divide-gray-200 mt-4">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">John Doe</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">123-456-7890</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">UI/UX Design</td>
          </tr>
          {/* More rows will go here */}
        </tbody>
      </table>
    </div>
  );
}

export default ViewProspect
