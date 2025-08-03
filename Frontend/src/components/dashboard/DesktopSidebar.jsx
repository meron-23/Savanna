import React, { useContext } from 'react';
import NavItem from './NavItem';
import Header from './Header';
import { UserContext } from '../../context/UserContext';

//  const salesName = localStorage.getItem('name');
 const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

 const salesName = localStorage.getItem('name');
 const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

const DesktopSidebar = ({
  isSidebarOpen,
  activeItem,
  isProspectOpen,
  handleItemClick,
  handleSubItemClick,
  toggleSidebar,
}) => {
  const { user } = useContext(UserContext);
  return (
    // <aside
    //   className={`hidden md:flex -mt-[61px] pt-8 flex-col bg-[#333333] border-r border-gray-200 shadow-md 
    //     ${isSidebarOpen ? 'w-64' : 'w-20'} 
    //     p-4 transition-all duration-300 ease-in-out overflow-hidden`}
    // >
    <aside
      className={`fixed top-0 left-0 h-screen pt-10 z-50 hidden md:flex flex-col bg-[#333333]
      ${isSidebarOpen ? 'w-64' : 'w-20'} 
      p-4 transition-all duration-300 ease-in-out overflow-hidden`}
    >
      {/* Header Section */}
      <div className={`flex ${isSidebarOpen ? 'justify-around' : 'flex-col'}  items-center ${isSidebarOpen ? 'mb-10' : 'mb-5'}`}>
        <div className="flex items-center gap-3 justify-center">
          {/* Logo */}
          <div className="bg-[#F4A300] rounded-lg p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 
                1.152-.439 1.591 0L21.75 12M4.5 
                9.75v10.125c0 .621.504 1.125 
                1.125 1.125H9.75v-4.875c0-.621.504-1.125 
                1.125-1.125h2.25c.621 0 1.125.504 
                1.125 1.125V21h4.125c.621 0 1.125-.504 
                1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>

          {isSidebarOpen && (
            <span className="text-xl font-bold text-white">Savanna</span>
          )}
        </div>

        {/* Toggle Button */}
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
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4 px-2">
            OVERVIEW
          </h3>
        )}
        <ul className="space-y-2">
          <NavItem
            name="Prospect"
            icon={
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 
                1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 
                0 011 1v2a1 1 0 001 1h2a1 1 
                0 001-1v-6.586l.293.293a1 1 
                0 001.414-1.414l-7-7z"
              />
            }
            isActive={activeItem === 'Prospect'}
            isSidebarOpen={isSidebarOpen}
            onClick={() => handleItemClick('Prospect')}
            hasSubmenu={true}
            isSubmenuOpen={isProspectOpen}
          >
            {isProspectOpen && (
              <ul className={`ml-${isSidebarOpen ? '8' : '0'} mt-2 space-y-2`}>
                <li
                  className="flex items-center gap-2 text-gray-300 hover:text-[#F4A300] cursor-pointer px-2 py-2 rounded-lg"
                  onClick={() => handleSubItemClick('Add')}
                >
                  <svg className="w-4 h-4 ms-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  {isSidebarOpen && <span>Add Prospect</span>}
                </li>
                <li
                  className="flex items-center gap-2 text-gray-300 hover:text-[#F4A300] cursor-pointer px-2 py-2 rounded-lg"
                  onClick={() => handleSubItemClick('View')}
                >
                  <svg className="w-4 h-4 ms-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {isSidebarOpen && <span>View Prospect</span>}
                </li>
              </ul>
            )}
          </NavItem>
          <NavItem
            name="Leads"
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h2a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2m0 0a2 2 0 100 4 2 2 0 000-4zm0 0l-2.5-2.5M17 20h2a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2m0 0a2 2 0 100 4 2 2 0 000-4zm0 0l-2.5-2.5M7 13h10v4H7v-4zm0 0a2 2 0 100-4 2 2 0 000 4zm0 0l-2.5-2.5M17 13h10v4H7v-4zm0 0a2 2 0 100-4 2 2 0 000 4zm0 0l-2.5-2.5M7 7h10v4H7V7zm0 0a2 2 0 100-4 2 2 0 000 4zm0 0l-2.5-2.5M17 7h10v4H7V7zm0 0a2 2 0 100-4 2 2 0 000 4zm0 0l-2.5-2.5" />
            }
            isActive={activeItem === 'Leads'}
            isSidebarOpen={isSidebarOpen}
            onClick={() => handleItemClick('Leads')} // Direct click handler
          />
        </ul>
      </nav>
        <h1 className={`font-bold ${isSidebarOpen ? 'text-base' : 'hidden'} mb-5 text-gray-300`}>{user}</h1>
    </aside>
  );
};

export default DesktopSidebar;