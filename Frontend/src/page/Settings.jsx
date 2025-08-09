import React, { useState } from 'react';
import { FiSettings, FiUser, FiLock, FiBell, FiMoon, FiSun } from 'react-icons/fi';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <FiSettings className="text-2xl mr-3 text-[#F4C430]" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <nav className="space-y-2">
              <button className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <FiUser className="mr-3" />
                Profile
              </button>
              <button className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <FiLock className="mr-3" />
                Security
              </button>
              <button className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <FiBell className="mr-3" />
                Notifications
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FiUser className="mr-2" />
                Account Settings
              </h2>

              <div className="space-y-6">
                {/* Profile Section */}
                <div>
                  <h3 className="font-medium mb-3">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">First Name</label>
                      <input 
                        type="text" 
                        className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        defaultValue="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Last Name</label>
                      <input 
                        type="text" 
                        className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        defaultValue="Doe"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Email</label>
                      <input 
                        type="email" 
                        className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        defaultValue="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferences Section */}
                <div>
                  <h3 className="font-medium mb-3">Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiMoon className="mr-2" />
                        <span>Dark Mode</span>
                      </div>
                      <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${darkMode ? 'bg-[#F4C430]' : 'bg-gray-300'}`}
                      >
                        <span className={`w-5 h-5 rounded-full transform transition-transform duration-300 ${darkMode ? 'translate-x-6 bg-gray-900' : 'translate-x-1 bg-white'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiBell className="mr-2" />
                        <span>Notifications</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifications}
                        onChange={() => setNotifications(!notifications)}
                        className="h-5 w-5 text-[#F4C430] rounded focus:ring-[#F4C430]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiSun className="mr-2" />
                        <span>Email Updates</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={emailUpdates}
                        onChange={() => setEmailUpdates(!emailUpdates)}
                        className="h-5 w-5 text-[#F4C430] rounded focus:ring-[#F4C430]"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                  <button className="px-6 py-2 bg-[#F4C430] text-white rounded-lg hover:bg-[#e6b82a] transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;