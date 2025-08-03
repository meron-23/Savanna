import React, { useContext } from 'react';
import NotificationBell from './NotificationBell'; // Adjust the path if needed
import { UserContext } from '../../context/UserContext';



const Header = ({
    isMobile,
    isSidebarOpen,
    handleProfileClick
  }) => {
  // const userName = "Hana Abebawu";
  // const userRole = "Sales Agent";

  const { user } = useContext(UserContext);

  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  const notifications = []; // No demo notifications
  return (
    <header className=" text-white  p-4 flex justify-between items-center  border-gray-200 h-32 md:h-16">
      {/* Welcome Section */}
      <div className="flex flex-col justify-center items-start pl-4 sm:pl-6 h-full">
        {/* <h1 className="text-xl sm:text-2xl font-bold text-[#F4C430]">Welcome, {userName}!</h1>
        <p className="text-sm sm:text-md mt-1">Role: {userRole}</p>
        <p className="text-xs sm:text-sm text-gray-300">{formattedDate}</p> */}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 sm:space-x-6 pr-4 sm:pr-6 md:pt-8">
        <NotificationBell notifications={notifications} />

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          {/* <img src="https://via.placeholder.com/32/charcoal/ffffff?text=JR" alt="Jason Ranti" className="w-8 h-8 rounded-full" /> */}
          <button 
            onClick={() => handleProfileClick('Profile')}
            className='cursor-pointer'
          >
            <span className="text-sm font-medium text-[#333333]">{user}</span>
          </button>
          {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
