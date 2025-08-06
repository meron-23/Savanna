import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import Header from '../components/dashboard/Header';
import DesktopSidebar from '../components/dashboard/DesktopSidebar';
import MobileBottomNav from '../components/dashboard/MobileBottomNav'; // Uncommented and make sure this exists
import AddProspect from '../components/AddProspectSupervisor';
import ViewProspects from '../components/ViewProspectSupervisor';
import Footer from '../../components/dashboard/Footer';
import { UserContext } from '../../context/UserContext';
import RegisterAgents from '../components/RegisterAgents';
import VisitsManagement from '../components/OfficeSiteVisits';
import SalesManagement from '../components/RegiseterSalesData';

const API_BASE_URL = 'http://localhost:3000/api';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed on mobile
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
      
      // Auto-close sidebar on mobile, auto-open on desktop
      if (isNowMobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Initialize on first render
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

  const handleItemClick = (item) => {
    setActiveItem(item);
    if (item === 'Prospect') {
      setIsProspectOpen(!isProspectOpen);
    } else {
      setIsProspectOpen(false);
    }
    
    // Close sidebar when an item is clicked on mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const renderContent = () => {
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
        {/* Desktop Sidebar - hidden on mobile */}
        {!isMobile && (
          <DesktopSidebar 
            isSidebarOpen={isSidebarOpen}
            activeItem={activeItem}
            isProspectOpen={isProspectOpen}
            handleItemClick={handleItemClick}
            toggleSidebar={toggleSidebar}
            user={user}
          />
        )}

        {/* Mobile Sidebar Overlay - only shown on mobile when sidebar is open */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleSidebar}
          />
        )}

        {/* Mobile Sidebar - slides in from left */}
        {isMobile && (
          <div 
            className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out 
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <DesktopSidebar 
              isSidebarOpen={true} // Always show full sidebar on mobile when open
              activeItem={activeItem}
              isProspectOpen={isProspectOpen}
              handleItemClick={handleItemClick}
              toggleSidebar={toggleSidebar}
              user={user}
            />
          </div>
        )}

        {/* Main Content Area */}
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