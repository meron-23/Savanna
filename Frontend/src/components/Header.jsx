import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = ({ isMobile, toggleSidebar, isSidebarOpen, user }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  const [lastFetchedLeads, setLastFetchedLeads] = useState([]); // Used for comparison to find genuinely new leads
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [lastFetchedMessages, setLastFetchedMessages] = useState([]); // Used for comparison to find genuinely new messages
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [editText, setEditText] = useState('');
  const [activeTab, setActiveTab] = useState('leads');
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
      setMessages([]);
      setNewMessagesCount(0);
      setLastFetchedMessages([]); // Ensure this is reset too
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
    // When the bell is clicked, it means the user has seen the current notifications.
    // So, reset the counts.
    setNewLeadsCount(0);
    setNewMessagesCount(0);
    
    // Set the active tab based on user role
    if (currentUser?.role === 'Manager') {
      setActiveTab('messages');
    } else {
      setActiveTab('leads');
    }
    // Also, update lastFetchedMessages/Leads to current view to prevent re-counting
    // on next fetch if the modal is still open.
    // This is handled implicitly by fetchMessages running and updating lastFetchedMessages later.
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // When closing the modal, it's a good time to ensure the 'lastFetched' states are aligned
    // with what was just viewed, to avoid re-triggering notification count on next fetch.
    // However, the fetch interval will soon run and correctly update these.
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleCommentClick = (message) => {
    setSelectedMessage(message);
    setCommentText(message.comment || '');
    setIsCommentModalOpen(true);
  };

  const handleCommentSubmit = async () => {
    if (!selectedMessage || !commentText.trim()) return;

    try {
      const response = await axios.put(`http://localhost:5000/api/messages/comment/${selectedMessage.messageId}`, {
        comment: commentText.trim(),
        status: 'commented'
      });

      if (response.data.success) {
        setMessages(messages.map(msg => 
          msg.messageId === selectedMessage.messageId 
            ? { ...msg, comment: commentText.trim(), status: 'commented' }
            : msg
        ));
        setIsCommentModalOpen(false);
        setSelectedMessage(null);
        setCommentText('');
        // Re-fetch messages to ensure counts are accurate after a comment changes status
        fetchMessages();
      }
    } catch (error) {
      console.error("Error updating message comment:", error);
    }
  };

  const handleApproveClick = async (message) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/messages/approve/${message.messageId}`, {
        phone: message.phone_number,
        message: 'Your listing has been approved!'
      });

      if (response.data.success) {
        // Update the local state to change the status to 'approved'
        setMessages(messages.map(msg => 
          msg.messageId === message.messageId 
            ? { ...msg, status: 'approved' }
            : msg
        ));
        // Re-fetch messages to ensure the list reflects the new status
        // and it is no longer counted as 'new' for notifications.
        fetchMessages(); 
      }
    } catch (error) {
      console.error("Error approving message:", error);
    }
  };

  const handleEditClick = (message) => {
    setSelectedMessage(message);
    setEditText(message.content || '');
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedMessage || !editText.trim()) return;

    try {
      const response = await axios.put(`http://localhost:5000/api/messages/${selectedMessage.messageId}`, {
        content: editText.trim()
      });

      if (response.data.success) {
        setMessages(messages.map(msg => 
          msg.messageId === selectedMessage.messageId 
            ? { ...msg, content: editText.trim() }
            : msg
        ));
        
        setIsEditModalOpen(false);
        setSelectedMessage(null);
        setEditText('');
        fetchMessages(); // Re-fetch messages to update if content changes (less critical for badge, but good for data sync)
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleCloseCommentModal = () => {
    setIsCommentModalOpen(false);
    setSelectedMessage(null);
    setCommentText('');
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedMessage(null);
    setEditText('');
  };

  useEffect(() => {
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  // Fetch messages for all roles
  const fetchMessages = async () => {
    if (!currentUser) return;

    try {
      const response = await axios.get('http://localhost:5000/api/messages');
      
      if (response.data && Array.isArray(response.data.data)) {
        let allFetchedMessages = response.data.data;
        
        // Filter messages for display in the modal based on status
        let relevantMessagesForDisplay = allFetchedMessages.filter(msg => 
            msg.status === 'new' || msg.status === 'commented' || msg.status === 'approved'
        );

        // Agents filter messages to only see their own (if they are agent)
        if (currentUser.role === 'Sales Agent' || currentUser.role === 'Agent') {
          relevantMessagesForDisplay = relevantMessagesForDisplay.filter(msg => {
            const messageUserId = msg.userId || msg.user_id || msg.agentId || msg.agent_id;
            return messageUserId == currentUser.userId;
          });
        }

        // Calculate truly new unseen messages for the badge count
        const trulyNewMessagesForBadge = allFetchedMessages.filter(newMsg =>
            newMsg.status === 'new' &&
            // Check if this new message was NOT in the last fetched batch of messages
            !lastFetchedMessages.some(oldMsg => oldMsg.messageId === newMsg.messageId)
        );

        // Only update the notification count if the modal is not currently open.
        // This prevents the count from increasing while the user is viewing notifications.
        if (!isModalOpen && trulyNewMessagesForBadge.length > 0) {
            setNewMessagesCount(prev => prev + trulyNewMessagesForBadge.length);
        }

        // Update the main messages state for display in the modal
        setMessages(relevantMessagesForDisplay);
        // Update lastFetchedMessages to the full, unfiltered list from the API for the next comparison
        setLastFetchedMessages(allFetchedMessages); 
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    const fetchAssignedLeads = async () => {
      if (!currentUser || !currentUser.userId) return;

      // Don't fetch leads for managers
      if (currentUser.role === 'Manager') {
        setAssignedLeads([]);
        setNewLeadsCount(0);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/full-details');
        
        if (response.data && Array.isArray(response.data.data)) {
          let filteredLeads = [];
          
          const userRole = localStorage.getItem('role');
          const userId = localStorage.getItem('userId');

          filteredLeads = response.data.data.filter(lead => {
            if (userRole === 'Supervisor') {
              return (lead.agent_id === userId || 
                (lead.agent_role === 'Supervisor' && lead.agent_id === userId)) && lead.status === 'assigned';
            }
            else if (userRole === 'Sales Agent' || userRole === 'Agent') {
              return lead.agent_id === userId && 
                (lead.agent_role === 'Sales Agent' || lead.agent_role === 'Agent') && lead.status === 'assigned';
            }
            return false;
          });

          // Calculate truly new unseen leads for the badge count
          const newLeadsForBadge = filteredLeads.filter(newLead => 
            !lastFetchedLeads.some(oldLead => oldLead.lead_id === newLead.lead_id)
          );

          // Only update the notification count if the modal is not currently open.
          if (!isModalOpen && newLeadsForBadge.length > 0) {
            setNewLeadsCount(prev => prev + newLeadsForBadge.length);
          }

          setAssignedLeads(filteredLeads);
          setLastFetchedLeads(filteredLeads); // Update lastFetchedLeads to the latest fetched for accurate comparison next time
        }
      } catch (error) {
        console.error("Error fetching assigned leads:", error);
      }
    };

    fetchAssignedLeads();
    fetchMessages();

    // Set up interval for refreshing data
    const intervalId = setInterval(() => {
      fetchAssignedLeads();
      fetchMessages();
    }, 30000); // Fetch every 30 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [currentUser, lastFetchedLeads, lastFetchedMessages, isModalOpen]); // Added isModalOpen to dependencies


  // Calculate total notifications based on user role
  let totalNotifications = 0;
  if (currentUser) {
    if (currentUser.role !== 'Manager') {
      totalNotifications += newLeadsCount;
    }
    totalNotifications += newMessagesCount;
  }

  return (
    <header className="bg-[#333333] text-white shadow-md fixed top-0 right-0 left-0 z-40">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center">
          {(!isMobile || !isSidebarOpen) && (
            <Link to="/dashboard" className="flex items-center hover:no-underline">
              <div className="bg-[#F4A300] rounded-lg p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c.621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
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
                {totalNotifications > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {totalNotifications}
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-96 overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                Notifications
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b">
              {/* Only show leads tab for non-manager roles */}
              {currentUser?.role !== 'Manager' && (
                <button 
                  className={`flex-1 py-2 px-4 font-medium ${activeTab === 'leads' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => handleTabChange('leads')}
                >
                  Leads ({assignedLeads.length})
                </button>
              )}
              
              {/* Show messages tab for all roles */}
              <button 
                className={`flex-1 py-2 px-4 font-medium ${activeTab === 'messages' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => handleTabChange('messages')}
              >
                Messages ({messages.length})
              </button>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {/* Leads Tab Content - only show for non-managers */}
              {activeTab === 'leads' && currentUser?.role !== 'Manager' && (
                <div className="p-4">
                  {assignedLeads.length === 0 ? (
                    <p className="text-gray-500">No leads available</p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {assignedLeads.map((lead) => (
                        <li key={lead.lead_id} className="py-3">
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
              )}

              {/* Messages Tab Content - show for all roles */}
              {activeTab === 'messages' && (
                <div className="p-4 pb-10">
                  {messages.length === 0 ? (
                    <p className="text-gray-500">No messages available</p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {messages.map((message) => (
                        <li key={message.messageId} className="py-3">
                          <div className="p-2 rounded-md border border-gray-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  Message from Agent: {message.userId}
                                </p>
                                <p className="text-xs text-gray-500">Prospect ID: {message.prospectId}</p>
                                <p className="text-xs text-gray-500">Phone: {message.phone_number}</p>
                                <p className="text-sm text-gray-700 mt-2">{message.content}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Sent: {new Date(message.created_at).toLocaleString()}
                                </p>
                                {message.comment && message.status !== 'approved' && (
                                  <p className="text-sm text-blue-600 mt-2">
                                    <strong>Comment:</strong> {message.comment}
                                  </p>
                                )}
                                <p className="text-sm text-blue-600 mt-2">
                                  <strong>Status:</strong> {message.status}
                                </p>
                              </div>
                              <div className="flex flex-col space-y-2">
                                {currentUser?.role === 'Manager' && message.status !== 'approved' && (
                                  <button
                                    onClick={() => handleApproveClick(message)}
                                    className="ml-2 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                  >
                                    Approve
                                  </button>
                                )}
                                {(currentUser?.role === 'Supervisor' || currentUser?.role === 'Manager' && message.status !== 'approved') && (
                                  <button
                                    onClick={() => handleCommentClick(message)}
                                    className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                  >
                                    Comment
                                  </button>
                                )}
                                {(currentUser?.role === 'Sales Agent' || currentUser?.role === 'Agent') && (
                                  <button
                                    onClick={() => handleEditClick(message)}
                                    className="ml-2 px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                                  >
                                    Edit
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {isCommentModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">Add Comment</h3>
              <button onClick={handleCloseCommentModal} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-2">Message: {selectedMessage.content}</p>
              <p className="text-xs text-gray-500 mb-3">From Agent: {selectedMessage.userId}</p>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter your comment..."
                rows={4}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={handleCloseCommentModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCommentSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal for Agents */}
      {isEditModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">Edit Message</h3>
              <button onClick={handleCloseEditModal} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-3">From Agent: {selectedMessage.userId}</p>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Edit your message..."
                rows={4}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={handleCloseEditModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Message
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
