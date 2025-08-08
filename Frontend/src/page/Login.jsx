// src/LoginPage.js
import React from 'react';
// import LoginForm from '../components/LoginForm';
import LoginForm from '../components/LoginForm';
import RightPanel from '../components/RightPanel';


const Login = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-roboto">
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <LoginForm />
      </div>

      {/* Right Panel - Marketing Info */}
    <div className="hidden lg:flex w-full lg:w-1/2 bg-[#333333] items-center justify-center p-8 text-white">
        <RightPanel />
    </div>
    </div>
  );
};


export default Login;