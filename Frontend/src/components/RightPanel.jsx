// src/RightPanel.js
import React from 'react';
import loginImage from '../assets/loginpage.png'

const RightPanel = () => {
  return (
    <div className="text-center p-8">
      <h2 className="text-4xl font-bold mb-6">Effortlessly manage your team and operations.</h2>
      <p className="text-lg mb-8">
        Log in to access your CRM dashboard and manage your team.
      </p>
      <img
        src={loginImage} // Replace with the actual path to your image
        alt="CRM Dashboard Mockup"
        className="max-w-full h-auto mx-auto rounded-lg shadow-2xl"
      />
    </div>
  );
};

export default RightPanel;