import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import Header from '../components/dashboard/Header';
import DesktopSidebar from '../components/dashboard/DesktopSidebar';
import MobileBottomNav from '../components/dashboard/MobileBottomNav';
import AddProspect from '../components/AddProspectSupervisor';
import ViewProspects from '../components/ViewProspectSupervisor';
import Footer from '../../components/dashboard/Footer';
import { UserContext } from '../../context/UserContext';
import RegisterAgents from '../components/RegisterAgents';
import VisitsManagement from '../components/OfficeSiteVisits';
import SalesManagement from '../components/RegiseterSalesData';

const API_BASE_URL = 'http://localhost:3000/api';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isProspectOpen, setIsProspectOpen] = useState(false);
  const [agents, setAgents] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const handleResize = () => {
      const mobileBreakpoint = 768;
      const isNowMobile = window.innerWidth < mobileBreakpoint;
      setIsMobile(isNowMobile);
      
      if (isNowMobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user?.role === 'supervisor' && user?.userId) {
      loadAgents();
    }
  }, [user]);

  const loadAgents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/supervisor/${user.userId}/agents`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setAgents(response.data.data);
    } catch (error) {
      console.error('Failed to load agents:', error.response?.data?.message || error.message);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProspectDropdown = (e) => {
    e?.stopPropagation();
    const newIsProspectOpen = !isProspectOpen;
    setIsProspectOpen(newIsProspectOpen);
    
    // When opening the dropdown, default to ViewProspects if no prospect item is selected
    if (newIsProspectOpen && !['AddProspect', 'ViewProspects'].includes(activeItem)) {
      setActiveItem('ViewProspects');
    }
  };

  const handleItemClick = (item, e) => {
    e?.stopPropagation();
    setActiveItem(item);

    // Handle Prospect dropdown state
    if (item === 'Prospect') {
      return; // Let toggleProspectDropdown handle this
    } else if (item === 'AddProspect' || item === 'ViewProspects') {
      setIsProspectOpen(true);
    } else {
      setIsProspectOpen(false);
    }

    // Close sidebar on mobile for all items except Prospect toggle
    if (isMobile && item !== 'Prospect') {
      setIsSidebarOpen(false);
    }
  };

  const renderContent = () => {
    // If prospect dropdown is open but no prospect item is selected, default to ViewProspects
    if (isProspectOpen && !['AddProspect', 'ViewProspects'].includes(activeItem)) {
      return <ViewProspects />;
    }

    switch (activeItem) {
      case 'Dashboard':
        return <DashboardOverview supervisorId={user?.userId || 'pdHpZXgh03gM5Jslp4A7jstFyeb2'} />;
      case 'RegisterAgents':
        return <RegisterAgents supervisorId={user?.userId} onAgentRegistered={loadAgents} />;
      case 'AddProspect':
        return <AddProspect />;
      case 'ViewProspects':
        return <ViewProspects />;
      case 'SiteVisits':
        return <VisitsManagement />;
      case 'Sales':
        return <SalesManagement />;
      default:
        return <DashboardOverview supervisorId={user?.userId} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-roboto bg-gray-100">
      <Header 
        isMobile={isMobile} 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen} 
      />

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <DesktopSidebar 
            isSidebarOpen={isSidebarOpen}
            activeItem={activeItem}
            isProspectOpen={isProspectOpen}
            handleItemClick={handleItemClick}
            toggleSidebar={toggleSidebar}
            toggleProspectDropdown={toggleProspectDropdown}
            user={user}
          />
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleSidebar}
          />
        )}

        {/* Mobile Sidebar */}
        {isMobile && (
          <div 
            className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out 
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <DesktopSidebar 
              isSidebarOpen={true}
              activeItem={activeItem}
              isProspectOpen={isProspectOpen}
              handleItemClick={(item, e) => {
                handleItemClick(item, e);
                // Close sidebar for all items except Prospect toggle
                if (item !== 'Prospect') {
                  setIsSidebarOpen(false);
                }
              }}
              toggleSidebar={toggleSidebar}
              toggleProspectDropdown={toggleProspectDropdown}
              user={user}
            />
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${isSidebarOpen && !isMobile ? 'md:ml-64' : 'md:ml-20'}
          ${isMobile ? 'mt-16' : ''}`}
        >
          <div className="flex-grow p-4 md:p-6">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileBottomNav 
          activeItem={activeItem}
          handleItemClick={handleItemClick}
        />
      )}

      <Footer isMobile={isMobile} isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default Dashboard;