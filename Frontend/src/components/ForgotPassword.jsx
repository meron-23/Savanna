import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/users/forgot-password', { email });
      setSuccessMessage(res.data.message || 'Password reset email sent!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-charcoal">Forgot Your Password?</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
          />
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#F4A300] text-white font-bold py-2 px-4 rounded transition duration-200 ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-opacity-90'
            }`}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <button onClick={() => navigate('/')} className="mt-4 w-full text-[#F4A300] hover:underline text-sm">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;

