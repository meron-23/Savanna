import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useGoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom'

// This component handles both login and registration
const AuthForm = () => {
  const navigate = useNavigate();
  // State to toggle between login and registration forms
  const [isRegistering, setIsRegistering] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, role, setRole } = useContext(UserContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '', 
    gender: '',
    role: '', 
    supervisor: '',
  });

  // State to hold the response from a successful Google login
  const [googleUser, setGoogleUser] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setError('');

    // Dynamically choose the API endpoint based on the form state
    const endpoint = isRegistering 
      ? 'http://localhost:5000/api/users' 
      : 'http://localhost:5000/api/users/login';
      
    // Dynamically choose the data to send to the backend
    const dataToSend = isRegistering 
      ? { 
          ...formData, 
          creationTime: new Date().toISOString(), 
          lastSignInTime: new Date().toISOString()
        } 
      : { email: formData.email, password: formData.password };
    
    try {
      const response = await axios.post(
        endpoint,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(response.data.message);
        
        if (response.data.user) {
          // This block runs on successful login
          localStorage.setItem('userId', response.data.user.userId);
          setUser(response.data.user.name);
          setRole(response.data.user.role);
          navigate('/dashboard');
        } else {
          // This block runs on successful registration
          // Reset form fields after successful registration
          setFormData({
            name: '',
            email: '',
            password: '',
            phoneNumber: '',
            gender: '',
            role: '',
            supervisor: '',
          });
          // After a successful registration, switch back to the login form
          setIsRegistering(false);
        }
      } else {
        setError(response.data.message || 'An unknown error occurred.');
      }
    } catch (err) {
      console.error('API Error:', err);

      if (err.response) {
        setError(err.response.data?.message || 'Request failed');
      } else if (err.request) {
        setError('Network error. Check your connection to the server.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

    const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setIsLoading(true);
        setError('');
        
        // Get user info using the access token
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${response.access_token}` } }
        );

        // Send the relevant user data to your backend
        const backendResponse = await axios.post(
          'http://localhost:5000/api/users/google-login',
          {
            email: userInfo.data.email,
            name: userInfo.data.name,
            googleId: userInfo.data.sub,
            picture: userInfo.data.picture
          }
        );

        if (backendResponse.data.success) {
          localStorage.setItem('userId', backendResponse.data.user.userId);
          setUser(backendResponse.data.user.name);
          setRole(backendResponse.data.user.role);
          navigate('/dashboard');
        } else {
          setError(backendResponse.data.message || 'Google login failed');
        }
      } catch (error) {
        console.error('Google login error:', error);
        setError('Failed to login with Google');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.log('Google login failed:', error);
      setError('Failed to login with Google');
    }
  });

  return (
    <div className="w-full max-w-sm">
      <h2 className="block sm:hidden text-2xl font-bold text-center mb-2 text-[#F4A300]">
        Savanna
      </h2>

      <h2 className="text-3xl font-bold text-center mb-2 text-charcoal">
        {isRegistering ? 'Create an Account' : 'Welcome Back'}
      </h2>
      <p className="text-center text-gray-600 mb-8">
        {isRegistering ? 'Sign up to get started.' : 'Enter your email and password to access your account.'}
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Registration-specific fields, shown conditionally */}
        {isRegistering && (
          <>
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                name="name"
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Full Name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
                required
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="123-456-7890"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
                required
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <div className="relative">
            <input
              name="email"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sellostore@company.com"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
              required
            />
          </div>
        </div>
        
        {isRegistering && (
          <>
            <div>
              <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                Role
              </label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
                required
              >
                <option value="">Select Role</option>
                <option value="Agent">Agent</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
          </>
        )}


        <div className="flex items-center justify-between text-sm">
          {!isRegistering && (
            <>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-gray-700">Remember Me</span>
              </label>
                <Link to="/forgot-password" className="text-[#F4A300] hover:underline">
                  Forgot Your Password?
                </Link>
            </>
          )}
        </div>
        
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#F4A300] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-opacity-90'
          }`}
        >
          {/* Change button text based on form state */}
          {isLoading ? (isRegistering ? 'Registering...' : 'Logging In...') : (isRegistering ? 'Register' : 'Log In')}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">Or {isRegistering ? 'Register' : 'Login'} With</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="flex space-x-4">
        {/* Updated Google login button */}
        <button 
          onClick={() => googleLogin()}
          className="flex-1 flex items-center justify-center border border-gray-300 rounded py-2 text-gray-700 hover:bg-gray-50 transition duration-200"
        >
          <FcGoogle className="mr-2 text-lg" /> Google
        </button>
        <button className="flex-1 flex items-center justify-center border border-gray-300 rounded py-2 text-gray-700 hover:bg-gray-50 transition duration-200">
          <FaApple className="mr-2 text-lg" /> Apple
        </button>
      </div>

      <p className="text-center text-gray-600 text-sm mt-6">
        {isRegistering ? (
          <>
            Already Have An Account?{' '}
            {/* Toggle to login form */}
            <button
              onClick={() => setIsRegistering(false)}
              className="text-[#F4A300] hover:underline font-bold"
            >
              Log In.
            </button>
          </>
        ) : (
          <>
            Don't Have An Account?{' '}
            {/* Toggle to registration form */}
            <button
              onClick={() => setIsRegistering(true)}
              className="text-[#F4A300] hover:underline font-bold"
            >
              Register Now.
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthForm;
