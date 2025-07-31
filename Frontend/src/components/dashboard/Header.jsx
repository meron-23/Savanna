import React from 'react';

const Header = ({ isMobile }) => {
  // Assuming you would get the user's name and role from authentication context or props
  const userName = "Hana Abebawu"; // Replace with dynamic data from backend/auth
  const userRole = "Sales Agent"; // Replace with dynamic data from backend/auth
  
  // Get the current date formatted as "Wednesday, July 30, 2025"
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options); // Uses current date

  return (
    <header className="bg-[#333333] text-white p-4 flex justify-between items-center border-b border-gray-200 h-32 md:h-24">
      {/* Welcome Section */}
      <div className="flex flex-col justify-center items-start pl-4 sm:pl-6 h-full"> {/* Adjusted padding-left for small screens */}
        <h1 className="text-xl sm:text-2xl font-bold text-[#F4C430]">Welcome, {userName}!</h1> {/* Responsive font size */}
        <p className="text-sm sm:text-md mt-1">Role: {userRole}</p> {/* Responsive font size */}
        <p className="text-xs sm:text-sm text-gray-300">{formattedDate}</p> {/* Responsive font size */}
      </div>

      {/* Existing Header content (notifications, user profile) */}
      <div className="flex items-center space-x-4 sm:space-x-6 pr-4 sm:pr-6"> {/* Adjusted padding-right and space-x for small screens */}
        {/* Notification Bell */}
        <button className="relative text-white hover:text-[#F4C430]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-[#F4C430] text-white text-xs px-1 rounded-full">3</span>
        </button>
        {/* Chat Icon */}
        <button className="relative text-white hover:text-[#F4C430]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </button>
        {/* User Profile (Hidden on mobile for cleaner look) */}
        <div className="hidden md:flex items-center space-x-2">
          <img src="https://via.placeholder.com/32/charcoal/ffffff?text=HA" alt={userName} className="w-8 h-8 rounded-full" />
          <span className="text-sm font-medium text-white">{userName}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;