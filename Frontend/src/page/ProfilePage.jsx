import React, { useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { UserContext } from '../../context/UserContext';



const ProfilePage = () => {
  // const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState("https://randomuser.me/api/portraits/men/1.jpg");
  // const { setUser } = useContext(UserContext);

  // State for controlling modal visibility
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePhotoModal, setShowChangePhotoModal] = useState(false);
  
  // State for form data (for editing profile)
  const [editFormData, setEditFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

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

      // localStorage.setItem('name', responseData.data[0].name)
      // setUser to the context
      // setUser(responseData.data[0].name)
      setProfile(responseData.data[0]);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setError("Failed to load profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  // Handler for opening the edit profile modal and populating form data
  const handleEditClick = () => {
    if (profile) {
      setEditFormData({
        name: profile.name,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        role: profile.role,
      });
    }
    setShowEditProfileModal(true);
  };
  
  // Handler for form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handler for form submission (e.g., updating profile)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      const updatedProfile = await response.json();
      // Update the local state with the new profile data
      // setProfile(updatedProfile.data);
      await fetchProfile();
      alert('Profile updated successfully!');
      // navigate('/dashboard');
      
      setShowEditProfileModal(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-gray-600">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  // const userData = profile[0];

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePhoto(imageUrl);
    }
  };


  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex border-b border-gray-200 mb-8">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'profile' ? 'text-[#F4A300] border-b-2 border-[#F4A300]' : 'text-gray-600'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
          </div>

          {/* Profile Content */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden">
                    <img
                      src={profilePhoto} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button 
                    onClick={() => setShowChangePhotoModal(true)}
                    className="text-sm text-[#F4A300] font-medium"
                  >
                    Change Photo
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">{profile.name}</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-gray-800">{profile.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-800">{profile.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="text-gray-800">{profile.role}</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm text-gray-500">creationTime</p>
                    <p className="text-gray-800">{profile.creationTime.slice(0, 10)}</p>
                  </div>
                  <button
                    onClick={handleEditClick}
                    className="px-4 py-2 bg-[#F4A300] text-white rounded-md hover:bg-[#e69500]"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleFormChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleFormChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editFormData.phoneNumber}
                    onChange={handleFormChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#F4A300] rounded-md hover:bg-[#e69500]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Photo Modal */}
      {showChangePhotoModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Change Profile Photo</h3>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
                <img 
                  src="https://randomuser.me/api/portraits/men/1.jpg" 
                  alt="Current Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="file"
                onChange={handlePhotoChange}
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => setShowChangePhotoModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-[#F4A300] rounded-md hover:bg-[#e69500]"
                onClick={() => {alert('Profile photo changed successfully!'); setShowChangePhotoModal(false);}}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;