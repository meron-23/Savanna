// Main Layout Component (e.g., ManagerLayout.js)
import React from 'react';
import { useState } from 'react';
import DesktopSidebar from '../dashboard/DesktopSidebar';
import AddProspect from '../dashboard/AddProspect';
import RegiseterSalesData from '../dashboard/RegiseterSalesData';
import RegisterUser from '../dashboard/RegisterUser';
import VisitsReport from '../dashboard/VisitsReport';
 import ManagerDashboard from '../dashboard/ManagerDashboard';
// import ManagerDashboard from '../dashboard/ManagerDashboard';

import Header from '../dashboard/Header';

const ManagerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Home');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header (fixed) */}
      <Header 
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex pt-16"> {/* Account for header height */}
        {/* Sidebar (fixed) */}
        <DesktopSidebar
          isSidebarOpen={isSidebarOpen}
          activeItem={activeItem}
          handleItemClick={setActiveItem}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Main Content (flexible) */}
        <main className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
        } p-4`}>
          {activeItem === 'Home' && <ManagerDashboard />}
          {activeItem === 'RegisterUser' && <RegisterUser />}
          {activeItem === 'AddProspect' && <AddProspect />}
          {activeItem === 'ProspectReport' && <ManagerDashboard />}
          {activeItem === 'SalesReport' && <RegiseterSalesData />}
          {activeItem === 'ClientVisits' && <VisitsReport />}

          {/* Other content components */}
        </main>
      </div>
    </div>
  );
};
export default ManagerLayout;