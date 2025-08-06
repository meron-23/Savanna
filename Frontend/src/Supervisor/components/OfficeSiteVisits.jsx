import React, { useState, useEffect } from 'react';

// Main component for managing office and site visits
const OfficeSiteVisits = () => {
  // State for storing the list of visits fetched from the API
  const [visits, setVisits] = useState([]);
  // State to track loading status for a better user experience
  const [isLoading, setIsLoading] = useState(true);
  // State to handle and display any errors during API calls
  const [error, setError] = useState(null);
  
  // State for the custom message box
  const [messageBox, setMessageBox] = useState({ isVisible: false, text: '', type: 'success' });
  
  // State for filtering the visits list
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // State to control the visibility of the new visit modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  // State to control the visibility of the edit visit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State for the new visit form
  const [formState, setFormState] = useState({
    clientId: '',
    visitDate: '',
    officeVisit: false,
    siteVisit: false,
    visitDetails: ''
  });

  // State for the edit visit form
  const [editFormState, setEditFormState] = useState({
    visitID: '',
    clientId: '',
    visitDate: '',
    officeVisit: false,
    siteVisit: false,
    visitDetails: ''
  });

  // useEffect hook to fetch visits data from the API when the component mounts
  useEffect(() => {
    fetchVisits();
  }, []);

  // Function to display the custom message box
  const showMessageBox = (text, type = 'success') => {
    setMessageBox({ isVisible: true, text, type });
    setTimeout(() => {
      setMessageBox({ isVisible: false, text: '', type: 'success' });
    }, 3000); // Hide after 3 seconds
  };

  // Handlers for opening and closing the new visit modal
  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);
  
  // Handlers for opening and closing the edit visit modal
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const fetchVisits = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/api/visits');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch visits');
      }

      if (data.success && Array.isArray(data.data)) {
        setVisits(data.data);
      } else {
        throw new Error('Invalid data format received from server');
      }

    } catch (e) {
      setError("Failed to load visit data.");
      console.error("Error fetching visits:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for changes in the search input field
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handler for changes in the date input fields
  const handleDateChange = (setter) => (event) => {
    setter(event.target.value);
  };

  // Handler for new visit form input changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormState(prevState => ({
        ...prevState,
        [name]: checked
      }));
    } else {
      setFormState(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // Handler for edit form input changes
  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setEditFormState(prevState => ({
        ...prevState,
        [name]: checked
      }));
    } else {
      setEditFormState(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // Handler for new visit form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formState);
    try {
      const response = await fetch('http://localhost:3000/api/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: formState.clientId,
          visitDate: formState.visitDate,
          officeVisit: formState.officeVisit,
          siteVisit: formState.siteVisit,
          visitDetails: formState.visitDetails
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit visit');
      }

      if (data.success) {
        // After successful submission, re-fetch the visits data to update the table
        await fetchVisits();

        // Reset form after submission
        setFormState({
          clientId: '',
          visitDate: '',
          officeVisit: false,
          siteVisit: false,
          visitDetails: ''
        });

        showMessageBox("Visit registered successfully!", "success");
        closeRegisterModal();
      }
    } catch (error) {
      console.error("Failed to submit visit data:", error);
      showMessageBox("Failed to register visit. Please try again.", "error");
    }
  };

  // Handler for edit form submission
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/visits/${editFormState.visitID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: editFormState.clientId,
          visitDate: editFormState.visitDate,
          officeVisit: editFormState.officeVisit,
          siteVisit: editFormState.siteVisit,
          visitDetails: editFormState.visitDetails
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update visit');
      }

      if (data.success) {
        // After successful update, re-fetch the visits data to update the table
        await fetchVisits();

        // Close the modal and reset edit form
        closeEditModal();

        showMessageBox("Visit updated successfully!", "success");
      }
    } catch (error) {
      console.error("Failed to update visit data:", error);
      showMessageBox("Failed to update visit. Please try again.", "error");
    }
  };

  // Function to handle edit button click
  const handleEdit = (visit) => {
    setEditFormState({
      visitID: visit.VisitID,
      clientId: visit.ClientId,
      visitDate: visit.VisitDate ? visit.VisitDate.split('T')[0] : '',
      officeVisit: visit.OfficeVisit,
      siteVisit: visit.SiteVisit,
      visitDetails: visit.VisitDetails || ''
    });
    openEditModal();
  };

  // Function to handle cancel edit
  const handleCancelEdit = () => {
    closeEditModal();
  };

  // Filter the visits based on search term and date range
  const filteredVisits = visits.filter(visit => {
    // Check if `visit` is a valid object with the expected properties
    if (!visit) return false;

    // Search by ClientID or VisitDetails
    const matchesSearch = 
      (visit.ClientID && visit.ClientID.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (visit.VisitDetails && visit.VisitDetails.toLowerCase().includes(searchTerm.toLowerCase()));

    const visitDate = visit.VisitDate ? new Date(visit.VisitDate) : null;
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const matchesDate = (!fromDate || (visitDate && visitDate >= fromDate)) &&
                        (!toDate || (visitDate && visitDate <= toDate));

    return matchesSearch && matchesDate;
  });

  // Calculate summary counts
  const totalOfficeVisits = filteredVisits.filter(v => v.OfficeVisit).length;
  const totalSiteVisits = filteredVisits.filter(v => v.SiteVisit).length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-600">Loading visit data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Custom Message Box */}
        {messageBox.isVisible && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white z-50 
                          ${messageBox.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {messageBox.text}
          </div>
        )}

        {/* Header and "Register Visit" button */}
        <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-800">Office and Site Visits</h2>
          <button
            onClick={openRegisterModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#F4A300] hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Register New Visit
          </button>
        </div>
        
        {/* Filter and Summary Section */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="relative flex-1">
              <label htmlFor="search-phone" className="sr-only">Search by Client ID or Details</label>
              <input
                id="search-phone"
                type="text"
                placeholder="Search by Client ID or Details"
                className="pl-4 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="date-from" className="text-gray-600 text-sm whitespace-nowrap">Date From</label>
              <input
                id="date-from"
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm w-full"
                value={dateFrom}
                onChange={handleDateChange(setDateFrom)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="date-to" className="text-gray-600 text-sm whitespace-nowrap">Date To</label>
              <input
                id="date-to"
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm w-full"
                value={dateTo}
                onChange={handleDateChange(setDateTo)}
              />
            </div>
          </div>

          {/* Visit Summary */}
          <div className="bg-white rounded-lg p-4 mt-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Visit Summary</h3>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500">Time Period</p>
                <p className="text-2xl font-bold text-gray-900">All Visits</p>
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500">Office Visits</p>
                <p className="text-2xl font-bold text-gray-900">{totalOfficeVisits}</p>
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500">Site Visits</p>
                <p className="text-2xl font-bold text-gray-900">{totalSiteVisits}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visit Data Table */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Client ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Visit Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Site Visit
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Office Visit
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Visit Details
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVisits.length > 0 ? (
                  filteredVisits.map((visit) => (
                    <tr key={visit.VisitID} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900 align-middle whitespace-nowrap">
                        {visit.ClientID}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                        {visit.VisitDate ? new Date(visit.VisitDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                        {visit.SiteVisit ? 'Yes' : 'No'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                        {visit.OfficeVisit ? 'Yes' : 'No'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 align-middle">
                        {visit.VisitDetails}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                        <button 
                          onClick={() => handleEdit(visit)}
                          className="text-yellow-600 hover:text-yellow-900 font-medium"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-gray-500">No matching visits found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination (mock) */}
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <button className="px-4 py-2 border rounded-md">Previous</button>
            <span>Page 1 of 1</span>
            <button className="px-4 py-2 border rounded-md">Next</button>
          </div>
        </div>
      </div>

      {/* Modal for Register New Visit Form */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex justify-center pt-20">
          <div className="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-2xl w-full h-fit">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Register New Visit</h3>
              <button
                onClick={closeRegisterModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit}>
              <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                {/* Client ID */}
                <div className="space-y-2">
                  <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Client ID</label>
                  <input
                    id="clientId"
                    type="text"
                    name="clientId"
                    placeholder="Enter Client ID"
                    value={formState.clientId || ''}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                </div>
                {/* Visit Date */}
                <div className="space-y-2">
                  <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700">Visit Date</label>
                  <input
                    id="visitDate"
                    type="date"
                    name="visitDate"
                    value={formState.visitDate}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                </div>
                {/* Visit Type Checkboxes */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Visit Type</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="siteVisit"
                        checked={formState.siteVisit}
                        onChange={handleFormChange}
                        className="form-checkbox text-teal-500 h-4 w-4 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Site Visit</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="officeVisit"
                        checked={formState.officeVisit}
                        onChange={handleFormChange}
                        className="form-checkbox text-teal-500 h-4 w-4 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Office Visit</span>
                    </label>
                  </div>
                </div>
                {/* Visit Details */}
                <div className="space-y-2">
                  <label htmlFor="visitDetails" className="block text-sm font-medium text-gray-700">Visit Details</label>
                  <textarea
                    id="visitDetails"
                    name="visitDetails"
                    rows="3"
                    value={formState.visitDetails}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  ></textarea>
                </div>
                {/* Register Visit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#F4A300]  hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Register Visit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Edit Visit Form */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex justify-center pt-20">
          <div className="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-2xl w-full h-fit">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Edit Visit</h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditFormSubmit}>
              <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                {/* Client ID */}
                <div className="space-y-2">
                  <label htmlFor="edit-clientID" className="block text-sm font-medium text-gray-700">Client ID</label>
                  <input
                    id="edit-clientID"
                    type="text"
                    name="clientID"
                    placeholder="Enter Client ID"
                    value={editFormState.clientId}
                    onChange={handleEditFormChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                </div>
                {/* Visit Date */}
                <div className="space-y-2">
                  <label htmlFor="edit-visitDate" className="block text-sm font-medium text-gray-700">Visit Date</label>
                  <input
                    id="edit-visitDate"
                    type="date"
                    name="visitDate"
                    value={editFormState.visitDate}
                    onChange={handleEditFormChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                </div>
                {/* Visit Type Checkboxes */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Visit Type</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="siteVisit"
                        checked={editFormState.siteVisit}
                        onChange={handleEditFormChange}
                        className="form-checkbox text-teal-500 h-4 w-4 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Site Visit</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="officeVisit"
                        checked={editFormState.officeVisit}
                        onChange={handleEditFormChange}
                        className="form-checkbox text-teal-500 h-4 w-4 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Office Visit</span>
                    </label>
                  </div>
                </div>
                {/* Visit Details */}
                <div className="space-y-2">
                  <label htmlFor="edit-visitDetails" className="block text-sm font-medium text-gray-700">Visit Details</label>
                  <textarea
                    id="edit-visitDetails"
                    name="visitDetails"
                    rows="3"
                    value={editFormState.visitDetails}
                    onChange={handleEditFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  ></textarea>
                </div>
                {/* Form buttons */}
                <div className="pt-4 flex space-x-3">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Update Visit
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficeSiteVisits;
