import React, { useRef, useState } from 'react';
import axios from 'axios';

const AddProspect = () => {
  // Initialize form state
  const formatBackendDate = (date) => {
    const pad = (num) => num.toString().padStart(2, '0');
    const d = new Date(date);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  // Initialize form state with properly formatted dates
  const now = new Date();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    interest: '',
    method: '',
    site: '',
    comment: '',
    remark: '',
    periodTime: '',
    date: formatBackendDate(now),
    dateNow: formatBackendDate(now),
    userId: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [createdId, setCreatedId] = useState(null);

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
    setError('');
    setSuccess(false);
    setSuccessMessage('');
    setCreatedId(null);

    try {
      // Ensure dates are properly formatted before sending
      const dataToSend = {
        ...formData,
        date: formatBackendDate(formData.date),
        dateNow: formatBackendDate(new Date()) // Always use current time for dateNow
      };

      const response = await axios.post(
        'http://localhost:3000/api/prospects',
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setSuccessMessage(response.data.message);
        setCreatedId(response.data.id);
        
        // Reset form with current dates
        setFormData({
          name: '',
          phoneNumber: '',
          interest: '',
          method: '',
          site: '',
          comment: '',
          remark: '',
          periodTime: '',
          date: formatBackendDate(new Date()),
          dateNow: formatBackendDate(new Date()),
          userId: ''
        });
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
    } finally {
      setIsLoading(false);
    }
  };

  
  // State for spreadsheet import
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const fileInputRef = useRef(null);

   const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      readSpreadsheetFile(file);
    }
  };

  const readSpreadsheetFile = (file) => {
    setImportError('');
    setImportSuccess('');
    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        // Map spreadsheet columns to your prospect table columns
        // IMPORTANT: Adjust these column names based on your actual spreadsheet headers
        const prospectsToImport = json.map(row => ({
          name: row['Name'] || '', // Assuming 'Name' column in spreadsheet
          phoneNumber: row['Phone Number'] || '', // Assuming 'Phone Number'
          interest: row['Interest'] || '',
          method: row['Contact Method'] || '',
          site: row['Site'] || '',
          comment: row['Comment'] || '',
          remark: row['Remark'] || '',
          periodTime: row['Preferred Contact Time'] || '',
          // date and dateNow will be handled by backend or set to current time
          // userId needs to be added from the authenticated user context
          userId: formData.userId || 'staticUserId123' // REMOVE STATIC ID IN PROD
        }));

        // Send data to a new bulk import endpoint
        await importProspectsBulk(prospectsToImport);

      } catch (err) {
        console.error('Error reading/parsing spreadsheet:', err);
        setImportError('Failed to read or parse spreadsheet. Make sure it\'s a valid .xlsx, .xls, or .csv file with correct headers.');
      } finally {
        setIsImporting(false);
      }
    };

    reader.onerror = (error) => {
      console.error('File reader error:', error);
      setImportError('Error reading file. Please try again.');
      setIsImporting(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const importProspectsBulk = async (prospects) => {
    try {
      // You'll need a new backend endpoint for bulk import, e.g., /api/prospects/bulk
      const response = await axios.post(
        'http://localhost:5000/api/prospects/bulk', // <--- NEW BULK IMPORT ENDPOINT
        { prospects }, // Send an object with a 'prospects' array
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setImportSuccess(`Successfully imported ${response.data.importedCount} prospects.`);
        // Optionally, you might want to refresh the view prospects list here
      } else {
        setImportError(response.data.message || 'Failed to import prospects from spreadsheet.');
      }
    } catch (err) {
      console.error('API Error (Bulk Import):', err);
      if (err.response) {
        setImportError(err.response.data?.message || `Bulk import failed with status ${err.response.status}`);
      } else if (err.request) {
        setImportError('Network error during bulk import. Check your connection.');
      } else {
        setImportError('An unexpected error occurred during bulk import.');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8 md:ml-9 md:mt-8 w-full">
      <h2 className="text-xl font-bold text-[#333333] mb-4">Add New Prospect</h2>
      
      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage} (ID: {createdId})
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Field */}
        <div>
          <label htmlFor="prospectName" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="prospectName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="Enter prospect name"
            required
          />
        </div>

        {/* Phone Number Field */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="e.g., +1234567890"
            required
          />
        </div>

        {/* Interest Field */}
        <div>
          <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
            Interest
          </label>
          <input
            type="text"
            id="interest"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="e.g., UI/UX Design, Branding"
            required
          />
        </div>

        {/* Contact Method Field */}
        <div>
          <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Method
          </label>
          <select
            id="method"
            name="method"
            value={formData.method}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            required
          >
            <option value="">Select method</option>
            <option value="Call">Call</option>
            <option value="Email">Email</option>
            <option value="Meeting">Meeting</option>
            <option value="Office Visit">Office Visit</option>
            <option value="Site Visit">Site Visit</option>
            <option value="Telemarketing">Telemarketing</option>
            <option value="Social Media">Social Media</option>
            <option value="Survey">Survey</option>
            <option value="Referral">Referral</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Site Field */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-1">
            Site
          </label>
          <input
            type="text"
            id="site"
            name="site"
            value={formData.site}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="e.g., Website, Referral, Social Media"
            required
          />
        </div>

        {/* Comment Field */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="Add any relevant comments"
          ></textarea>
        </div>

        {/* Remark Field */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-1">
            Remark
          </label>
          <textarea
            id="remark"
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="Add any additional remarks"
          ></textarea>
        </div>

        {/* Preferred Contact Time */}
        <div>
          <label htmlFor="periodTime" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Contact Time
          </label>
          <input
            type="text"
            id="periodTime"
            name="periodTime"
            value={formData.periodTime}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="e.g., Morning, Afternoon, 9 AM - 12 PM"
          />
        </div>
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="e.g., 123"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              isLoading ? 'bg-gray-400' : 'bg-[#F4A300] hover:bg-yellow-600'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4A300]`}
          >
            {isLoading ? 'Saving...' : 'Save Prospect'}
          </button>
        </div>
      </form>

      {/* Spreadsheet Import Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-[#333333] mb-3">Upload Excel or CSV file with prospect data</h3>

        {/* Import Status Messages */}
        {importError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {importError}
          </div>
        )}
        {importSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {importSuccess}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx, .xls, .csv"
          className="hidden" // Hide the default file input
        />
        <button
          onClick={() => fileInputRef.current.click()} // Trigger hidden input click
          disabled={isImporting}
          className={`inline-flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
            isImporting ? 'bg-gray-400' : 'bg-[#F4A300] hover:bg-yellow-600'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
        >
          {isImporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Importing...
            </>
          ) : (
            <>
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Import from Spreadsheet
            </>
          )}
        </button>
        <p className="text-xs text-gray-500 mt-2">Supported formats: .xlsx, .xls, .csv</p>
      </div>
    </div>
  );
};

export default AddProspect;