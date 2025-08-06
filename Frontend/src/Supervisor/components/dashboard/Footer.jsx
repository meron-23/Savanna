import React from 'react';

const Footer = ({ isMobile, isSidebarOpen }) => {
  return (
    <footer className={`bg-[#333333] text-white py-4 ${isMobile ? 'ml-0' : isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Savanna Sales Dashboard. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
            <a href="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
            <a href="/contact" className="text-gray-400 hover:text-white text-sm">Contact Us</a>
          </div>
        </div>

        {isMobile && (
          <div className="mt-4 pt-4 border-t border-gray-700 text-center">
            <p className="text-xs text-gray-500">
              Version 1.0.0 | Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;