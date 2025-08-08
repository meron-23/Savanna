import React, { useState, useEffect } from 'react';

// Mock data to simulate an API response for sales records
const mockSalesData = [
  {
    id: 1,
    amount: "1,200,000",
    agent: "Fafi Fasika",
    type: "Apartment",
    site: "Site A",
    area: "100 SQM",
    location: "Addis Ababa",
    date: "2025-07-29",
    soldTo: "Abebe Kebede",
    houseNo: "A-123",
    remark: "Pending full payment",
  },
  {
    id: 2,
    amount: "2,500,000",
    agent: "Abebe Teklu",
    type: "Villa",
    site: "Site B",
    area: "250 SQM",
    location: "Bishoftu",
    date: "2025-07-28",
    soldTo: "Tigist Alemu",
    houseNo: "B-456",
    remark: "Contract signed",
  },
  {
    id: 3,
    amount: "850,000",
    agent: "Chala Dejene",
    type: "Apartment",
    site: "Site C",
    area: "80 SQM",
    location: "Adama",
    date: "2025-07-27",
    soldTo: "Hana Merga",
    houseNo: "C-789",
    remark: "Paid in full",
  },
  {
    id: 4,
    amount: "1,500,000",
    agent: "Mesfin Wondimu",
    type: "Villa",
    site: "Site D",
    area: "200 SQM",
    location: "Bishoftu",
    date: "2025-07-26",
    soldTo: "Sara Birhanu",
    houseNo: "D-101",
    remark: "Pending full payment",
  },
  {
    id: 5,
    amount: "950,000",
    agent: "Fafi Fasika",
    type: "Apartment",
    site: "Site E",
    area: "90 SQM",
    location: "Adama",
    date: "2025-07-25",
    soldTo: "Dawit Tesfaye",
    houseNo: "E-202",
    remark: "Contract signed",
  },
];

const mockAgents = ["Fafi Fasika", "Abebe Teklu", "Chala Dejene", "Mesfin Wondimu"];
const mockSites = ["Site A", "Site B", "Site C", "Site D", "Site E"];
const mockProspects = ["Abebe Kebede", "Tigist Alemu", "Hana Merga", "Sara Birhanu", "Dawit Tesfaye"];

