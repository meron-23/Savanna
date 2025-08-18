import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = ({ isMobile, toggleSidebar, isSidebarOpen, user }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  const [lastFetchedLeads, setLastFetchedLeads] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('name');
    const userRole = localStorage.getItem('role');

    if (userId && userName && userRole) {
      setCurrentUser({
        userId,
        name: userName,
        role: userRole,
      });
    } else {
      setCurrentUser(null);
      setAssignedLeads([]);
      setNewLeadsCount(0);
      setLastFetchedLeads([]);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setCurrentUser(null);
    navigate('/login');
    setIsProfileOpen(false);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.profile-dropdown')) {
      setIsProfileOpen(false);
    }
  };

  const handleBellClick = () => {
    setIsModalOpen(true);
    setNewLeadsCount(0); // Reset new leads count when modal is opened
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);
  const notifications = [];

  useEffect(() => {
    const fetchAssignedLeads = async () => {
      if (!currentUser || !currentUser.userId) return;

      try {
        const response = await axios.get('http://localhost:5000/api/full-details');
        
        if (response.data && Array.isArray(response.data.data)) {
          // Filter leads based on role and user ID
          let filteredLeads = [];
          
          const userRole = localStorage.getItem('role');
          const userId = localStorage.getItem('userId');

          // console.log(response.data.data)

          filteredLeads = response.data.data.filter(lead => {
            // For supervisors: show leads where supervisor ID matches OR agent_role is Supervisor
            if (userRole === 'Supervisor') {
              return lead.agent_id === userId || 
                lead.agent_role === 'Supervisor' && lead.agent_id === userId && lead.status === 'new';
            }
            // For sales agents: only show their own leads
            else if (userRole === 'Sales Agent' || userRole === 'Agent') {
              return lead.agent_id === userId && 
                lead.agent_role === 'Sales Agent' || lead.agent_role === 'Agent' && lead.status === 'new';
            }
          });

          // Calculate new leads by comparing with last fetched leads
          const newLeads = filteredLeads.filter(newLead => 
            !lastFetchedLeads.some(oldLead => oldLead.lead_id === newLead.lead_id)
          );

          if (newLeads.length > 0) {
            setNewLeadsCount(prev => prev + newLeads.length);
          }

          setAssignedLeads(filteredLeads);
          setLastFetchedLeads(filteredLeads);
        }
      } catch (error) {
        console.error("Error fetching assigned leads:", error);
      }
    };

    fetchAssignedLeads();
    const intervalId = setInterval(fetchAssignedLeads, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [currentUser, lastFetchedLeads]);

  return (
    <header className="bg-[#333333] text-white shadow-md fixed top-0 right-0 left-0 z-40">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center">
          {/* Logo */}
          {(!isMobile || !isSidebarOpen) && (
            <Link to="/dashboard" className="flex items-center hover:no-underline">
              <div className="bg-[#F4A300] rounded-lg p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>
              <span className="text-xl font-bold ml-2 hidden sm:block ps-7">Savanna</span>
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {currentUser && (
            <div className="relative">
              <button 
                onClick={handleBellClick} 
                 className="p-1 rounded-full hover:bg-gray-700 focus:outline-none relative"
                aria-label="Notifications"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0v2" />
                  </svg>
                {newLeadsCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {newLeadsCount}
                  </span>
                )}
              </button>
            </div>
          )}
          
          {currentUser && (
            <div className="relative profile-dropdown">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="User menu"
              >
                <div className="h-8 w-8 rounded-full bg-[#F4C430] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                  </svg>
                </div>
                {!isMobile && (
                  <svg 
                    className={`h-4 w-4 text-gray-300 transition-transform ${isProfileOpen ? 'transform rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
  
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link 
                    to="/" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Sign out
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
  
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full m-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {currentUser?.role === 'Supervisor' ? 'Team Leads' : 'Your Assigned Leads'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {assignedLeads.length === 0 ? (
                <p className="text-gray-500">No leads available</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {assignedLeads.map((lead) => (
                    <li key={lead.lead_id} className="py-4">
                      <Link to={`/leads/${lead.lead_id}`} onClick={handleCloseModal} className="block hover:bg-gray-50 p-2 rounded-md">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{lead.lead_name}</p>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                              lead.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
                              lead.status === 'interested' ? 'bg-yellow-100 text-yellow-800' :
                              lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            {lead.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{lead.lead_interest}</p>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500">Phone: {lead.phone}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(lead.date_added).toLocaleDateString()}
                          </p>
                        </div>
                        {currentUser?.role === 'Supervisor' && (
                          <p className="text-xs text-gray-500 mt-1">Agent: {lead.agent_name}</p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;