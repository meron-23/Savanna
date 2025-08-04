import React, { useState, useEffect } from 'react';
import AddProspect from '../components/dashboard/AddProspect';
import ViewProspect from '../components/dashboard/ViewProspect';
import Header from '../components/dashboard/Header';
import DesktopSidebar from '../components/dashboard/DesktopSidebar';
import MobileBottomNav from '../components/dashboard/MobileBottomNav';
import Footer from '../components/dashboard/Footer';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import AssignedLeadsTable from '../components/dashboard/AssignedLeadsTable';
import ProfilePage from '../components/dashboard/ProfilePage';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState('Prospect');
  const [isProspectOpen, setIsProspectOpen] = useState(false);
  const [mainContent, setMainContent] = useState('');

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
    
    // Reset prospect submenu state when clicking on any main item
    setIsProspectOpen(false);

    if (item === 'Prospect') {
      setIsProspectOpen(!isProspectOpen);
      if (!isProspectOpen && !mainContent) {
        // If Prospect menu is closed and no content is set, default to overview
        setMainContent('');
      } else if (isProspectOpen) {
        // If Prospect menu is open and we click it again to close, show overview
        setMainContent('');
      }
    } else if (item === 'Leads') { // <-- NEW CONDITION for the Leads button
      setMainContent('Leads'); // <-- This will set the state to 'Leads'
    } else {
      // For any other non-submenu main items (e.g., Inbox, Lesson)
      setMainContent(''); 
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

  const handleProfileClick = (item) => {
    if (item === 'Profile') {
      setMainContent('ProfilePage');
      setIsProspectOpen(false);
    } else {
       setMainContent('');
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-roboto bg-gray-100">
      <Header
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        handleItemClick={handleItemClick}
        handleProfileClick={handleProfileClick}
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
              {mainContent === 'Leads' && <AssignedLeadsTable />}
              {mainContent === 'ProfilePage' && <ProfilePage />}
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