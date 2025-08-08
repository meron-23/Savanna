import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import { UserContext } from '../context/UserContext';
import DesktopSidebar from '../components/DesktopSidebar';
import SupervisorDashboard from './SupervisorPages/SupervisorDashboard';
import SalesDashboard from './SalesPages/SalesDashboard';
import AddProspect from '../components/AddProspect';
import ViewProspect from '../components/ViewProspect';
import ProfilePage from './ProfilePage';
import RegisterAgents from './SupervisorPages/RegisterAgents';
import OfficeSiteVisits from './SupervisorPages/OfficeSiteVisits';
import ManagerDashboard from './ManagerPages/ManagerDashboard';
import RegisterUser from './ManagerPages/RegisterUser';
import SalesReport from './ManagerPages/SalesReport';
import VisitsReport from './ManagerPages/VisitsReport';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import AssignedLeadsTable from './SalesPages/AssignedLeadsTable';
import ProspectsDashboard from './ManagerPages/ProspectDashboard';
import RegisterSalesData from './SupervisorPages/RegisterSalesData';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isProspectOpen, setIsProspectOpen] = useState(false);
  const [mainContent, setMainContent] = useState('Dashboard');
  const { user, role } = useContext(UserContext);

  const mobileBreakpoint = 768; // Consistent breakpoint

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);

      // On larger screens, ensure sidebar is open
      if (window.innerWidth >= mobileBreakpoint) {
        setIsSidebarOpen(true);
      } else {
        // On mobile, close sidebar by default unless specifically opened
        setIsSidebarOpen(false); 
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effect to close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile && mainContent !== 'Dashboard') { // Added condition to not close on initial dashboard load
      setIsSidebarOpen(false);
    }
  }, [mainContent, isMobile]);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    setIsProspectOpen(false); // Close prospect dropdown when main item is clicked

    // Handle role-specific navigation
    switch (item) {
      case 'Dashboard':
        setMainContent('Dashboard');
        break;
      case 'Prospect':
        // Toggle prospect dropdown, but don't change mainContent unless a sub-item is clicked
        setIsProspectOpen(!isProspectOpen);
        break;
      case 'Leads':
        if (role === 'Sales Agent') {
          setMainContent('Leads');
        } else {
          setMainContent('Dashboard'); // Fallback if role doesn't match
        }
        break;
      case 'RegisterAgents':
        setMainContent('RegisterAgents');
        break;
      case 'SiteVisits':
        setMainContent('SiteVisits');
        break;
      case 'Sales': // This seems to refer to RegisterSalesData
        setMainContent('Sales');
        break;
      case 'Dashboard': // This seems to refer to ManagerDashboard
        setMainContent('Dashboard');
        break;
      case 'RegisterUser':
        setMainContent('RegisterUser');
        break;
      case 'AddProspect': // This should ideally be handled by sub-item click or dedicated button
        setMainContent('AddProspectForm');
        break;
      case 'ProspectReport':
        setMainContent('ProspectReport');
        break;
      case 'SalesReport':
        setMainContent('SalesReport');
        break;
      case 'ClientVisits':
        setMainContent('ClientVisits');
        break;
      default:
        setMainContent('Dashboard');
    }
  };

  const handleSubItemClick = (subItem) => {
    if (subItem === 'Add') {
      setMainContent('AddProspectForm');
    } else if (subItem === 'View') {
      setMainContent('ViewProspectsComponent');
    }
    // Automatically close sidebar on mobile after a sub-item click
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleProfileClick = (item) => {
    if (item === 'Profile') {
      setMainContent('ProfilePage');
      setIsProspectOpen(false); // Close prospect dropdown
    } else {
      setMainContent('Dashboard');
    }
    // Close sidebar on mobile after profile click
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Role-based component rendering
  const renderMainContent = () => {
    switch (mainContent) {
      case 'AddProspectForm':
        return <AddProspect />;
      case 'ViewProspectsComponent':
        return <ViewProspect />;
      case 'ProfilePage':
        return <ProfilePage />;
      case 'Leads':
        return role === 'Sales Agent' ? <AssignedLeadsTable /> : <SalesDashboard />; // Fallback for non-sales
        
      case 'Dashboard':
        switch (role) {
          case 'Sales Agent':
            return <SalesDashboard />;
          case 'Supervisor':
            return <SupervisorDashboard />;
          case 'Manager':
            return <ManagerDashboard />;
          default:
            return <SalesDashboard />; // Default for unknown roles
        }

      // Supervisor-specific components (ensure role check is robust)
      case 'RegisterAgents':
        return role === 'Supervisor' ? <RegisterAgents /> : <SupervisorDashboard />; // Fallback
      case 'SiteVisits':
        return role === 'Supervisor' ? <OfficeSiteVisits /> : <SupervisorDashboard />; // Fallback
      case 'Sales': // Corresponds to RegisterSalesData
        return role === 'Supervisor' ? <RegisterSalesData /> : <SupervisorDashboard />; // Fallback

      // Manager-specific components (ensure role check is robust)
      case 'Dashboard': // Corresponds to ManagerDashboard
        return role === 'Manager' ? <ManagerDashboard /> : <ManagerDashboard />; // Fallback
      case 'RegisterUser':
        return role === 'Manager' ? <RegisterUser /> : <ManagerDashboard />; // Fallback
      case 'ProspectReport':
        return role === 'Manager' ? <ProspectsDashboard /> : <ManagerDashboard />; // Fallback
      case 'SalesReport':
        return role === 'Manager' ? <SalesReport /> : <ManagerDashboard />; // Fallback
      case 'ClientVisits':
        return role === 'Manager' ? <VisitsReport /> : <ManagerDashboard />; // Fallback

      default:
        // Fallback to role-specific dashboard if mainContent is unrecognized
        switch (role) {
          case 'Sales Agent':
            return <SalesDashboard />;
          case 'Supervisor':
            return <SupervisorDashboard />;
          case 'Manager':
            return <ManagerDashboard />;
          default:
            return <SalesDashboard />; // Final fallback
        }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-roboto bg-gray-100 overflow-hidden"> {/* Added overflow-hidden */}
      {/* Header (fixed at top) */}
      <Header
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        handleItemClick={handleItemClick}
        handleProfileClick={handleProfileClick}
        toggleSidebar={toggleSidebar}
        user={user}
      />

      <div className="flex flex-1 flex-col md:flex-row relative"> {/* Added relative for sidebar positioning context */}
        {/* Desktop Sidebar (sticky on desktop, hidden/overlay on mobile) */}
        <DesktopSidebar 
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          activeItem={activeItem}
          isProspectOpen={isProspectOpen}
          handleItemClick={handleItemClick}
          handleSubItemClick={handleSubItemClick}
          role={role}
          isMobile={isMobile} // Pass isMobile prop
        />

        {/* Main Content Area */}
        <div 
          className={`flex-1 flex flex-col pt-[64px] pb-[60px] md:pb-0 
                      ${isSidebarOpen && !isMobile ? 'md:ml-64' : 'md:ml-16'} 
                      overflow-y-auto max-h-screen`} // Added overflow-y-auto and max-h-screen
        >
          <main className="flex-1 p-4 md:p-8">
            <div className="flex-1 w-full">
              {renderMainContent()}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation (fixed at bottom) */}
        {isMobile && (
          <MobileBottomNav 
            isSidebarOpen={isSidebarOpen} // Pass to allow conditional rendering if needed
            activeItem={activeItem}
            handleItemClick={handleItemClick}
            handleSubItemClick={handleSubItemClick}
            isProspectOpen={isProspectOpen}
            role={role}
          />
        )}
      </div>

      {/* Footer (appears below content, pushed down by flex-1 on main content) */}
      <Footer isMobile={isMobile} isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default Dashboard;