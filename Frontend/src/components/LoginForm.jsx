import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary login check (replace with real backend request later)
    if (formData.email === 'admin@example.com' && formData.password === 'password') {
      navigate('/dashboard');
    } else {
      alert('❌ Invalid email or password');
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
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            name="email"
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="sellostore@company.com"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-saffron"
            required
          />
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
              placeholder="Sellostore."
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
