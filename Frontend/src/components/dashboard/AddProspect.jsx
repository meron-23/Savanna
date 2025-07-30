import React from 'react'

const AddProspect = () => {
  // const [credentials, setCredentials] = ({
  //   name: '',
  //   phoneNumber: '',
  //   interest: '',
  // })
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8 w-full">
      <h2 className="text-xl font-bold text-[#333333] mb-4">Add New Prospect</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="prospectName" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="prospectName"
            name="name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="Enter prospect name"
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="e.g., +1234567890"
          />
        </div>
        <div>
          <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
            Interest
          </label>
          <input
            type="text"
            id="interest"
            name="interest"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="e.g., UI/UX Design, Branding"
          />
        </div>
        <div>
          <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Method
          </label>
          <select
            id="method"
            name="method"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
          >
            <option value="">Select method</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-1">
            Site
          </label>
          <input
            type="text"
            id="site"
            name="site"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="e.g., Website, Referral, Social Media"
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="Add any relevant comments"
          ></textarea>
        </div>
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-1">
            Remark
          </label>
          <textarea
            id="remark"
            name="remark"
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="Add any additional remarks"
          ></textarea>
        </div>
        <div>
          <label htmlFor="periodTime" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Contact Time
          </label>
          <input
            type="text"
            id="periodTime"
            name="periodTime"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="e.g., Morning, Afternoon, 9 AM - 12 PM"
          />
        </div>
        <div className="col-span-1 md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#F4A300] hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4A300]"
          >
            Save Prospect
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProspect
