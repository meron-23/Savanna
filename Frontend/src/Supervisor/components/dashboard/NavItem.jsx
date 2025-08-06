import React from 'react';
import { NavLink } from 'react-router-dom';

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
    <li className="relative">
      <NavLink
        to="#"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-[#F4A300] text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        {/* Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 flex-shrink-0"
        >
          {icon}
        </svg>

        {/* Text (only shown when sidebar is open) */}
        {isSidebarOpen && (
          <span className="text-sm font-medium flex-grow">{name}</span>
        )}

        {/* Dropdown indicator (if has submenu) */}
        {hasSubmenu && isSidebarOpen && (
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isSubmenuOpen ? 'transform rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </NavLink>

      {/* Submenu items */}
      {hasSubmenu && isSubmenuOpen && children}
    </li>
  );
};

export default NavItem;