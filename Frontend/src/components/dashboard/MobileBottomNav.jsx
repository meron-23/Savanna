import React from 'react';

const MobileBottomNav = ({ 
  isSidebarOpen, 
  activeItem, 
  handleItemClick, 
  handleSubItemClick 
}) => {
  return (
    <aside className={`fixed bottom-0 left-0 right-0 bg-[#333333] border-t border-gray-200 flex flex-col p-4 shadow-lg transition-all duration-300 ease-in-out ${
      isSidebarOpen ? 'h-auto' : 'h-0 opacity-0'
    } overflow-hidden z-10`}>
      <nav className="mb-4">
        <ul className="flex justify-around space-x-2">
          <li 
            className={`flex flex-col items-center cursor-pointer px-2 py-2 rounded-lg ${
              activeItem === 'Prospect' ? 'text-[#F4A300]' : 'text-white'
            }`}
            onClick={() => handleSubItemClick('Add')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs mt-1">Prospect</span>
          </li>
          
          {[
            { name: 'Inbox', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-1 13a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v13z" /> },
            { name: 'Lesson', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.523 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.523 18.246 18 16.5 18s-3.332.477-4.5 1.253" /> },
            { name: 'Task', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
            { name: 'Group', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h2a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2m0 0a2 2 0 100 4 2 2 0 000-4zm0 0l-2.5-2.5M17 20h2a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2m0 0a2 2 0 100 4 2 2 0 000-4zm0 0l-2.5-2.5M7 13h10v4H7v-4zm0 0a2 2 0 100-4 2 2 0 000 4zm0 0l-2.5-2.5M17 13h10v4H7v-4zm0 0a2 2 0 100-4 2 2 0 000 4zm0 0l-2.5-2.5M7 7h10v4H7V7zm0 0a2 2 0 100-4 2 2 0 000 4zm0 0l-2.5-2.5M17 7h10v4H7V7zm0 0a2 2 0 100-4 2 2 0 000 4zm0 0l-2.5-2.5" /> },
          ].map((item) => (
            <li 
              key={item.name}
              className={`flex flex-col items-center cursor-pointer px-2 py-2 rounded-lg ${
                activeItem === item.name ? 'text-[#F4A300]' : 'text-gray-400'
              }`}
              onClick={() => handleItemClick(item.name)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {item.icon}
              </svg>
              <span className="text-xs mt-1">{item.name}</span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default MobileBottomNav;