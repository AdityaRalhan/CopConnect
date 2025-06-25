"use client";
import React, { useState, useEffect } from "react";
import {
  Shield,
  Search,
  Briefcase,
  FileX,
  Clock,
  CheckCircle,
  Plus,
  User,
  MapPin,
  Phone,
  MessageSquare,
  ArrowLeft,
  Folder,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import CitizenCasesForPoliceDash from "@/app/HelpingComponents/CitizenCasesForPoliceDash";
import PatrolUnits from "@/app/HelpingComponents/PatrolUnits";

const PoliceDashboard = () => {
  const [activeTab, setActiveTab] = useState("cases");
  const [selectedCase, setSelectedCase] = useState(null);
  const [openCases, setOpenCases] = useState([]);
  const [activeCasesNumber, setActiveCasesNumber] = useState(0);
  const [anonymousTips, setAnonymousTips] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchOpenCases = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5001/api/cases/getOpenCases",
          {
            headers: {
              Authorization: `Bearer ${token}`, // or just token, depending on backend expectations
            },
          }
        );
        setOpenCases(res.data);
        setActiveCasesNumber(res.data.length);
      } catch (err) {
        console.error("Error fetching open cases:", err);
      }
    };

    fetchOpenCases();
  }, []);

  const fetchTips = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:5001/api/anonymous/pendingAnonymousTips",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the request header
          },
        }
      ); // Correct closing of axios.get

      setAnonymousTips(response.data.tips); // Assuming the tips are in response.data.tips
    } catch (error) {
      console.error("Error fetching tips:", error);
    }
  };

  useEffect(() => {
    fetchTips(); // Fetch tips when the component mounts
  }, []);

  const findTimeDifference = (submittedAt) => {
    // Parse the submittedAt time string into a Date object
    const submittedDate = new Date(submittedAt);

    // Get the current date and time
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const timeDifferenceMs = currentDate - submittedDate;

    // Convert milliseconds to hours (1 hour = 3600000 milliseconds)
    const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);

    // Return the difference in hours (rounded to the nearest whole number)
    return Math.round(timeDifferenceHours);
  };

  const stats = {
    activeCases: 28,
    pendingReview: 12,
    solvedThisMonth: 15,
    newTips: 8,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900">
      {/* Navigation Bar */}

      <nav className="bg-slate-900/50 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-10">
        <div className="relative max-w-7xl mx-auto px-4 py-4 flex items-center justify-center">
          {/* Back Button on the Left */}
          <div className="absolute left-4 flex items-center space-x-2">
            <Link
              href="/"
              className="flex items-center space-x-2 hover:underline"
            >
              <ArrowLeft className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400">Back to Home</span>
            </Link>
          </div>

          {/* Centered Title */}
          <div className="flex items-center space-x-2">
            <Shield className="text-blue-400 h-8 w-8" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              Police Dashboard
            </span>
          </div>

          {/* Officer Info on the Right */}
          <div className="absolute right-4 flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-blue-400/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300">Total Open Cases</p>
                <h3 className="text-3xl font-bold text-white">
                  {activeCasesNumber}
                </h3>
              </div>
              <Folder className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-blue-400/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300">Pending Review</p>
                <h3 className="text-3xl font-bold text-white">
                  {stats.pendingReview}
                </h3>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-blue-400/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300">Solved This Month</p>
                <h3 className="text-3xl font-bold text-white">
                  {stats.solvedThisMonth}
                </h3>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-blue-400/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300">New Tips</p>
                <h3 className="text-3xl font-bold text-white">
                  {stats.newTips}
                </h3>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/supportPages/PoliceCaseFiling" className="block">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white border border-blue-400/20 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1 transition-all duration-300 w-full h-full">
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">New Case</h2>
                  <p className="text-blue-100 mt-1">Create case report</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/supportPages/CopNotes" className="block">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white border border-green-400/20 hover:shadow-lg hover:shadow-green-500/20 transform hover:-translate-y-1 transition-all duration-300 w-full h-full">
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold">Your page</h2>
                  <p className="text-green-100 mt-1">
                    Make notes and see your stats
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/supportPages/PoliceSearchCases" className="block">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white border border-purple-400/20 hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-1 transition-all duration-300 w-full h-full">
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold">Search Records</h2>
                  <p className="text-purple-100 mt-1">Access database</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 py-8">
          {/* Left Section - Cases List + Selected Case */}

          <div className="lg:col-span-2 space-y-6">
            <CitizenCasesForPoliceDash />
            {/* Cases List */}
            <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-6 border border-blue-400/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Briefcase className="h-5 w-5 text-blue-400 mr-2" />
                  Active Filed Cases
                </h2>
                <div className="flex space-x-2">

                </div>
              </div>

              {/* Horizontal scrolling container */}
              <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#60a5fa #1e293b' }}>
                <div className="flex flex-nowrap gap-6 min-w-full">
                  {openCases.length > 0 ? (
                    openCases.map((case_) => (
                      <Link
                        href={`/supportPages/PoliceCaseDetailDisplay/${case_.caseNumber}`}
                        key={case_.caseNumber}
                        className="flex-none w-80"
                      >
                        <div className="bg-white/5 hover:bg-white/10 rounded-2xl p-6 cursor-pointer transition-all shadow-md border-t-4 border-blue-500 h-full">
                          <div className="flex flex-col h-full">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-blue-300 font-mono">
                                  #{case_.caseNumber}
                                </span>
                                <span
                                  className={`text-xs px-3 py-1 rounded-full font-semibold ${case_.priority === "High"
                                    ? "bg-red-500/20 text-red-300"
                                    : case_.priority === "Medium"
                                      ? "bg-yellow-500/20 text-yellow-300"
                                      : "bg-green-500/20 text-green-300"
                                    }`}
                                >
                                  {case_.priority}
                                </span>
                              </div>
                              <span className="text-xs text-blue-400 whitespace-nowrap bg-blue-900/30 px-3 py-1 rounded-full">
                                {case_.lastUpdate}
                              </span>
                            </div>

                            <div className="my-4">
                              <h3 className="text-white text-lg font-semibold mb-2">
                                {case_.title}
                              </h3>
                              <p className="text-blue-200 text-sm line-clamp-3">
                                {case_.description}
                              </p>
                            </div>

                            <div className="mt-auto flex flex-col gap-3 text-sm text-blue-200">
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                <span className="truncate">{case_.location}</span>
                              </div>

                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                <span className="truncate">{case_.assignedTo}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="bg-blue-900/20 text-blue-300 p-8 rounded-xl text-center w-full">
                      <FileX className="h-12 w-12 mx-auto mb-2 text-blue-400 opacity-70" />
                      <p className="text-white text-center">
                        No active cases available.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation controls */}
              <div className="mt-4 flex justify-between items-center">
                <span className="text-blue-300 text-sm">{openCases.length} active cases</span>
                <div className="flex space-x-3">
                  <button className="bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 p-2 rounded-full transition-colors">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button className="bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 p-2 rounded-full transition-colors">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* New Section: Citizen Complaints */}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-6 border border-blue-400/20">
              <h2 className="text-xl font-semibold text-white mb-4">
                Active Anonymous Tips
              </h2>
              <div>
                {anonymousTips.length > 0 ? (
                  anonymousTips.map((tip) => (
                    <Link
                      href={`/supportPages/AnonymousTipDetailDisplay/${tip._id}`}
                      key={tip._id}
                    >
                      <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-blue-300">
                            <p>
                              Coordinates:{" "}
                              {tip.location.coordinates[0]}, {" "},
                              {tip.location.coordinates[1]}
                            </p>
                          </span>
                          <span className="text-xs px-3 py-1 rounded-full bg-red-600 text-blue-200">
                            {tip.status}
                          </span>
                        </div>
                        <p className="text-white text-sm mt-2">
                          {tip.description}
                        </p>
                        <span className="text-sm text-blue-300 mt-2 block">
                          {findTimeDifference(tip.submitted_at)} hour(s) ago
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-blue-300 text-sm bg-white/5 p-4 rounded-lg">
                    No anonymous tips found.
                  </div>
                )}
              </div>
            </div>
            {/* Patrol Units */}
            <PatrolUnits />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;
