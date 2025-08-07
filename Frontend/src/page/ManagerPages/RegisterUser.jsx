import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback

// Main RegisterUser component
const RegisterUser = () => {
  // State for the team members table
  const [teamMembers, setTeamMembers] = useState([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supervisors, setSupervisors] = useState([]); // State to hold supervisor names for dropdown

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
    supervisor: '', // Added supervisor field
  });

  // Define fetchUsers outside useEffect and wrap it in useCallback
  const fetchUsers = useCallback(async () => {
    setIsLoading(true); // Set loading to true before fetching
    setError(null);     // Clear any previous errors
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (!responseData.success || !Array.isArray(responseData.data)) {
        throw new Error('API response data is not in expected format or success is false.');
      }

      // Map API response data to match component's expected structure
      const mappedUsers = responseData.data.map(item => ({
        id: item.userId, // Use userId as id
        name: item.name,
        email: item.email,
        gender: item.gender,
        phone: item.phoneNumber,
        role: item.role,
        supervisor: item.supervisor || 'N/A', // Provide a default if supervisor is null
      }));

      setTeamMembers(mappedUsers);

      // Populate supervisors for the dropdown
      const uniqueSupervisors = [...new Set(
        responseData.data
          .filter(user => user.role === 'Supervisor')
          .map(user => user.name)
      )].sort();
      setSupervisors(['N/A', ...uniqueSupervisors]); // Add 'N/A' as an option for no supervisor

    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError(`Failed to load users: ${error.message}. Please try again later.`);
    } finally {
      setIsLoading(false); // Set loading to false after fetch attempt
    }
  }, []); // Empty dependency array because fetchUsers doesn't depend on any props or state that would change its logic

  // useEffect hook to call fetchUsers on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Add fetchUsers to dependency array to satisfy ESLint, though it's stable due to useCallback

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
  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const now = new Date();
    // Format date to YYYY-MM-DD HH:MM:SS for MySQL DATETIME column
    const formattedDateTime = now.getFullYear() + '-' +
                              String(now.getMonth() + 1).padStart(2, '0') + '-' +
                              String(now.getDate()).padStart(2, '0') + ' ' +
                              String(now.getHours()).padStart(2, '0') + ':' +
                              String(now.getMinutes()).padStart(2, '0') + ':' +
                              String(now.getSeconds()).padStart(2, '0');

    // Generate a unique userId and truncate it to 28 characters
    const newUserId = crypto.randomUUID().substring(0, 28); 

    const memberDataToSend = {
      userId: newUserId, // Include the generated and truncated userId
      name: newMember.name,
      email: newMember.email,
      phoneNumber: newMember.phoneNumber,
      gender: newMember.gender,
      role: newMember.role,
      supervisor: newMember.supervisor === 'N/A' ? null : newMember.supervisor, // Send null if 'N/A' is selected
      creationTime: formattedDateTime, // Use the formatted datetime
      lastSignInTime: formattedDateTime, // Use the formatted datetime
    };

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberDataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert('New member added successfully!');
      console.log('New user added:', result);

      // Re-fetch users to update the table with the new data from the backend
      // This ensures the table is always in sync with the database
      await fetchUsers(); // Now fetchUsers is accessible here

      setNewMember({ name: '', email: '', gender: '', phoneNumber: '', role: '', supervisor: '' }); // Clear form
    } catch (error) {
      console.error("Failed to add new member:", error);
      setError(`Failed to add member: ${error.message}.`);
      alert(`Error adding member: ${error.message}`); // Provide user feedback
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate summary card values
  const totalMembersCount = teamMembers.length;
  const supervisorsCount = teamMembers.filter(member => member.role === 'Supervisor').length;
  const salesAgentsCount = teamMembers.filter(member => member.role === 'Sales Agent' || member.role === 'Sales').length; // Include 'Sales' role

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

        {/* Loading and Error Indicators */}
        {isLoading && (
          <div className="text-center py-4 text-gray-700">Loading team members...</div>
        )}
        {error && (
          <div className="text-center py-4 text-red-600 font-medium">{error}</div>
        )}

        {/* Only render content if not loading and no error */}
        {!isLoading && !error && (
          <>
            {/* Header/Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Members Card */}
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="bg-blue-100 text-blue-500 rounded-full p-3 mr-4">
                  <i className="fas fa-users text-2xl"></i>
                </div>
                <div>
                  <p className="text-gray-500">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{totalMembersCount}</p>
                </div>
              </div>
              {/* Supervisors Card */}
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="bg-green-100 text-green-500 rounded-full p-3 mr-4">
                  <i className="fas fa-user-tie text-2xl"></i>
                </div>
                <div>
                  <p className="text-gray-500">Supervisors</p>
                  <p className="text-2xl font-bold text-gray-900">{supervisorsCount}</p>
                </div>
              </div>
              {/* Sales Agents Card */}
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="bg-purple-100 text-purple-500 rounded-full p-3 mr-4">
                  <i className="fas fa-user-tag text-2xl"></i>
                </div>
                <div>
                  <p className="text-gray-500">Sales Agents</p>
                  <p className="text-2xl font-bold text-gray-900">{salesAgentsCount}</p>
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
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${member.role === 'Admin' ? 'bg-purple-100 text-purple-800' : (member.role === 'Supervisor' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}`}>
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
                {/* Supervisor Field (Dropdown) */}
                <div>
                  <label htmlFor="newSupervisor" className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
                  <select
                    id="newSupervisor"
                    name="supervisor"
                    value={newMember.supervisor}
                    onChange={handleNewMemberChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {supervisors.map((sup, index) => (
                      <option key={index} value={sup}>{sup}</option>
                    ))}
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
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterUser;
