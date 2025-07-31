import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('profile');
  const [isEditing, setIsEditing] = React.useState(false);
  const [profile, setProfile] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = React.useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    position: 'Sales Manager',
    department: 'Sales',
    location: 'New York, USA',
    bio: 'Experienced sales professional with 8+ years in the industry. Specializing in B2B sales and client relationship management.'
  });
//   console.log(localStorage.getItem('userId'));

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUserData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSave = () => {
//     setIsEditing(false);
//   };

useEffect(() => {
    const fetchProfile = async () => {
    const userId = localStorage.getItem('userId');

      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        if (!Array.isArray(responseData.data)) {
          throw new Error('API response data is not an array.');
        }

        setProfile(responseData.data);
      } catch (error) {
        console.error("Failed to fetch prospects:", error);
        setError("Failed to load prospects. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
}, []);



  return (
    <div className="flex h-screen bg-gray-100">
        {console.log(profile)}
      {/* Sidebar would be included here */}
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          {/* <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-[#F4A300]"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div> */}

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'profile' ? 'text-[#F4A300] border-b-2 border-[#F4A300]' : 'text-gray-600'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            {/* <button
              className={`py-2 px-4 font-medium ${activeTab === 'security' ? 'text-[#F4A300] border-b-2 border-[#F4A300]' : 'text-gray-600'}`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'notifications' ? 'text-[#F4A300] border-b-2 border-[#F4A300]' : 'text-gray-600'}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button> */}
          </div>

          {/* Profile Content */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden">
                    <img 
                      src="https://randomuser.me/api/portraits/men/1.jpg" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* {isEditing ? (
                    <button className="text-sm text-[#F4A300] font-medium">
                      Change Photo
                    </button>
                  ) : (
                    <button 
                      className="text-sm text-[#F4A300] font-medium"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  )} */}
                </div>

                {/* Profile Form */}
                <div>
                  {/* {isEditing ? ( */}
                    {/* <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                          <input
                            type="text"
                            name="position"
                            value={userData.position}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
                          />
                        </div>
                      </div>
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                          name="bio"
                          value={userData.bio}
                          onChange={handleInputChange}
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-[#F4A300] text-white rounded-md hover:bg-[#e69500]"
                        >
                          Save Changes
                        </button>
                      </div>
                    </> */}
                  {/* ) : ( */}
                  {profile.map((userData, index) => (
                    <div key={index}>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">{userData.name}</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-sm text-gray-500">name</p>
                                <p className="text-gray-800">{userData.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-gray-800">{userData.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="text-gray-800">{userData.phoneNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Role</p>
                                <p className="text-gray-800">{userData.role}</p>
                            </div>
                            </div>
                            <div className="mb-6">
                                <p className="text-sm text-gray-500">creationTime</p>
                                <p className="text-gray-800">{userData.creationTime.slice(0, 10)}</p>
                            </div>
                            {/* <div className="mb-6">
                                <p className="text-sm text-gray-500">lastSignInTime</p>
                                <p className="text-gray-800">{userData.lastSignInTime.slice(0, 10)}</p>
                            </div> */}
                        {/* <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-[#F4A300] text-white rounded-md hover:bg-[#e69500]"
                        >
                        Edit Profile
                        </button> */}
                    </div>
                    ))}

                  {/* )} */}
                </div>
              </div>
            </div>
          )}

          {/* Security Content */}
          {/* {activeTab === 'security' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Password</h3>
                  <button className="px-4 py-2 bg-[#F4A300] text-white rounded-md hover:bg-[#e69500]">
                    Change Password
                  </button>
                </div>
                
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Two-Factor Authentication</h3>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600">Status:</span>
                    <span className="text-red-500 font-medium">Disabled</span>
                    <button className="ml-4 px-4 py-2 bg-[#F4A300] text-white rounded-md hover:bg-[#e69500]">
                      Enable 2FA
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Active Sessions</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Chrome on Windows</p>
                        <p className="text-sm text-gray-500">New York, USA • Last active 2 hours ago</p>
                      </div>
                      <button className="text-red-500 hover:text-red-700">
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {/* Notifications Content */}
          {/* {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Prospects</p>
                        <p className="text-sm text-gray-500">Get notified when new prospects are added</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F4A300]"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Task Assignments</p>
                        <p className="text-sm text-gray-500">Get notified when you're assigned a new task</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F4A300]"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Reports</p>
                        <p className="text-sm text-gray-500">Get weekly performance reports</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F4A300]"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">In-App Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Message Alerts</p>
                        <p className="text-sm text-gray-500">Show notifications for new messages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F4A300]"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Reminders</p>
                        <p className="text-sm text-gray-500">Show notifications for upcoming tasks</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F4A300]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;