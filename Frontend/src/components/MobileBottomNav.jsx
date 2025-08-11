import React, { useState } from 'react';

// Define common sub-items for the "Prospect" dropdown
const prospectSubItems = [
  { name: 'Add', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /> },
  { name: 'View', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> },
];

// Define nav items for the Sales Agent role
const salesNavItems = [
  { 
    name: 'Dashboard',
    path: 'Dashboard',
    icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    )
  },
  // Prospect will be inserted manually to handle its submenu
  { 
    name: 'Leads',
    path: 'Leads',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h2a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2m0 0a2 2 0 100 4 2 2 0 000-4zm0 0l-2.5-2.5M7 13h10v4H7v-4zm0 0a2 2 0 100-4 2 2 0 000 4zm0 0l-2.5-2.5M7 7h10v4H7V7zm0 0a2 2 0 100-4 2 2 0 000 4zm0 0l-2.5-2.5" />
    )
  },
  {
    name: 'Prospect',
    icon: (
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    ),
    subItems: prospectSubItems,
  }
];

// Define nav items for the Supervisor role
const supervisorNavItems = [
  {
    name: 'Dashboard',
    path: 'Dashboard',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  },
  {
    name: 'Register-agents',
    path: 'RegisterAgents',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />,
  },
  {
    name: 'Prospect',
    icon: (
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    ),
    subItems: prospectSubItems,
  },
  {
    name: 'Assign Leads',
    path: 'AssignLeads',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
  },
  {
    name: 'Office and Site Visits',
    path: 'SiteVisits',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
  },
  {
    name: 'Sales',
    path: 'Sales',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
];

// Define nav items for the Manager role
const managerNavItems = [
  {
    name: 'Home',
    path: 'Home',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  },
  {
    name: 'Register User',
    path: 'RegisterUser',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />,
  },
  {
    name: 'Add Prospect',
    path: 'AddProspect',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
  },
  {
    name: 'Assign Leads',
    path: 'AssignLeads',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
  },
  {
    name: 'Prospect Report',
    path: 'ProspectReport',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  },
  {
    name: 'Sales Report',
    path: 'SalesReport',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
  },
  {
    name: 'Client Visits',
    path: 'ClientVisits',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
  },
];

const MobileBottomNav = ({
  role, // New prop to determine the user's role
  activeItem,
  handleItemClick,
  handleSubItemClick,
}) => {
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleItem = (itemName) => {
    if (expandedItem === itemName) {
      setExpandedItem(null);
    } else {
      setExpandedItem(itemName);
      handleItemClick(itemName);
    }
  };

  // Select the correct nav items based on the user's role
  let navItems = [];
  if (role === 'Sales Agent') {
    navItems = salesNavItems;
  } else if (role === 'Supervisor') {
    navItems = supervisorNavItems;
  } else if (role === 'Manager') {
    navItems = managerNavItems;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#333333] border-t border-gray-700 shadow-lg z-50">
      <nav className="relative z-50 bg-[#333333]">
        <ul className="flex justify-around">
          {navItems.map((item) => (
            <li key={item.name} className="relative flex-1">
              <button
                className={`w-full flex flex-col items-center py-3 px-1 ${
                  activeItem === item.name || (item.subItems && (activeItem === 'Add' || activeItem === 'View')) ? 'text-[#F4A300]' : 'text-gray-300'
                }`}
                onClick={() => {
                  if (item.subItems) {
                    toggleItem(item.name);
                  } else {
                    handleItemClick(item.path);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill={item.name === 'Prospect' ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {item.icon}
                </svg>
                <span className="text-xs mt-1">{item.name}</span>
              </button>

              {/* Submenu for items with subItems (e.g., Prospect for Sales/Supervisor) */}
              {expandedItem === item.name && item.subItems && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-[#444] rounded-lg shadow-xl z-50">
                  <div className="py-1">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.name}
                        className="w-full flex items-center px-4 py-3 text-sm text-white hover:bg-[#F4A300] hover:text-black"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubItemClick(subItem.name);
                          setExpandedItem(null);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {subItem.icon}
                        </svg>
                        {subItem.name} Prospect
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MobileBottomNav;