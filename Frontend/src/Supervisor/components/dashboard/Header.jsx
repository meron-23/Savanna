import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NotificationBell from '../../../components/dashboard/NotificationBell';

const Header = ({ isMobile, toggleSidebar, isSidebarOpen, handleProfileClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

   const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  const notifications = [];

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.profile-dropdown')) {
      setIsProfileOpen(false);
    }
  };

  // Add event listener when dropdown is open
  React.useEffect(() => {
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header className="bg-[#333333] text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo/Brand */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/" className="flex items-center">
            <div className="bg-[#F4A300] rounded-lg p-2 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <span className="text-xl font-bold ml-10">Savanna</span>
          </Link>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <NotificationBell notifications={notifications} />


          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white font-medium">U</span>
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
                  onClick={() => setIsProfileOpen(false)}
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