import React from 'react';
import { Link } from 'react-router-dom';

const NavItem = ({
  name,
  icon,
  isActive,
  isSidebarOpen,
  hasSubmenu = false,
  isSubmenuOpen = false,
  children,
  onClick,
  className = ''
}) => {
  return (
    <li className={`nav-item ${className}`}>
      <button
        onClick={onClick}
        className={`flex items-center w-full p-2 rounded-lg transition-colors duration-200 ${
          isActive ? 'bg-[#F4A300] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
        aria-expanded={hasSubmenu ? isSubmenuOpen : undefined}
      >
        {/* Icon */}
        <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {icon}
          </svg>
        </span>

        {/* Text (shown when sidebar is open) */}
        {isSidebarOpen && (
          <span className="ml-3 whitespace-nowrap overflow-hidden overflow-ellipsis">
            {name}
          </span>
        )}

        {/* Submenu indicator */}
        {hasSubmenu && isSidebarOpen && (
          <span className="ml-auto">
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isSubmenuOpen ? 'transform rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        )}
      </button>

      {/* Submenu items */}
      {hasSubmenu && isSubmenuOpen && children}
    </li>
  );
};

export default NavItem;