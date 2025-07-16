"use client";
import { FileText, MapPin, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode"; // Correct import

const socket = io("http://localhost:5001"); // Update with backend URL

const FileReportPage = () => {
  const [reportData, setReportData] = useState({
    reportType: "Pending",
    description: "",
    location: { lat: null, lng: null },
    filedBy: "", // Set dynamically after decoding token
    phone: "", // Store user's phone number
  });

  const [message, setMessage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const reportTypes = [
    { value: "", label: "Select Type" },
    { value: "Accident", label: "Accident" },
    { value: "Crime", label: "Crime" },
    { value: "Suspicious Activity", label: "Suspicious Activity" },
    { value: "Emergency", label: "Emergency" },
  ];

  useEffect(() => {
    // Get user info from JWT token in sessionStorage
    const token = sessionStorage.getItem("token");
    const data = JSON.parse(sessionStorage.getItem("data"));
    if (token) {
      try {
        const decoded_token = jwtDecode(token); // Decode token
        console.log("Decoded Token:", decoded_token);
        console.log("full data:", data);
        console.log("name inside data: ", data.user.name);

        setReportData((prevState) => ({
          ...prevState,
          filedBy: data.user.name, // Set filedBy to user's name
          phone: data.user.phone, // Set phone number
        }));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    // Listen for real-time updates
    socket.on("new_complaint", (complaint) => {
      console.log("New complaint received:", complaint);
      setMessage(`New complaint submitted: ${complaint.type}`);

      // Auto-hide message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    });

    return () => socket.off("new_complaint"); // Cleanup on unmount
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.relative')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData((prevState) => ({
      ...prevState,
      [name]: value, // Only update the changed field
    }));
  };

  const handleReportTypeSelect = (value) => {
    setReportData((prevState) => ({
      ...prevState,
      type: value,
    }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("token");

      console.log("Submitting now : ");
      console.log("this is the report data being sent ", reportData);

      const response = await fetch(
        "http://localhost:5001/api/reports/fileReport",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Ensure correct format
          },
          body: JSON.stringify(reportData),
        }
      );

      const data = await response.json();
      console.log("Response from server:", data);

      if (response.ok) {
        setMessage("Complaint filed successfully! Our officer will get in touch with u in a few moments.");
        socket.emit("new_complaint", data); // Notify backend
        setReportData({
          type: "",
          description: "",
          location: "",
          filedBy: reportData.filedBy,
          phone: reportData.phone,
        });
      } else {
        setMessage(data.error || "Failed to submit complaint.");
      }
    } catch (error) {
      setMessage("Error submitting complaint.");
      console.error("Submission error:", error);
    }

    // Auto-hide message after 5 seconds
    setTimeout(() => setMessage(null), 5000);
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setReportData((prevData) => ({
          ...prevData,
          location: { lat: latitude, lng: longitude },
        }));
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 p-6 md:p-12 flex items-center justify-center">
  <div className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-white/20">
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-blue-600 p-3 rounded-full">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">File a New Report</h2>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className="bg-blue-600/70 backdrop-blur text-white p-4 rounded-xl mb-6 text-center animate-pulse">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Report Type */}
        <div className="relative">
          <label htmlFor="type" className="block text-sm font-medium text-blue-100 mb-1">
            Report Type
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-3 bg-white/10 text-white border border-blue-300/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 flex items-center justify-between"
            >
              <span className={reportData.type ? "text-white" : "text-blue-200"}>
                {reportData.type || "Select Type"}
              </span>
              <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 backdrop-blur-md border border-blue-300/30 rounded-xl shadow-2xl z-50 overflow-hidden">
                {reportTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleReportTypeSelect(type.value)}
                    className={`w-full px-4 py-3 text-left hover:bg-blue-600/40 transition-colors duration-150 border-b border-blue-300/10 last:border-b-0 ${
                      type.value === "" 
                        ? "text-blue-200 italic" 
                        : "text-white"
                    } ${
                      reportData.type === type.value 
                        ? "bg-blue-600/30 text-cyan-300" 
                        : ""
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-blue-100 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={reportData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 bg-white/10 text-white border border-blue-300/30 rounded-xl "
            placeholder="Describe the incident in detail"
          ></textarea>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-blue-100 mb-1">
            Location
          </label>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600/40 p-2 rounded-lg">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <input
              type="text"
              id="location"
              name="location"
              value={
                reportData.location.lat && reportData.location.lng
                  ? `${reportData.location.lat}, ${reportData.location.lng}`
                  : ""
              }
              onChange={handleChange}
              className="flex-1 p-3 bg-white/10 text-white border border-blue-300/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
              placeholder="Enter the location or use current"
            />
            <button
              type="button"
              onClick={getLocation}
              className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors duration-200 font-medium flex items-center"
            >
              Use Current
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() =>
              setReportData({
                type: "",
                description: "",
                location: "",
                severity: "Low",
              })
            }
            className="px-6 py-2.5 bg-gray-600/70 hover:bg-gray-500 text-white rounded-xl font-medium transition-all duration-200"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-medium shadow-lg shadow-blue-700/30 transition-all duration-200"
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
      
    </>
  );
};

export default FileReportPage;
