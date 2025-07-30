import React, { useState, useEffect } from 'react';
import AddProspect from '../components/dashboard/AddProspect';
import ViewProspect from '../components/dashboard/ViewProspect';
import Header from '../components/dashboard/Header';
import DesktopSidebar from '../components/dashboard/DesktopSidebar';
import MobileBottomNav from '../components/dashboard/MobileBottomNav';
import Footer from '../components/dashboard/Footer';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState('Prospect');
  const [isProspectOpen, setIsProspectOpen] = useState(false);
  const [mainContent, setMainContent] = useState('AddProspectForm');

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
    } else {
      setIsProspectOpen(false);
      setMainContent(null); 
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
      <Header  isMobile={isMobile} />

      <div className="flex flex-1 flex-col md:flex-row">
        <DesktopSidebar 
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          activeItem={activeItem}
          isProspectOpen={isProspectOpen}
          handleItemClick={handleItemClick}
          handleSubItemClick={handleSubItemClick}
        />

        <div className="flex-1 flex flex-col">
          <main className="flex flex-1 p-4 md:p-8 overflow-auto">
            <div className="flex-1 pr-0 md:pr-6 w-full">
              {mainContent === 'AddProspectForm' && <AddProspect />}
              {mainContent === 'ViewProspectsComponent' && <ViewProspect />}
            </div>
          </main>
        </div>

        {isMobile && (
          <MobileBottomNav 
            isSidebarOpen={isSidebarOpen}
            activeItem={activeItem}
            handleItemClick={handleItemClick}
            handleSubItemClick={handleSubItemClick}
          />
        )}
      </div>

      <Footer isMobile={isMobile} isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default Dashboard;