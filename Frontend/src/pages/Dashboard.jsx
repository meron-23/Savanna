import React, { useState, useEffect } from 'react';
import AddProspect from '../components/dashboard/AddProspect';
import ViewProspect from '../components/dashboard/ViewProspect';
import Header from '../components/dashboard/Header';
import DesktopSidebar from '../components/dashboard/DesktopSidebar';
import MobileBottomNav from '../components/dashboard/MobileBottomNav';
import Footer from '../components/dashboard/Footer';

import DashboardOverview from '../components/dashboard/DashboardOverview'; // Import the new overview component


const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState('Prospect');
  const [isProspectOpen, setIsProspectOpen] = useState(false);
  const [mainContent, setMainContent] = useState(''); // Default to empty string to show overview

  useEffect(() => {
    const handleResize = () => {
      const mobileBreakpoint = 768;
      setIsMobile(window.innerWidth < mobileBreakpoint);

      if (window.innerWidth >= mobileBreakpoint) {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    if (item === 'Prospect') {
      setIsProspectOpen(!isProspectOpen);

      // If clicking 'Prospect' and it has sub-items, we don't immediately change mainContent.
      // The sub-item click will determine the mainContent.
      // If it's a direct navigation item without sub-items, you might set mainContent directly here.
      if (!isProspectOpen && !mainContent) { // If Prospect menu is closed and no content is set, default to overview
        setMainContent('');
      } else if (isProspectOpen) { // If Prospect menu is open and we click it again to close, show overview
        setMainContent('');
      }
    } else {
      setIsProspectOpen(false);
      setMainContent(''); // Show overview when other main items are clicked

    }
  };

  const handleSubItemClick = (subItem) => {
    if (subItem === 'Add') {
      setMainContent('AddProspectForm');
    } else if (subItem === 'View') {
      setMainContent('ViewProspectsComponent');
    }
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-roboto bg-gray-100">

      <Header
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 flex-col md:flex-row">
        <DesktopSidebar 
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          activeItem={activeItem}
          isProspectOpen={isProspectOpen}
          handleItemClick={handleItemClick}
          handleSubItemClick={handleSubItemClick}
        />

        <div className="flex-1 flex flex-col md:ml-64">
          <main className={`flex flex-1 p-4 md:p-8 overflow-auto ${isSidebarOpen ? 'ms-0' : '-ml-40'}`}>
            <div className="flex-1 pr-0 md:pr-6 w-full">
              {mainContent === '' && <DashboardOverview />}
              {mainContent === 'AddProspectForm' && <AddProspect />}
              {mainContent === 'ViewProspectsComponent' && <ViewProspect />}
              {/* Render DashboardOverview if no specific form is active */}
              {mainContent === '' && <DashboardOverview />}
            </div>
          </main>
        </div>

        {isMobile && (
          <MobileBottomNav 
            isSidebarOpen={isSidebarOpen}
            activeItem={activeItem}
            handleItemClick={handleItemClick}
            handleSubItemClick={handleSubItemClick}
            isProspectOpen={isProspectOpen}
          />
        )}
      </div>

      <Footer isMobile={isMobile} isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default Dashboard;