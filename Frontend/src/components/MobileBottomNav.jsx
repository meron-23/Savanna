import React, { useState } from 'react';

const MobileBottomNav = ({ 
  activeItem,
  handleItemClick,
  handleSubItemClick
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

  const navItems = [
    { 
      name: 'Prospect', 
      icon: (
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      ),
      subItems: [
        { name: 'Add', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /> },
        { name: 'View', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> }
      ]
    },
    { 
      name: 'Inbox', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-1 13a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v13z" /> 
    },
    { 
      name: 'Lesson', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.523 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.523 18.246 18 16.5 18s-3.332.477-4.5 1.253" /> 
    },
    { 
      name: 'Task', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> 
    },
    { 
      name: 'Group', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h2a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2m0 0a2 2 0 100 4 2 2 0 000-4zm0 0l-2.5-2.5M17 20h2a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2m0 0a2 2 0 100 4 2 2 0 000-4zm0 0l-2.5-2.5M7 13h10v4H7v-4zm0 0a2 2 0 100-4 2 2 0 000 4zm0 0l-2.5-2.5M17 13h10v4H7v-4zm0 0a2 2 0 100-4 2 2 0 000 4zm0 0l-2.5-2.5M7 7h10v4H7V7zm0 0a2 2 0 100-4 2 2 0 000 4zm0 0l-2.5-2.5M17 7h10v4H7V7zm0 0a2 2 0 100-4 2 2 0 000 4zm0 0l-2.5-2.5" /> 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#333333] border-t border-gray-700 shadow-lg z-50">
      {/* Submenu overlay when expanded */}
      {/* {expandedItem && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setExpandedItem(null)}
        />
      )} */}

      {/* Main navigation */}
      <nav className="relative z-50 bg-[#333333]">
        <ul className="flex justify-around">
          {navItems.map((item) => (
            <li key={item.name} className="relative flex-1">
              <button
                className={`w-full flex flex-col items-center py-3 px-1 ${
                  activeItem === item.name ? 'text-[#F4A300]' : 'text-gray-300'
                }`}
                onClick={() => toggleItem(item.name)}
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

              {/* Submenu for Prospect */}
              {expandedItem === item.name && item.subItems && (
                <div className="absolute bottom-full left-28 transform -translate-x-1/2 mb-2 w-48 bg-[#444] rounded-lg shadow-xl z-50">
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