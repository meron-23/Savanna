import React from 'react';
import NavItem from './NavItem';

const DesktopSidebar = ({
  isSidebarOpen,
  activeItem,
  isProspectOpen,
  handleItemClick,
  toggleSidebar,
  toggleProspectDropdown,
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
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4 px-2">OVERVIEW</h3>
        )}
        <ul className="space-y-2">
          {/* Dashboard */}
          <NavItem
            name="Dashboard"
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            }
            isActive={activeItem === 'Dashboard'}
            isSidebarOpen={isSidebarOpen}
            onClick={(e) => handleItemClick('Dashboard', e)}
            className="nav-item"
          />
          
          {/* Register Sales Agents */}
          <NavItem
            name="Register-agents"
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            }
            isActive={activeItem === 'RegisterAgents'}
            isSidebarOpen={isSidebarOpen}
            onClick={(e) => handleItemClick('RegisterAgents', e)}
            className="nav-item"
          />

          {/* Prospect */}
          <NavItem
            name="Prospect"
            icon={
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            }
            isActive={activeItem === 'Prospect' || activeItem === 'AddProspect' || activeItem === 'ViewProspects'}
            isSidebarOpen={isSidebarOpen}
            hasSubmenu={true}
            isSubmenuOpen={isProspectOpen}
            onClick={toggleProspectDropdown}
            className="nav-item"
          >
            {isProspectOpen && isSidebarOpen && (
              <ul className="ml-8 mt-2 space-y-2">
                <li
                  className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer ${
                    activeItem === 'AddProspect' ? 'text-[#F4A300]' : 'text-gray-300 hover:text-[#F4A300]'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick('AddProspect', e);
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Prospect</span>
                </li>
                <li
                  className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer ${
                    activeItem === 'ViewProspects' ? 'text-[#F4A300]' : 'text-gray-300 hover:text-[#F4A300]'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick('ViewProspects', e);
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View Prospects</span>
                </li>
              </ul>
            )}
          </NavItem>

          {/* Office Visits */}
          <NavItem
            name="Office and Site Visits"
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            }
            isActive={activeItem === 'SiteVisits'}
            isSidebarOpen={isSidebarOpen}
            onClick={(e) => handleItemClick('SiteVisits', e)}
            className="nav-item"
          />

          {/* Sales */}
          <NavItem
            name="Sales"
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            }
            isActive={activeItem === 'Sales'}
            isSidebarOpen={isSidebarOpen}
            onClick={(e) => handleItemClick('Sales', e)}
            className="nav-item"
          />
        </ul>
      </nav>
      <h1 className={`font-bold ${isSidebarOpen ? 'text-base' : 'hidden'} mb-5 text-gray-300`}>{user?.name}</h1>
    </aside>
  );
};

export default DesktopSidebar;