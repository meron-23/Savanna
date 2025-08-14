import React, { useState, useEffect, useCallback } from 'react';

// Main RegisterUser component
const RegisterUser = () => {
  // State for the team members table
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const itemsPerPage = 5;

  // State for the "Add New Team Member" form
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    gender: '',
    phoneNumber: '',
    role: '',
    supervisor: '',
  });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (!responseData.success || !Array.isArray(responseData.data)) {
        throw new Error('API response data is not in expected format or success is false.');
      }

      const mappedUsers = responseData.data.map(item => ({
        id: item.userId,
        name: item.name,
        email: item.email,
        gender: item.gender,
        phone: item.phoneNumber,
        role: item.role,
        supervisor: item.supervisor || 'N/A',
      }));

      setTeamMembers(mappedUsers);

      const uniqueSupervisors = [...new Set(
        responseData.data
          .filter(user => user.role === 'Supervisor')
          .map(user => user.name)
      )].sort();
      setSupervisors(['N/A', ...uniqueSupervisors]);

    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError(`Failed to load users: ${error.message}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  // Handle modal open/close
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset form when closing modal
    setNewMember({ name: '', email: '', gender: '', phoneNumber: '', role: '', supervisor: '' });
  };

  // Handle submission for the "Add New Team Member" form
const handleAddMemberSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  // Basic validation
  if (!newMember.name || !newMember.email || !newMember.role) {
    setError('Name, email, and role are required');
    setIsLoading(false);
    return;
  }

  const memberDataToSend = {
    name: newMember.name.trim(),
    email: newMember.email.trim().toLowerCase(),
    phoneNumber: newMember.phoneNumber || '',
    gender: newMember.gender || 'Other',
    role: newMember.role,
    supervisor: newMember.role === 'Supervisor' ? null : (newMember.supervisor === 'N/A' ? null : newMember.supervisor)
  };

  try {
    const response = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(memberDataToSend)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register user');
    }

    const result = await response.json();
    console.log('New user added:', result);
    
    // Show success message
    alert(`User created successfully! Temporary password: ${result.tempPassword}`);
    
    await fetchUsers();
    closeModal();
  } catch (error) {
    console.error("Registration failed:", error);
    setError(error.message);
    alert(`Error: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};

  // Calculate summary card values
  const totalMembersCount = teamMembers.length;
  const supervisorsCount = teamMembers.filter(member => member.role === 'Supervisor').length;
  const salesAgentsCount = teamMembers.filter(member => member.role === 'SalesAgent' || member.role === 'Sales').length;

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
          /* Modal backdrop */
          .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
          }
          /* Modal container */
          .modal-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 2rem;
            border-radius: 0.5rem;
            z-index: 1001;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
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
                <div className="bg-blue-100 text-[#F4C430] rounded-full p-3 mr-4">
                  <i className="fas fa-users text-2xl"></i>
                </div>
                <div>
                  <p className="text-gray-500">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{totalMembersCount}</p>
                </div>
              </div>
              {/* Supervisors Card */}
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="bg-green-100 text-[#F4C430] rounded-full p-3 mr-4">
                  <i className="fas fa-user-tie text-2xl"></i>
                </div>
                <div>
                  <p className="text-gray-500">Supervisors</p>
                  <p className="text-2xl font-bold text-gray-900">{supervisorsCount}</p>
                </div>
              </div>
              {/* Sales Agents Card */}
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="bg-purple-100 text-[#F4C430] rounded-full p-3 mr-4">
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
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      placeholder="Search by name, email or phone"
                      className="mt-1 block w-full px-9 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={openModal}
                    className="
                      bg-[#F4A300] text-white 
                      px-3 py-3.5 text-sm
                      sm:px-4 sm:py-2 sm:text-base
                      rounded-lg shadow-md 
                      hover:bg-[#333333] 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                      transition duration-150 ease-in-out 
                      whitespace-nowrap
                      flex items-center justify-center
                    "
                  >
                    <i className="fas fa-user-plus"></i>
                    <span className="hidden sm:inline ml-2">Add Member</span>
                  </button>

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
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === number + 1 ? 'bg-[#F4A300] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
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
          </>
        )}

        {/* Modal for Add New Team Member */}
        {isModalOpen && (
          <>
            <div className="modal-backdrop" onClick={closeModal}></div>
            <div className="modal-container">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Add New Team Member</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <form onSubmit={handleAddMemberSubmit} className="grid grid-cols-1 gap-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="newName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="newName"
                    name="name"
                    value={newMember.name}
                    onChange={handleNewMemberChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="SalesAgent">Sales Agent</option>
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
                  >
                    {supervisors.map((sup, index) => (
                      <option key={index} value={sup}>{sup}</option>
                    ))}
                  </select>
                </div>
                
                {/* Submit Button */}
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4A300]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F4A300] hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4A300]"
                  >
                    Add Member
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