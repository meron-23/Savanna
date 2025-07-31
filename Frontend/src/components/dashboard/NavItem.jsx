import React from 'react';

const NavItem = ({ 
  name,
  icon,
  isActive,
  isSidebarOpen,
  onClick,
  hasSubmenu = false,
  isSubmenuOpen = false,
  children
}) => {
  return (
    <li>
      <div
        className={`group flex items-center cursor-pointer px-2 py-2 rounded-lg relative ${
          isActive
            ? 'bg-[#F4A300] bg-opacity-20 text-[#333333] font-semibold'
            : 'text-white hover:text-[#F4A300]'
        }`}
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-3 flex-shrink-0"
          viewBox="0 0 24 24"
          fill={isActive ? 'currentColor' : 'none'}
          stroke="currentColor"
        >
          {icon}
        </svg>

        {isSidebarOpen && <span>{name}</span>}

        {!isSidebarOpen && (
          <span className="absolute left-2 -top-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white px-2 py-1 rounded shadow-md z-10">
            {name}
          </span>
        )}

        {hasSubmenu && isSidebarOpen && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ml-auto transform transition-transform ${isSubmenuOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
      {children}
    </li>
  );
};

export default NavItem;
