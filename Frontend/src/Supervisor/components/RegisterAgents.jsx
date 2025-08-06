import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Pencil, CircleAlert, X } from 'lucide-react';

// IMPORTANT: Update API_BASE_URL to point to your backend
const API_BASE_URL = 'http://localhost:3000/api'; // Use relative path for proxy to work

// A simple component to display the colored role labels
const RoleBadge = ({ role }) => {
  let colorClass = '';
  switch (role) {
    case 'Supervisor':
      colorClass = 'bg-gray-200 text-gray-800'; // Neutral for supervisor
      break;
    case 'Sales Agent':
      colorClass = 'bg-[#F4A300] bg-opacity-20 text-[#F4A300]'; // Saffron tint for sales agent
      break;
    case 'Male': // For gender display
      colorClass = 'bg-gray-200 text-gray-800'; // Neutral for gender
      break;
    case 'Female': // For gender display
      colorClass = 'bg-gray-200 text-gray-800'; // Neutral for gender
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-800';
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {role}
    </span>
  );
};

const RegisterAgents = ({ isSidebarOpen }) => { // Accept isSidebarOpen prop
  // Hardcoded supervisorId for demonstration. In a real app, this would come from authentication.
  const [supervisorId, setSupervisorId] = useState('supervisor-123');
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    gender: '',
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/${supervisorId}/agents`);
      // FIX: Ensure teamMembers is always an array, even if response.data.data is undefined/null
      setTeamMembers(response.data.data || []);
      setMessage(''); // Clear any previous messages
    } catch (error) {
      console.error("Error fetching agents:", error);
      setMessage('Failed to load agents. Please ensure the backend is running and configured correctly.');
      setTeamMembers([]); // Set to empty array on error to prevent further issues
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (supervisorId) {
      fetchAgents();
    }
  }, [supervisorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email || !newMember.gender || !newMember.phoneNumber) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setMessage('Adding new team member...');

    try {
      const response = await axios.post(`${API_BASE_URL}/${supervisorId}/register`, newMember);
      if (response.data.success) {
        setMessage('Agent registered successfully!');
        setNewMember({ name: '', email: '', gender: '', phoneNumber: '' }); // Reset form
        fetchAgents(); // Refresh the list of agents
        setIsModalOpen(false); // Close modal on success
      } else {
        setMessage(response.data.message || 'Failed to register agent.');
      }
    } catch (error) {
      console.error("Error registering agent:", error);
      setMessage(error.response?.data?.message || 'Error registering agent. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    }
  };

  return (
    <div className={`p-8 bg-gray-100 min-h-screen font-inter transition-all duration-300 ease-in-out
      ${isSidebarOpen ? 'md:pl-64' : 'md:pl-20'}`}> {/* Dynamic padding based on sidebar */}
      
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Team Management</h1>

      {/* Loading and Message Modal */}
      {message && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-3">
            <CircleAlert className="w-6 h-6 text-[#F4A300]" /> {/* Saffron color */}
            <p className="text-gray-800">{message}</p>
          </div>
        </div>
      )}

      {/* Team Members Table Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Team Members ({teamMembers.length})</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-10 h-10 border-4 border-t-4 border-[#F4A300] border-t-transparent rounded-full animate-spin"></div> {/* Saffron loading spinner */}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.userId || member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">{member.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={member.gender} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={member.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.supervisor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-[#F4A300] hover:text-orange-700"> {/* Saffron color */}
                        <Pencil className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Button to open Add New Team Member Modal */}
      <div className="text-center mt-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#F4A300] text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200 shadow-md"
        >
          Add New Team Member
        </button>
      </div>

      {/* Add New Team Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Add New Team Member</h2>
            <form onSubmit={handleAddMember}>
              <div className="grid grid-cols-1 gap-6"> {/* Simplified grid for modal */}
                {/* Name */}
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="text-red-500 mr-1">*</span>Name
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={newMember.name}
                      onChange={handleInputChange}
                      className="focus:ring-[#F4A300] focus:border-[#F4A300] block w-full pl-10 pr-3 sm:text-sm border-gray-300 rounded-lg"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="text-red-500 mr-1">*</span>Email
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={newMember.email}
                      onChange={handleInputChange}
                      className="focus:ring-[#F4A300] focus:border-[#F4A300] block w-full pl-10 pr-3 sm:text-sm border-gray-300 rounded-lg"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="text-red-500 mr-1">*</span>Gender
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <select
                      id="gender"
                      name="gender"
                      value={newMember.gender}
                      onChange={handleInputChange}
                      className="focus:ring-[#F4A300] focus:border-[#F4A300] block w-full pr-10 sm:text-sm border-gray-300 rounded-lg"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="text-red-500 mr-1">*</span>Phone Number
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={newMember.phoneNumber}
                      onChange={handleInputChange}
                      className="focus:ring-[#F4A300] focus:border-[#F4A300] block w-full pl-10 pr-3 sm:text-sm border-gray-300 rounded-lg"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-[#F4A300] text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add Team Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterAgents;
