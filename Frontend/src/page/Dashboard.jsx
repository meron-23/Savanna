import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import DesktopSidebar from '../components/DesktopSidebar';
import SupervisorDashboard from './SupervisorPages/SupervisorDashboard';
import SalesDashboard from './SalesPages/SalesDashboard';
import AddProspect from '../components/AddProspect';
import ViewProspect from '../components/ViewProspect';
import ProfilePage from './ProfilePage';
import RegisterAgents from './SupervisorPages/RegisterAgents';
import OfficeSiteVisits from './SupervisorPages/OfficeSiteVisits';
import RegisterSalesData from './SupervisorPages/RegisterSalesData';
import ManagerDashboard from './ManagerPages/ManagerDashboard';
import RegisterUser from './ManagerPages/RegisterUser';
import SalesReport from './ManagerPages/SalesReport';
import VisitsReport from './ManagerPages/VisitsReport';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import AssignedLeadsTable from './SalesPages/AssignedLeadsTable';
import ProspectsDashboard from './ManagerPages/ProspectDashboard';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isProspectOpen, setIsProspectOpen] = useState(false);
  const [mainContent, setMainContent] = useState('Dashboard');
  const { role } = useContext(UserContext);

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
    setIsProspectOpen(false);

    // Handle role-specific navigation
    switch (item) {
      case 'Dashboard':
        setMainContent('Dashboard');
        break;
      case 'Prospect':
        setIsProspectOpen(!isProspectOpen);
        if (!isProspectOpen && !mainContent) {
          setMainContent('Dashboard');
        }
        break;
      case 'Leads':
        // Only allow leads for Sales role
        if (role === 'Sales Agent') {
          setMainContent('Leads');
        } else {
          setMainContent('Dashboard');
        }
        break;
      case 'RegisterAgents':
        setMainContent('RegisterAgents');
        break;
      case 'SiteVisits':
        setMainContent('SiteVisits');
        break;
      case 'Sales Agent':
        setMainContent('Sales Agent');
        break;
      case 'Home':
        setMainContent('Home');
        break;
      case 'RegisterUser':
        setMainContent('RegisterUser');
        break;
      case 'AddProspect':
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
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleProfileClick = (item) => {
    if (item === 'Profile') {
      setMainContent('ProfilePage');
      setIsProspectOpen(false);
    } else {
      setMainContent('Dashboard');
    }
  };

  // Role-based component rendering
  const renderMainContent = () => {
    // Common components for all roles
    switch (mainContent) {
      case 'AddProspectForm':
        return <AddProspect />;
      case 'ViewProspectsComponent':
        return <ViewProspect />;
      case 'ProfilePage':
        return <ProfilePage />;
      case 'Leads':
        // Only show leads for Sales role
        return role === 'Sales Agent' ? <AssignedLeadsTable /> : <SalesDashboard />;
        
      // Role-specific dashboard views
      case 'Dashboard':
        switch (role) {
          case 'Sales Agent':
            return <SalesDashboard />;
          case 'Supervisor':
            return <SupervisorDashboard />;
          case 'Manager':
            return <ManagerDashboard />;
          default:
            return <SalesDashboard />;
        }

      // Supervisor-specific components
      case 'RegisterAgents':
        return role === 'Supervisor' && <RegisterAgents />
      case 'SiteVisits':
        return role === 'Supervisor' && <OfficeSiteVisits />
      case 'Sales Agent':
        return role === 'Supervisor' && <RegisterSalesData />

      // Manager-specific components
      case 'Home':
        return role === 'Manager' && <ManagerDashboard />
      case 'RegisterUser':
        return role === 'Manager' && <RegisterUser />
      case 'ProspectReport':
        return role === 'Manager' && <ProspectsDashboard />
      case 'SalesReport':
        return role === 'Manager' && < SalesReport/>
      case 'ClientVisits':
        return role === 'Manager' && <VisitsReport />

      default:
        // Fallback to role-specific dashboard
        switch (role) {
          case 'Sales Agent':
            return <SalesDashboard />;
          case 'Supervisor':
            return <SupervisorDashboard />;
          case 'Manager':
            return <ManagerDashboard />;
          default:
            return <SalesDashboard />;
        }
    }
  };

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
          role={role}
        />

        <div className={`flex-1 flex flex-col md:pl-64 md:w-7xl`}>
          <main className={`flex flex-1 p-4 md:p-8 overflow-auto ${isSidebarOpen ? 'ms-0' : '-ml-40'}`}>
            <div className="flex-1 pr-0 md:pr-6 w-full pt-20">
              {renderMainContent()}
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