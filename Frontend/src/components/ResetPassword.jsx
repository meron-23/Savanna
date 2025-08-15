import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, useSearchParams, useParams } from 'react-router-dom';

// This is your corrected ResetPassword component.
// It is now designed to be rendered within a React Router <Route>.
const ResetPassword = () => {
  // useParams correctly gets the token from the URL path, e.g., /reset-password/12345
  const { token } = useParams();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // The email is still retrieved from the URL query parameters, e.g., ?email=user@example.com
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');

  // Get email from URL query
  useEffect(() => {
    const urlEmail = searchParams.get('email');
    if (urlEmail) setEmail(urlEmail);
  }, [searchParams]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Pre-flight checks for a valid link and matching passwords
    if (!token || !email) {
      setError('Invalid or expired password reset link.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/reset-password',
        { token, email, password: newPassword }
      );

      setMessage(response.data.message || 'Password has been reset successfully.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    }
  };

  // Render a message if the token or email are missing from the URL
  if (!token || !email) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
          <p className="text-red-600">Invalid or expired password reset link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleResetPassword}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-[#F4A300]">
          Set New Password
        </h2>

        {message && <p className="text-green-600 mb-2">{message}</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
        />

        <button
          type="submit"
          className="w-full bg-[#333333] text-white py-2 rounded hover:bg-[#555555] transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
