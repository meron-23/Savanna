import React from 'react';

const Footer = ({ isMobile, isSidebarOpen }) => {
  return (
    <footer className={`bg-white shadow-sm p-4 text-center text-sm text-gray-600 border-t border-gray-200 ${
      isMobile && isSidebarOpen ? 'hidden' : 'block'
    }`}>
      <p>&copy; 2025 Savanna. All rights reserved.</p>
    </footer>
  );
};

export default Footer;