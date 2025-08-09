// Notification.jsx
import React, { useState } from 'react';
import Modal from './Modal'; // Import the new Modal component
import { Link } from 'react-router-dom';

const Notification = ({ notifications }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to show the modal
  const handleBellClick = () => {
    if (notifications.length > 0) {
      setIsModalOpen(true);
    }
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button 
          onClick={handleBellClick} 
          className="relative focus:outline-none"
          aria-label="Notifications"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0v2" />
          </svg>
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {notifications.length}
            </span>
          )}
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Your Assigned Leads">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No new leads to show.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((lead) => (
              <li key={lead.lead_id} className="py-4">
                <Link to={`/leads/${lead.lead_id}`} onClick={handleCloseModal} className="block hover:bg-gray-50 p-2 rounded-md">
                  <p className="text-sm font-medium text-gray-900">{lead.lead_name}</p>
                  <p className="text-xs text-gray-500">{lead.lead_interest}</p>
                  <p className="text-xs text-gray-500">Assigned: {new Date(lead.date_added).toLocaleDateString()}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </>
  );
};

export default Notification;