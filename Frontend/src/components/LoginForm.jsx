import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useGoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';


const AuthForm = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setRole } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [googleResponse, setGoogleResponse] = useState(null);

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

    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/login',
        { email: formData.email, password: formData.password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        if (response.data.user) {
          localStorage.setItem('userId', response.data.user.userId);
          setUser(response.data.user.name);
          setRole(response.data.user.role);
          navigate('/dashboard');
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
      
      // 1. Get user info using access_token
      const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { 
          headers: { 
            Authorization: `Bearer ${response.access_token}` 
          } 
        }
      );

      // 2. Send both email and access_token to backend
      const backendResponse = await axios.post(
        'http://localhost:5000/api/users/google-login',
        {
          email: userInfo.data.email,
          access_token: response.access_token
        }
      );

      if (backendResponse.data.success) {
        localStorage.setItem('userId', backendResponse.data.user.userId);
        setUser(backendResponse.data.user.name);
        setRole(backendResponse.data.user.role);
        navigate('/dashboard');
      } else {
        setError(backendResponse.data.message || 'Account not registered');
      }
    } catch (err) {
      console.error('Google Login Error:', err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  },
  onError: (error) => {
    console.log('Google Login Failed:', error);
    setError('Google login failed. Please try again.');
  }
});

  return (
    <div className="w-full max-w-sm">
      <h2 className="block sm:hidden text-2xl font-bold text-center mb-2 text-[#F4A300]">
        Savanna
      </h2>

      <h2 className="text-3xl font-bold text-center mb-2 text-charcoal">
        Welcome Back
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Enter your email and password to access your account.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
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
        
        <div className="flex items-center justify-between text-sm">
          <>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-700">Remember Me</span>
            </label>
            <Link to="/forgot-password" className="text-[#F4A300] hover:underline">
                  Forgot Your Password?
                </Link>
          </>
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
          {isLoading ? 'Logging In...' : 'Log In'}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">Or Login With</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={() => googleLogin()}
          disabled={isLoading}
          className="flex-1 max-w-xs flex items-center justify-center border border-gray-300 rounded py-2 text-gray-700 hover:bg-gray-50 transition duration-200 disabled:opacity-50"
        >
          <FcGoogle className="mr-2 text-lg" /> Google
        </button>
      </div>

      <p className="text-center text-gray-600 text-sm mt-6">
        Don't have an account? Contact your administrator to be added.
      </p>
    </div>
  );
};

export default AuthForm;