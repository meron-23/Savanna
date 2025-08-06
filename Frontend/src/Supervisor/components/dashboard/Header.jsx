import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isMobile, toggleSidebar, isSidebarOpen, handleProfileClick }) => {
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

        
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white relative">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <button 
            onClick={() => handleProfileClick('Profile')}
            className='cursor-pointer'
          >
            <span className="text-sm font-medium text-white">U</span>
          </button>

          <div className="relative">
            <button className="flex items-center space-x-2 focus:outline-none">
              {!isMobile && (
                <span className="text-gray-300 hover:text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              )}
            </button>

            
            <div className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
              <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
              <Link to="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;