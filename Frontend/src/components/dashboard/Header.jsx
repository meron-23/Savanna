import React from 'react';

const Header = ({  isMobile, isSidebarOpen, handleItemClick }) => {
  const salesName = localStorage.getItem('name');

  return (
    <header className={`bg-white p-4 flex justify-between items-center border-b border-gray-200
      ${isSidebarOpen ? 'md:ms-64' : 'md:ms-20'} `}>
      <div className="hidden md:flex items-center space-x-4 md:w-1/3">
        
        <div className="flex items-center flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search..." className="flex-1 py-1 text-sm focus:outline-none ml-2" />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <button className="relative text-[#333333] hover:text-[#F4A300]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-[#F4A300] text-white text-xs px-1 rounded-full">3</span>
        </button>
        <button className="relative text-[#333333] hover:text-[#F4A300]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </button>
        <div className="flex items-center space-x-2">
          <img src="https://via.placeholder.com/32/charcoal/ffffff?text=JR" alt="Jason Ranti" className="w-8 h-8 rounded-full" />
          <button onClick={() => handleItemClick('ProfilePage')} className='cursor-pointer'>
            <span className="text-sm font-medium text-[#333333]">{salesName}</span>
          </button>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;