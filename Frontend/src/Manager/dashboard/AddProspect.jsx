import React, { useState } from 'react';

// Main App component
const App = () => {
  // State to manage form data for a new prospect
  const [prospectData, setProspectData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    interestedProperty: '',
    site: '',
    clientResponse: '',
    methodOfContact: '',
    remark: '',
    spreadsheetFile: null, // To hold the uploaded file
  });

  // State for messages (success or error)
  const [message, setMessage] = useState('');
  // State for loading indicator
  const [loading, setLoading] = useState(false);

  // Handle input changes and update prospect data state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProspectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setProspectData((prevData) => ({
      ...prevData,
      spreadsheetFile: e.target.files[0],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setMessage(''); // Clear previous messages
    setLoading(true); // Show loading indicator

    // In a real application, you would send this data to a backend API
    // using Axios or Fetch. For this example, we'll just simulate a submission.
    try {
      console.log('Submitting prospect data:', prospectData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setMessage('Prospect added successfully! 🎉');
      // Optionally clear the form after successful submission
      setProspectData({
        name: '',
        email: '',
        phoneNumber: '',
        interestedProperty: '',
        site: '',
        clientResponse: '',
        methodOfContact: '',
        remark: '',
        spreadsheetFile: null,
      });
      // Clear file input manually
      if (document.getElementById('spreadsheetFile')) {
        document.getElementById('spreadsheetFile').value = '';
      }
    } catch (error) {
      console.error('Error adding prospect:', error);
      setMessage(`Failed to add prospect: ${error.message || 'An unknown error occurred.'}`);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center font-inter">
      {/* Load Font Awesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      {/* Load Tailwind CSS */}
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>

      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <i className="fas fa-user-plus text-green-500 mr-3"></i> Add New Prospect
        </h2>

        {/* Display messages */}
        {message && (
          <div className={`p-4 mb-4 rounded-md text-center ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={prospectData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 pl-10 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter name"
                required
              />
              <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={prospectData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 pl-10 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email (optional)"
              />
              <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* Phone Number Field */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={prospectData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 pl-10 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., +251912345678 or 0912345678"
                required
              />
              <i className="fas fa-phone absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* Interested Property Field */}
          <div>
            <label htmlFor="interestedProperty" className="block text-sm font-medium text-gray-700 mb-1">Interested Property <span className="text-red-500">*</span></label>
            <div className="relative">
              <select
                id="interestedProperty"
                name="interestedProperty"
                value={prospectData.interestedProperty}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 pr-10 appearance-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Property</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
                <option value="Land">Land</option>
              </select>
              <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
          </div>

          {/* Site Field */}
          <div>
            <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-1">Site <span className="text-red-500">*</span></label>
            <div className="relative">
              <select
                id="site"
                name="site"
                value={prospectData.site}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 pr-10 appearance-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Site</option>
                <option value="Site A">Site A</option>
                <option value="Site B">Site B</option>
                <option value="Site C">Site C</option>
              </select>
              <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
          </div>

          {/* Client Response Field */}
          <div>
            <label htmlFor="clientResponse" className="block text-sm font-medium text-gray-700 mb-1">Client Response <span className="text-red-500">*</span></label>
            <div className="relative">
              <select
                id="clientResponse"
                name="clientResponse"
                value={prospectData.clientResponse}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 pr-10 appearance-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Response</option>
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Follow Up">Follow Up</option>
              </select>
              <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
          </div>

          {/* Method of Contact Field */}
          <div>
            <label htmlFor="methodOfContact" className="block text-sm font-medium text-gray-700 mb-1">Method of Contact <span className="text-red-500">*</span></label>
            <div className="relative">
              <select
                id="methodOfContact"
                name="methodOfContact"
                value={prospectData.methodOfContact}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 pr-10 appearance-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Method</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Email">Email</option>
                <option value="In-person">In-person</option>
                <option value="Social Media">Social Media</option>
              </select>
              <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
          </div>

          {/* Remark Field */}
          <div>
            <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-1">Remark <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                id="remark"
                name="remark"
                value={prospectData.remark}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter remark"
                required
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="md:col-span-2 mt-4 border-t border-gray-200 pt-6">
            <p className="block text-sm font-medium text-gray-700 mb-2">Upload Excel or CSV file with prospect data</p>
            <input
              type="file"
              id="spreadsheetFile"
              name="spreadsheetFile"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden" // Hide default file input
            />
            <label
              htmlFor="spreadsheetFile"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 cursor-pointer transition duration-150 ease-in-out"
            >
              <i className="fas fa-upload mr-2"></i> Import from Spreadsheet
            </label>
            {prospectData.spreadsheetFile && (
              <span className="ml-3 text-sm text-gray-600">{prospectData.spreadsheetFile.name}</span>
            )}
            <p className="mt-2 text-xs text-gray-500">Supported formats: .xlsx, .xls, .csv</p>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="w-full md:w-auto bg-green-700 text-white px-8 py-3 rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center justify-center"
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i> Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i> Submit Prospect Information
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
