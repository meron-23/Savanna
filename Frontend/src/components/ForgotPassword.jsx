import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/request-password-reset", { email });

      if (res.status === 200) {
        setSuccessMessage(res.data.message || "Password reset email sent!");
        setEmail("");
      } else {
        setError(res.data.message || "Something went wrong.");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || "Request failed");
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Forgot Your Password?</h2>
      <p className="text-center text-gray-600 mb-4">
        Enter your email and we’ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                       leading-tight focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
          />
        </div>

        {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#F4A300] text-white font-bold py-2 px-4 rounded focus:outline-none 
                      focus:shadow-outline transition duration-200 ${
                        isLoading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-opacity-90"
                      }`}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
