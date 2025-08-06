import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import Header from '../components/dashboard/Header';
import DesktopSidebar from '../components/dashboard/DesktopSidebar';
// import MobileBottomNav from './MobileBottomNav';
import AddProspect from '../components/AddProspectSupervisor';
import ViewProspects from '../components/ViewProspectSupervisor'
import Footer from '../../components/dashboard/Footer';
import { UserContext } from '../../context/UserContext';
import RegisterAgents from '../components/RegisterAgents';
import VisitsManagement  from '../components/OfficeSiteVisits';
import SalesManagement from '../components/RegiseterSalesData';

const API_BASE_URL = 'http://localhost:3000/api';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isProspectOpen, setIsProspectOpen] = useState(false);
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [agents, setAgents] = useState([]);
  const { user } = useContext(UserContext);

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
    } else if (item === 'Visits') {
      setIsVisitOpen(!isVisitOpen);
    } else {
      setIsProspectOpen(false);
      setIsVisitOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'Dashboard':
        return <DashboardOverview supervisorId={'pdHpZXgh03gM5Jslp4A7jstFyeb2'} />;
      case 'RegisterAgents':
        return <RegisterAgents supervisorId={user?.userId} onAgentRegistered={loadAgents} />;
      case 'AddProspect':
        return <AddProspect />;
      case 'ViewProspects':
        return <ViewProspects />;
      case 'SiteVisits':
        return <VisitsManagement 
        />;
      case 'Sales':
        return <SalesManagement />;
      default:
        return <DashboardOverview supervisorId={user?.userId} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-roboto bg-gray-100">
      <Header isMobile={isMobile} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-1 flex-col md:flex-row">
        <DesktopSidebar 
          isSidebarOpen={isSidebarOpen}
          activeItem={activeItem}
          isProspectOpen={isProspectOpen}
          isVisitOpen={isVisitOpen}
          handleItemClick={handleItemClick}
          toggleSidebar={toggleSidebar}
          user={user}
        />

        <div className="flex-1 flex flex-col ml-10">
          <main className={`flex-grow ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} transition-all duration-300 ease-in-out`}>
            <div isSidebarOpen={isSidebarOpen}>
              {renderContent()}
            </div>
          </main>
        </div>

        {isMobile && (
          <MobileBottomNav 
            isSidebarOpen={isSidebarOpen}
            activeItem={activeItem}
            handleItemClick={handleItemClick}
          />
        )}
      </div>

      <Footer isMobile={isMobile} isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default Dashboard;