const RegisterSalesData = () => {
  // State for sales data and loading status
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search and filter functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // State to control the visibility of the new sale modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to control the visibility of the edit sale modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form state for sales data registration
  const [formState, setFormState] = useState({
    propertyCost: '',
    houseNumber: '',
    agreementNumber: '',
    dateOfSale: '',
    salesAgent: '',
    propertyType: '',
    area: '',
    location: '',
    site: '',
    remark: '',
    clientPhoneNumber: '',
    prospect: ''
  });

  // State for the form when editing a sales record
  const [editFormState, setEditFormState] = useState({
    id: null,
    propertyCost: '',
    houseNumber: '',
    agreementNumber: '',
    dateOfSale: '',
    salesAgent: '',
    propertyType: '',
    area: '',
    location: '',
    site: '',
    remark: '',
    clientPhoneNumber: '',
    prospect: ''
  });

  // Effect to simulate fetching sales data on component mount
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setIsLoading(true);
        // Simulate a network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSalesData(mockSalesData);
      } catch (e) {
        setError("Failed to load sales data.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSalesData();
  }, []);

  // Handlers for search and filter inputs
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateChange = (setter) => (event) => {
    setter(event.target.value);
  };

  // Handlers for new sale form state and submission
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Sales data submitted with state:", formState);

    // Reset form after submission
    setFormState({
      propertyCost: '',
      houseNumber: '',
      agreementNumber: '',
      dateOfSale: '',
      salesAgent: '',
      propertyType: '',
      area: '',
      location: '',
      site: '',
      remark: '',
      clientPhoneNumber: '',
      prospect: ''
    });
    // Close the modal after submission
    closeModal();
  };

  // Functions to open and close the new sale modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Functions to open and close the edit modal
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  // Handler to populate the edit form and open the modal
  const handleEditClick = (sale) => {
    setEditFormState({
      id: sale.id,
      propertyCost: sale.amount ? sale.amount.replace(/,/g, '') : '',
      houseNumber: sale.houseNo || '',
      agreementNumber: '', // Assuming this is not in mock data, initialize as empty
      dateOfSale: sale.date || '',
      salesAgent: sale.agent || '',
      propertyType: sale.type || '',
      area: sale.area ? sale.area.replace(' SQM', '') : '',
      location: sale.location || '',
      site: sale.site || '',
      remark: sale.remark || '',
      clientPhoneNumber: '', // Assuming this is not in mock data, initialize as empty
      prospect: sale.soldTo || ''
    });
    openEditModal();
  };

  // Handler for changes in the edit form
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormState(prevState => ({ ...prevState, [name]: value }));
  };

  // Handler for submitting the edit form
  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    console.log("Updated sales data submitted with state:", editFormState);

    // Update the sales data with the edited record
    setSalesData(salesData.map(sale => sale.id === editFormState.id ? {
      ...sale,
      amount: editFormState.propertyCost.toLocaleString(),
      houseNo: editFormState.houseNumber,
      date: editFormState.dateOfSale,
      agent: editFormState.salesAgent,
      type: editFormState.propertyType,
      area: `${editFormState.area} SQM`,
      location: editFormState.location,
      site: editFormState.site,
      remark: editFormState.remark,
      soldTo: editFormState.prospect,
    } : sale));

    closeEditModal();
  };

  // Filtering logic based on search term and date range
  const filteredSales = salesData.filter(sale => {
    const matchesSearch = sale.soldTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.houseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.agent.toLowerCase().includes(searchTerm.toLowerCase());

    const saleDate = new Date(sale.date);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const matchesDate = (!fromDate || saleDate >= fromDate) &&
      (!toDate || saleDate <= toDate);

    return matchesSearch && matchesDate;
  });

  // Calculate sales summary
  const totalSales = filteredSales.length;
  const totalAmount = filteredSales.reduce((sum, sale) => sum + parseInt(sale.amount.replace(/,/g, '')), 0);

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-600">Loading sales data...</p>
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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 w-full font-sans">
      <div className="mx-auto space-y-6">
        {/* Header and "Register Sale" button */}
        {/* Uses flexbox for responsive alignment, padding adjusts with screen size */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-lg shadow-md p-4 md:p-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left w-full sm:w-auto">Sales Dashboard</h2>
          <button
            onClick={openModal}
            // Button sizing and text remain consistent, responsive padding and margin
            className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#F4A300] hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Register New Sale
          </button>
        </div>

        {/* Filter and Summary Section */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          {/* Filter inputs: Stacks on small screens, aligns in a row on medium and larger */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="relative flex-1 w-full"> {/* Ensures full width on small screens */}
              <label htmlFor="search-phone" className="sr-only">Search by Phone Number</label>
              <input
                id="search-phone"
                type="text"
                placeholder="Search by Client, House No, or Agent"
                className="pl-4 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00A381] focus:border-[#00A381] text-sm w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            {/* Date inputs: Use w-full on small screens, adjust to fit on larger */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <label htmlFor="date-from" className="text-gray-600 text-sm whitespace-nowrap">Date From</label>
              <input
                id="date-from"
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00A381] focus:border-[#00A381] text-sm w-full"
                value={dateFrom}
                onChange={handleDateChange(setDateFrom)}
              />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <label htmlFor="date-to" className="text-gray-600 text-sm whitespace-nowrap">Date To</label>
              <input
                id="date-to"
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00A381] focus:border-[#00A381] text-sm w-full"
                value={dateTo}
                onChange={handleDateChange(setDateTo)}
              />
            </div>
          </div>

          {/* Sales Summary: Stacks on small screens, aligns in a row on medium and larger */}
          <div className="bg-white rounded-lg p-4 mt-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sales Summary</h3>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500">Time Period</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">All Sales</p> {/* Responsive text size */}
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalSales}</p> {/* Responsive text size */}
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalAmount.toLocaleString()} ETB</p> {/* Responsive text size */}
              </div>
            </div>
          </div>
        </div>

        {/* Sales Data Table */}
        {/* Uses overflow-x-auto to enable horizontal scrolling on small screens if table content is too wide */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Amount (ETB)
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Agent
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Type
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Site
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Area (SQM)
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Location
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Sold To
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    House No.
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Remark
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900 align-middle whitespace-nowrap">
                        {sale.amount}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                        {sale.agent}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                        {sale.type}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                        {sale.site}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                        {sale.area}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                        {sale.location}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                        {new Date(sale.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                        {sale.soldTo}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                        {sale.houseNo}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                        {sale.remark}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                        <button
                          onClick={() => handleEditClick(sale)}
                          className="text-[#F4A300] hover:text-[#333333] font-medium"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="px-4 py-4 text-center text-gray-500">No matching sales records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Register New Sale Form */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex justify-center items-start pt-5 pb-5"> {/* Added items-start and pb-5 for better vertical centering on smaller screens */}
            <div className="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-3xl w-full h-fit">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Register New Sale</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleFormSubmit}>
                {/* Main Form Fields: Stacks on small screens, two columns on medium and larger */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Property Cost */}
                  <div>
                    <label htmlFor="propertyCost" className="block text-sm font-medium text-gray-700">Property Cost (ETB)</label>
                    <input
                      id="propertyCost"
                      type="number"
                      name="propertyCost"
                      value={formState.propertyCost}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  {/* House Number */}
                  <div>
                    <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700">House Number</label>
                    <input
                      id="houseNumber"
                      type="text"
                      name="houseNumber"
                      value={formState.houseNumber}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  {/* Agreement Number */}
                  <div>
                    <label htmlFor="agreementNumber" className="block text-sm font-medium text-gray-700">Agreement Number</label>
                    <input
                      id="agreementNumber"
                      type="text"
                      name="agreementNumber"
                      value={formState.agreementNumber}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  {/* Date of Sale */}
                  <div>
                    <label htmlFor="dateOfSale" className="block text-sm font-medium text-gray-700">Date of Sale</label>
                    <input
                      id="dateOfSale"
                      type="date"
                      name="dateOfSale"
                      value={formState.dateOfSale}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                    />
                  </div>
                </div>

                {/* Property Details Section */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-lg font-semibold text-gray-800">Property Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sales Agent */}
                    <div>
                      <label htmlFor="salesAgent" className="block text-sm font-medium text-gray-700">Sales Agent</label>
                      <select
                        id="salesAgent"
                        name="salesAgent"
                        value={formState.salesAgent}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                      >
                        <option value="">Select Sales Agent</option>
                        {mockAgents.map(agent => (
                          <option key={agent} value={agent}>{agent}</option>
                        ))}
                      </select>
                    </div>
                    {/* Property Type */}
                    <div>
                      <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">Property Type</label>
                      <select
                        id="propertyType"
                        name="propertyType"
                        value={formState.propertyType}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                      >
                        <option value="">Select Type</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                      </select>
                    </div>
                    {/* Area */}
                    <div>
                      <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area (SQM)</label>
                      <input
                        id="area"
                        type="number"
                        name="area"
                        value={formState.area}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                      />
                    </div>
                    {/* Location */}
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        id="location"
                        type="text"
                        name="location"
                        value={formState.location}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                      />
                    </div>
                    {/* Site */}
                    <div>
                      <label htmlFor="site" className="block text-sm font-medium text-gray-700">Site</label>
                      <select
                        id="site"
                        name="site"
                        value={formState.site}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                      >
                        <option value="">Select Site</option>
                        {mockSites.map(site => (
                          <option key={site} value={site}>{site}</option>
                        ))}
                      </select>
                    </div>
                    {/* Remark */}
                    <div>
                      <label htmlFor="remark" className="block text-sm font-medium text-gray-700">Remark</label>
                      <input
                        id="remark"
                        type="text"
                        name="remark"
                        value={formState.remark}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Client Information Section */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-lg font-semibold text-gray-800">Client Information</h4>
                  <div>
                    <label htmlFor="clientPhoneNumber" className="block text-sm font-medium text-gray-700">Client Phone Number</label>
                    <input
                      id="clientPhoneNumber"
                      type="tel"
                      name="clientPhoneNumber"
                      placeholder="Enter phone number"
                      value={formState.clientPhoneNumber}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="prospect" className="block text-sm font-medium text-gray-700">Select Prospect</label>
                    <select
                      id="prospect"
                      name="prospect"
                      value={formState.prospect}
                      onChange={handleFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                    >
                      <option value="">Select Prospect</option>
                      {mockProspects.map(prospect => (
                        <option key={prospect} value={prospect}>{prospect}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Register Sales button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#F4A300] hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Register Sale
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Editing a Sale */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex justify-center items-start pt-5 pb-5"> {/* Added items-start and pb-5 for better vertical centering on smaller screens */}
            <div className="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-3xl w-full h-fit">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Edit Sales Record</h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Edit Form */}
              <form onSubmit={handleEditFormSubmit}>
                {/* Main Form Fields: Stacks on small screens, two columns on medium and larger */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Property Cost */}
                  <div>
                    <label htmlFor="edit-propertyCost" className="block text-sm font-medium text-gray-700">Property Cost (ETB)</label>
                    <input
                      id="edit-propertyCost"
                      type="number"
                      name="propertyCost"
                      value={editFormState.propertyCost}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  {/* House Number */}
                  <div>
                    <label htmlFor="edit-houseNumber" className="block text-sm font-medium text-gray-700">House Number</label>
                    <input
                      id="edit-houseNumber"
                      type="text"
                      name="houseNumber"
                      value={editFormState.houseNumber}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  {/* Agreement Number */}
                  <div>
                    <label htmlFor="edit-agreementNumber" className="block text-sm font-medium text-gray-700">Agreement Number</label>
                    <input
                      id="edit-agreementNumber"
                      type="text"
                      name="agreementNumber"
                      value={editFormState.agreementNumber}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  {/* Date of Sale */}
                  <div>
                    <label htmlFor="edit-dateOfSale" className="block text-sm font-medium text-gray-700">Date of Sale</label>
                    <input
                      id="edit-dateOfSale"
                      type="date"
                      name="dateOfSale"
                      value={editFormState.dateOfSale}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                    />
                  </div>
                </div>

                {/* Property Details Section */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-lg font-semibold text-gray-800">Property Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sales Agent */}
                    <div>
                      <label htmlFor="edit-salesAgent" className="block text-sm font-medium text-gray-700">Sales Agent</label>
                      <select
                        id="edit-salesAgent"
                        name="salesAgent"
                        value={editFormState.salesAgent}
                        onChange={handleEditFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                      >
                        <option value="">Select Sales Agent</option>
                        {mockAgents.map(agent => (
                          <option key={agent} value={agent}>{agent}</option>
                        ))}
                      </select>
                    </div>
                    {/* Property Type */}
                    <div>
                      <label htmlFor="edit-propertyType" className="block text-sm font-medium text-gray-700">Property Type</label>
                      <select
                        id="edit-propertyType"
                        name="propertyType"
                        value={editFormState.propertyType}
                        onChange={handleEditFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                      >
                        <option value="">Select Type</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                      </select>
                    </div>
                    {/* Area */}
                    <div>
                      <label htmlFor="edit-area" className="block text-sm font-medium text-gray-700">Area (SQM)</label>
                      <input
                        id="edit-area"
                        type="number"
                        name="area"
                        value={editFormState.area}
                        onChange={handleEditFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                      />
                    </div>
                    {/* Location */}
                    <div>
                      <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        id="edit-location"
                        type="text"
                        name="location"
                        value={editFormState.location}
                        onChange={handleEditFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                      />
                    </div>
                    {/* Site */}
                    <div>
                      <label htmlFor="edit-site" className="block text-sm font-medium text-gray-700">Site</label>
                      <select
                        id="edit-site"
                        name="site"
                        value={editFormState.site}
                        onChange={handleEditFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                      >
                        <option value="">Select Site</option>
                        {mockSites.map(site => (
                          <option key={site} value={site}>{site}</option>
                        ))}
                      </select>
                    </div>
                    {/* Remark */}
                    <div>
                      <label htmlFor="edit-remark" className="block text-sm font-medium text-gray-700">Remark</label>
                      <input
                        id="edit-remark"
                        type="text"
                        name="remark"
                        value={editFormState.remark}
                        onChange={handleEditFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Client Information Section */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-lg font-semibold text-gray-800">Client Information</h4>
                  <div>
                    <label htmlFor="edit-clientPhoneNumber" className="block text-sm font-medium text-gray-700">Client Phone Number</label>
                    <input
                      id="edit-clientPhoneNumber"
                      type="tel"
                      name="clientPhoneNumber"
                      placeholder="Enter phone number"
                      value={editFormState.clientPhoneNumber}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-prospect" className="block text-sm font-medium text-gray-700">Select Prospect</label>
                    <select
                      id="edit-prospect"
                      name="prospect"
                      value={editFormState.prospect}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                    >
                      <option value="">Select Prospect</option>
                      {mockProspects.map(prospect => (
                        <option key={prospect} value={prospect}>{prospect}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Update Sales button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Update Sale
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterSalesData;