import React from 'react';
import { HomeIcon, UserAddIcon, FolderAddIcon, ViewListIcon, OfficeBuildingIcon, CashIcon } from '@heroicons/react/outline';

const MobileBottomNav = ({ activeItem, handleItemClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50 md:hidden">
      <button 
        onClick={() => handleItemClick('Dashboard')}
        className={`flex flex-col items-center p-2 ${activeItem === 'Dashboard' ? 'text-[#F4A300]' : 'text-gray-600'}`}
      >
        <HomeIcon className="h-6 w-6" />
        <span className="text-xs mt-1">Dashboard</span>
      </button>
      
      <button 
        onClick={() => handleItemClick('RegisterAgents')}
        className={`flex flex-col items-center p-2 ${activeItem === 'RegisterAgents' ? 'text-[#F4A300]' : 'text-gray-600'}`}
      >
        <UserAddIcon className="h-6 w-6" />
        <span className="text-xs mt-1">Agents</span>
      </button>
      
      <button 
        onClick={() => handleItemClick('AddProspect')}
        className={`flex flex-col items-center p-2 ${activeItem === 'AddProspect' ? 'text-[#F4A300]' : 'text-gray-600'}`}
      >
        <FolderAddIcon className="h-6 w-6" />
        <span className="text-xs mt-1">Add Prospect</span>
      </button>
      
      <button 
        onClick={() => handleItemClick('SiteVisits')}
        className={`flex flex-col items-center p-2 ${activeItem === 'SiteVisits' ? 'text-[#F4A300]' : 'text-gray-600'}`}
      >
        <OfficeBuildingIcon className="h-6 w-6" />
        <span className="text-xs mt-1">Visits</span>
      </button>
      
      <button 
        onClick={() => handleItemClick('Sales')}
        className={`flex flex-col items-center p-2 ${activeItem === 'Sales' ? 'text-[#F4A300]' : 'text-gray-600'}`}
      >
        <CashIcon className="h-6 w-6" />
        <span className="text-xs mt-1">Sales</span>
      </button>
    </div>
  );
};

export default MobileBottomNav;