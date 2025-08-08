import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const Header = ({ isMobile, toggleSidebar, isSidebarOpen, user }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleClickOutside = (e) => {
    if (!e.target.closest('.profile-dropdown')) {
      setIsProfileOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
    // setIsProfileOpen(false);
  };

  React.useEffect(() => {
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);
  const notifications = [];

  return (
    <header className="bg-[#333333] text-white shadow-md fixed top-0 right-0 left-0 z-40">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left Section */}
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

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <NotificationBell notifications={notifications}/>

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 focus:outline-none"
              aria-label="User menu"
            >
              <div className="h-8 w-8 rounded-full bg-[#F4C430] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
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

            {/* Dropdown Menu */}
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
        </div>
      </div>
    </header>
  );
};

export default Header;