import React from 'react';
import NavItem from './NavItem';

const DesktopSidebar = ({
  isSidebarOpen,
  activeItem,
  isProspectOpen,
  handleItemClick,
  toggleSidebar,
  user
}) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen pt-10 z-50 hidden md:flex flex-col bg-[#333333]
      ${isSidebarOpen ? 'w-64' : 'w-20'}
      p-4 transition-all duration-300 ease-in-out overflow-hidden`}
    >
      {/* Header Section */}
      <div className={`flex ${isSidebarOpen ? 'justify-around' : 'flex-col'} items-center ${isSidebarOpen ? 'mb-10' : 'mb-5'}`}>
        <div className="flex items-center gap-3 justify-center">
          <div className="bg-[#F4A300] rounded-lg p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          {isSidebarOpen && <span className="text-xl font-bold text-white">Savanna</span>}
        </div>
        <div className={`${isSidebarOpen ? 'mt-0 ml-2 self-end' : 'mt-4'}`}>
          <button onClick={toggleSidebar} className="text-gray-300 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Nav Section */}
      <nav className="mb-8 flex-grow">
        {isSidebarOpen && (
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4 px-2">MANAGEMENT</h3>
        )}
        <ul className="space-y-2">
          {/* Home */}
          <NavItem
            name="Home"
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            }
            isActive={activeItem === 'Home'}
            isSidebarOpen={isSidebarOpen}
            onClick={() => handleItemClick('Home')}
          />

          {/* Register User */}
          <NavItem
            name="Register User"
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            }
            isActive={activeItem === 'RegisterUser'}
            isSidebarOpen={isSidebarOpen}
            onClick={() => handleItemClick('RegisterUser')}
          />

          {/* Add Prospect */}
          <NavItem
            name="Add Prospect"
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            }
            isActive={activeItem === 'AddProspect'}
            isSidebarOpen={isSidebarOpen}
            onClick={() => handleItemClick('AddProspect')}
          />

          {/* Prospect Report */}
          <NavItem
            name="Prospect Report"
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            }
            isActive={activeItem === 'ProspectReport'}
            isSidebarOpen={isSidebarOpen}
            onClick={() => handleItemClick('ProspectReport')}
          />

          {/* Sales Report */}
          <NavItem
            name="Sales Report"
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            }
            isActive={activeItem === 'SalesReport'}
            isSidebarOpen={isSidebarOpen}
            onClick={() => handleItemClick('SalesReport')}
          />

          {/* Client Visits */}
          <NavItem
            name="Client Visits"
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            }
            isActive={activeItem === 'ClientVisits'}
            isSidebarOpen={isSidebarOpen}
            onClick={() => handleItemClick('ClientVisits')}
          />
        </ul>
      </nav>
      <h1 className={`font-bold ${isSidebarOpen ? 'text-base' : 'hidden'} mb-5 text-gray-300`}>{user?.name}</h1>
    </aside>
  );
};

export default DesktopSidebar;