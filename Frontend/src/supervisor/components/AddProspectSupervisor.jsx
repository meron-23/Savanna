import React, { useState, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

// A helper function to format dates as 'YYYY-MM-DD'
const formatBackendDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// This is the named function component for the entire form
const AddProspectSupervisor = () => {
  // State for all form fields
  const [formData, setFormData] = useState({
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
    userId: 'staticUserId123', // REMOVE STATIC ID IN PROD
  });
  
  // State for form submission
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [createdId, setCreatedId] = useState(null);

  // State for spreadsheet import
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Handler for all input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handler for form submission to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);
    setSuccessMessage('');
    setCreatedId(null);

    try {
      const dataToSend = {
        ...formData,
        date: formatBackendDate(formData.date),
        dateNow: formatBackendDate(new Date()),
      };

      const response = await axios.post(
        'http://localhost:5000/api/prospects',
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
          userId: 'staticUserId123',
        });
      } else {
        setError(response.data.message || 'Failed to save prospect');
      }
    } catch (err) {
      console.error('API Error:', err);
      if (err.response) {
        setError(err.response.data?.message || 'Request failed');
      } else if (err.request) {
        setError('Network error. Check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for the import button, which triggers the file input
  const handleImportButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // The handleFileChange function from your provided code
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      readSpreadsheetFile(file);
    }
  };

  // The readSpreadsheetFile function from your provided code
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

        const prospectsToImport = json.map((row) => ({
          name: row['Name'] || '',
          phoneNumber: row['Phone Number'] || '',
          interest: row['Interest'] || '',
          method: row['Contact Method'] || '',
          site: row['Site'] || '',
          comment: row['Comment'] || '',
          remark: row['Remark'] || '',
          periodTime: row['Preferred Contact Time'] || '',
          userId: formData.userId,
        }));

        await importProspectsBulk(prospectsToImport);
      } catch (err) {
        console.error('Error reading/parsing spreadsheet:', err);
        setImportError(
          'Failed to read or parse spreadsheet. Make sure it\'s a valid .xlsx, .xls, or .csv file with correct headers.'
        );
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

  // The importProspectsBulk function from your provided code
  const importProspectsBulk = async (prospects) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/prospects/bulk',
        { prospects },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setImportSuccess(
          `Successfully imported ${response.data.importedCount} prospects.`
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setImportError(
          response.data.message ||
            'Failed to import prospects from spreadsheet.'
        );
      }
    } catch (err) {
      console.error('API Error (Bulk Import):', err);
      if (err.response) {
        setImportError(
          err.response.data?.message ||
            `Bulk import failed with status ${err.response.status}`
        );
      } else if (err.request) {
        setImportError('Network error during bulk import. Check your connection.');
      } else {
        setImportError('An unexpected error occurred during bulk import.');
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full">

        {/* Form Header */}
        <div className="p-6 md:p-8 flex items-center border-b border-gray-200">
          {/* Checkmark Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-[#F4A300] mr-2"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Add New Prospect
          </h2>
        </div>

        {/* The form itself */}
        <div className="p-6 md:p-8">
          {/* Display status messages */}
          {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg mb-4">{error}</div>}
          {success && <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg mb-4">{successMessage} {createdId && `(ID: ${createdId})`}</div>}
          
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
        </div>

        {/* Separator and Import Section */}
        <div className="border-t border-gray-200 p-6 md:p-8">
          {/* Display import status messages */}
          {importError && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg mb-4">{importError}</div>}
          {importSuccess && <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg mb-4">{importSuccess}</div>}
          
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Excel or CSV file with prospect data
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" // Hiding the actual file input
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
          <button
            type="button"
            onClick={handleImportButtonClick}
            disabled={isImporting}
            className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isImporting ? 'bg-gray-400' : 'bg-[#F4A300] hover:bg-yellow-600'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors`}
          >
            {/* Spreadsheet Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            {isImporting ? 'Importing...' : 'Import from Spreadsheet'}
          </button>
          <p className="mt-2 text-xs text-gray-500">
            Supported formats: .xls, .xlsx, .csv
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddProspectSupervisor;
