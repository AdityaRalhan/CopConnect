"use client";
import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  FileText,
  MapPin,
  Phone,
  Shield,
  Users,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import axios from "axios";


const CitizenDashboard = () => {
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [complaintProgress, setComplaintProgress] = useState("reviewing");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportProgress, setReportProgress] = useState("Loading...");
  const [reportDescription, setReportDescription] = useState("");

  const emergencyContacts = [
    { title: "Police Emergency", number: "100" },
    { title: "Women Helpline", number: "1091" },
    { title: "Traffic Help", number: "1073" },
    { title: "Maternal and child help", number: "102" },
    { title: "Ambulance", number: "108" },
  ];

  useEffect(() => {
    const fetchComplaintStatus = async () => {

      try {
        const token = sessionStorage.getItem('token')
        const decoded = jwtDecode(token)
        const phone = decoded.phone
        const res = await axios.get(`http://localhost:5001/api/reports/getReportStatus/${phone}`);

        if (res.data.length > 0) {
          // assuming we care about the most recent complaint
          const latestReport = res.data[0];
          setReportProgress(latestReport.status || "No Status");
          setReportDescription(latestReport.description)
        } else {
          setReportProgress("No reports found");

        }
      } catch (err) {
        console.error("Error fetching complaint status:", err);
        setReportProgress("Error fetching status");
      }
    };

    fetchComplaintStatus();
  }, []);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = sessionStorage.getItem("token");
        console.log("this is the token: ", token);

        const decoded = jwtDecode(token);
        console.log("this is the decoded token : ", decoded);

        const phone = decoded?.phone;
        console.log("decoded phone number : ", phone);

        if (!phone) {
          setError("User phone number not found.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5001/api/cases/search-by-contact?contact=${phone}`
        );
        console.log("💥 Fetched cases response: ", response.data);

        setRecentAlerts(response.data.cases);
      } catch (err) {
        console.error("Error fetching complaints:", err); // 🔥 Add this line
        setError("Failed to fetch complaints.");
        setRecentAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const showReportPage = (index) => {
    const selectedComplaint = recentAlerts[index];
    const encodedData = encodeURIComponent(JSON.stringify(selectedComplaint));
    window.open(
      `/supportPages/DownloadReportForCitizen?data=${encodedData}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900">
      <nav className="bg-gray-900/50 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-10">
        <div className="relative max-w-7xl mx-auto px-4 py-4 flex items-center justify-center">
          {/* Back Button on the Left */}
          <div className="absolute left-4 flex items-center space-x-2">
            <Link
              href="/"
              className="flex items-center space-x-2 hover:underline transition duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400">Back to Home</span>
            </Link>
          </div>

          {/* Center Title */}
          <div className="flex items-center space-x-2">
            <Shield className="text-blue-400 h-8 w-8" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              Citizen Portal
            </span>
          </div>

          {/* Right Side: User Icon + Logout */}
          <div className="absolute right-4 flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <button
              onClick={() => {
                sessionStorage.clear();
                window.location.href = "/";
              }}
              className="text-sm text-blue-300 hover:text-white underline transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Report Incident Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white border border-blue-400/20 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1 transition-all duration-300 flex justify-center items-center">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Report Incident</h2>
                <Link href="/supportPages/CitizenReport">
                  <button className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-semibold transition-colors">
                    File New Report
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Track Complaint Card */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl p-6 text-white border border-blue-400/20 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">Track Complaint</h2>
                <div className="mt-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-blue-200">{reportDescription}</span>
                    <span className="text-white font-semibold">
                      {reportProgress}
                    </span>
                  </div>

                  {/* Optional manual override button */}
                  <button
                    className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-semibold transition-colors"
                    onClick={() => setReportProgress("Resolved")}
                  >
                    Mark as Resolved
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Emergency Contacts */}
          <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 text-white border border-blue-400/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-white/10 p-3 rounded-lg">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold">Emergency Contacts</h2>
            </div>
            <div className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="text-blue-200">{contact.title}</span>
                  <span className="text-white font-semibold">
                    {contact.number}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Alerts */}
          <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 text-white border border-blue-400/20 col-span-2 relative">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-white/10 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold">
                Check your complaint filed at the station
              </h2>
            </div>

            {/* Loader or error */}
            {loading ? (
              <p className="text-blue-300">Loading complaints...</p>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : recentAlerts.length === 0 ? (
              <p className="text-blue-100">No complaints found.</p>
            ) : (
              <div className="space-y-4">
                {recentAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="bg-white/5 hover:bg-white/10 p-4 rounded-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm text-blue-300">
                          {alert.caseType || "Complaint"}
                        </span>
                        <p className="mt-1 text-blue-100">
                          {alert.description}
                        </p>
                      </div>
                      <span className="text-sm text-blue-300">
                        {alert.status}
                      </span>
                    </div>

                    {/* Button inside the box */}
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => showReportPage(index)}
                        className="text-sm text-blue-200 border border-blue-400 px-3 py-1 rounded hover:bg-blue-500/20"
                      >
                        Download Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
