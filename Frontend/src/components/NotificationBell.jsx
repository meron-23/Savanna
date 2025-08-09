import React, { useState, useRef, useEffect } from 'react';

const NotificationBell = ({ notifications = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative " ref={bellRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-[#F4C430] hover:text-[#F4C430] focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#F4C430] text-white text-xs px-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#333333] text-white rounded shadow-lg z-50">
          <div className="p-3 border-b-[#ccc] font-semibold text-white">Notifications</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No notifications</div>
          ) : (
            <ul className="max-h-48 overflow-y-auto text-sm">
              {notifications.map((note, index) => (
                <li key={index} className="p-3 border-b hover:bg-gray-100">
                  {note}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
