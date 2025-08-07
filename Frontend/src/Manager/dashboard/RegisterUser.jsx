import React, { useState } from 'react';
// No axios needed for just the design/layout as per the image provided.

// Main RegisterUser component
const RegisterUser = () => {
  // Sample data for the team members table
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Yibeltal Degú', email: 'deguyibelta1918@gmail.com', gender: 'Male', phone: '0986038398', role: 'Sales Agent', supervisor: 'Robel Tadesse' },
    { id: 2, name: 'Amanuel Tesgaya', email: 'amanueltesgaye40@gmail.com', gender: 'Male', phone: '0934259191', role: 'Sales Agent', supervisor: 'Robel Tadesse' },
    { id: 3, name: 'Yeabsira Daniel', email: 'yeabsiradaniel681@gmail.com', gender: 'Female', phone: '0962420176', role: 'Sales Agent', supervisor: 'Robel Tadesse' },
    { id: 4, name: 'Admin Account', email: 'dynamicrealestatemarketing@gmail.com', gender: 'Female', phone: '0974388888', role: 'Admin', supervisor: 'N/A' },
    { id: 5, name: 'Hidet Yigeram', email: 'yigemhidet5@gmail.com', gender: 'Female', phone: '0912984491', role: 'Sales Agent', supervisor: 'fafi fasika' },
    { id: 6, name: 'Samrawi tadesse', email: 'samrawitadesse464@gmail.com', gender: 'Male', phone: '0915599096', role: 'Sales Agent', supervisor: 'fafi fasika' },
    { id: 7, name: 'Eliab Etsubdink', email: 'eliabesubdink@gmail.com', gender: 'Male', phone: '0973121553', role: 'Sales Agent', supervisor: 'Robel Tadesse' },
    { id: 8, name: 'Bereket simachewu', email: 'email-bereketmsimachewu21@gmail.com', gender: 'Male', phone: '0900856461', role: 'Sales Agent', supervisor: 'Robel Tadesse' },
    { id: 9, name: 'Bisrat Behailu', email: 'bisratbehailu2@gmail.com', gender: 'Female', phone: '0956140660', role: 'Sales Agent', supervisor: 'Robel Tadesse' },
    { id: 10, name: 'Metinanat Tesfalem', email: 'metisinanattesfalem@gmail.com', gender: 'Female', phone: '0963228047', role: 'Sales Agent', supervisor: 'fafi fasika' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page

  // State for the "Add New Team Member" form
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    gender: '',
    phoneNumber: '',
    role: '',
  });

  // Filtered team members based on search term
  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle input changes for the "Add New Team Member" form
  const handleNewMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  // Handle submission for the "Add New Team Member" form
  const handleAddMemberSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to a backend.
    // For this design, we'll just add it to the local state.
    const newId = teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.id)) + 1 : 1;
    setTeamMembers(prev => [...prev, { ...newMember, id: newId, supervisor: 'N/A' }]); // Add a default supervisor
    setNewMember({ name: '', email: '', gender: '', phoneNumber: '', role: '' }); // Clear form
    alert('New member added (locally)! In a real app, this would be sent to a server.');
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
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Team Management</h1>

        {/* Header/Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Members Card */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-blue-100 text-blue-500 rounded-full p-3 mr-4">
              <i className="fas fa-users text-2xl"></i>
            </div>
            <div>
              <p className="text-gray-500">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">25</p>
            </div>
          </div>
          {/* Supervisors Card */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-green-100 text-green-500 rounded-full p-3 mr-4">
              <i className="fas fa-user-tie text-2xl"></i>
            </div>
            <div>
              <p className="text-gray-500">Supervisors</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
          {/* Sales Agents Card */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-purple-100 text-purple-500 rounded-full p-3 mr-4">
              <i className="fas fa-user-tag text-2xl"></i>
            </div>
            <div>
              <p className="text-gray-500">Sales Agents</p>
              <p className="text-2xl font-bold text-gray-900">20</p>
            </div>
          </div>
        </div>

        {/* Team Members Table Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-3 sm:mb-0">Team Members</h2>
            <div className="relative w-full sm:w-auto">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search by name, email or phone"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${member.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                        {member.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${member.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.supervisor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 flex items-center">
                        <i className="fas fa-lock mr-1"></i> Password
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
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

        {/* Add New Team Member Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Team Member</h2>
          <form onSubmit={handleAddMemberSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div>
              <label htmlFor="newName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="newName"
                name="name"
                value={newMember.name}
                onChange={handleNewMemberChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Name"
                required
              />
            </div>
            {/* Email Field */}
            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="newEmail"
                name="email"
                value={newMember.email}
                onChange={handleNewMemberChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Email"
                required
              />
            </div>
            {/* Gender Field */}
            <div>
              <label htmlFor="newGender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                id="newGender"
                name="gender"
                value={newMember.gender}
                onChange={handleNewMemberChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* Phone Number Field */}
            <div>
              <label htmlFor="newPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                id="newPhoneNumber"
                name="phoneNumber"
                value={newMember.phoneNumber}
                onChange={handleNewMemberChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Phone Number"
              />
            </div>
            {/* Role Field */}
            <div>
              <label htmlFor="newRole" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                id="newRole"
                name="role"
                value={newMember.role}
                onChange={handleNewMemberChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Role</option>
                <option value="Sales Agent">Sales Agent</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                <i className="fas fa-user-plus mr-2"></i> Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
