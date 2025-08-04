import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();


  //   if (formData.email === 'admin@example.com' && formData.password === 'password') {
  //     navigate('/dashboard');
  //   } else {
  //     alert('Invalid email or password');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setSuccessMessage('');
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:3000/api/users/login',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setSuccessMessage(response.data.message);
        
        // Reset form with current dates
        setFormData({
          name: '',
          email: ''
        });
        navigate('/dashboard');
        localStorage.setItem('userId', response.data.user.userId);

        // set the name using context
        setUser(response.data.user.name)
        // console.log(response.data.user.userId);
      } else {
        setError(response.data.message || 'Failed to save prospect');
      }
    } catch (err) {
      console.error('API Error:', err);

      if (err.response) {
        if (err.response.status === 500) {
          setError('Server error. Please try again later or contact support.');
        } else {
          setError(err.response.data?.message || 'Request failed');
        }
      } else if (err.request) {
        setError('Network error. Check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-3xl font-bold text-center mb-2 text-charcoal">Welcome Back</h2>
      <p className="text-center text-gray-600 mb-8">
        Enter your email and password to access your account.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            name="name"
            type="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="sellostore"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-saffron"
            required
          />
        </div>

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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-saffron"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-gray-700">Remember Me</span>
          </label>
          <a href="#" className="text-saffron hover:underline">
            Forgot Your Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-[#F4A300] hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
        >
          Log In
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">Or Login With</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="flex space-x-4">
        <button className="flex-1 flex items-center justify-center border border-gray-300 rounded py-2 text-gray-700 hover:bg-gray-50 transition duration-200">
          <FcGoogle className="mr-2 text-lg" /> Google
        </button>
        <button className="flex-1 flex items-center justify-center border border-gray-300 rounded py-2 text-gray-700 hover:bg-gray-50 transition duration-200">
          <FaApple className="mr-2 text-lg" /> Apple
        </button>
      </div>

      <p className="text-center text-gray-600 text-sm mt-6">
        Don't Have An Account?{' '}
        <a href="#" className="text-saffron hover:underline">
          Register Now.
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
