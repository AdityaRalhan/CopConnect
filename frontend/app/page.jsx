"use client"
import { Shield, ChevronRight, HelpCircle, User, UserCircle, Lock, Bell, Users, Eye, Settings } from 'lucide-react';
import Link from "next/link"
import { motion } from "framer-motion"
import Footer from "./HelpingComponents/Footer"

const CopConnectLanding = () => {
  const portalOptions = [
    {
      title: "Police",
      icon: Shield,
      description: "Law enforcement portal access",
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      title: "Citizen",
      icon: Users,
      description: "Public services and reporting",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      title: "Anonymous",
      icon: Eye,
      description: "Submit anonymous tips",
      gradient: "from-teal-400 to-cyan-500",
    },
    {
      title: "Community",
      icon: Settings,
      description: "Community help",
      gradient: "from-indigo-600 to-purple-600",
    },
  ]

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-blue-900 text-white overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-400 filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500 filter blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-400 filter blur-3xl"></div>
        </div>

        {/* Navigation */}
        <nav className="bg-gray-900/60 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-2">
                <Shield className="text-blue-400 h-8 w-8" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                  CopConnect
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <Link
                  href="/notifications"
                  className="text-blue-300 hover:text-blue-100 transition-colors"
                >
                  
                </Link>
                <Link
                  href="/supportPages/about"
                  className="text-blue-300 hover:text-blue-100 transition-colors flex items-center space-x-1 group"
                >
                  <span>About Us</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/supportPages/information"
                  className="text-blue-300 hover:text-blue-100 transition-colors flex items-center space-x-1 group"
                >
                  <span>Information</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 h-[calc(100vh-4rem)] flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 mt-5">
              Welcome to CopConnect
            </h1>
            <p className="text-blue-200 max-w-2xl mx-auto text-lg">
              Bridging the gap between citizens and law enforcement
            </p>
          </motion.div>

          {/* Container box with rounded corners */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className=" backdrop-blur-lg border border-blue-500/30 rounded-3xl p-10 shadow-2xl shadow-blue-500/10 flex-grow flex flex-col md:flex-row justify-center max-w-6xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-8 w-full h-full">
              {/* Left column - Portal options */}
              <div className="flex flex-col space-y-6 md:w-1/2 justify-center">
                {/* Police Button */}
                <Link href="/login?role=police" className="block group">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800
                      hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300
                      border border-blue-400/20 cursor-pointer relative overflow-hidden"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/10 p-3 rounded-xl">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold">Police</h2>
                        <p className="text-blue-200 text-sm mt-1">Secure portal for law enforcement</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </Link>

                {/* Anonymous Button */}
                <Link href="/login?role=anonymous" className="block group">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800
                      hover:shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300
                      border border-blue-400/20 cursor-pointer relative overflow-hidden"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/10 p-3 rounded-xl">
                        <Lock className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold">Anonymous</h2>
                        <p className="text-blue-200 text-sm mt-1">Report incidents securely</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </Link>

                {/* Citizen Button */}
                <Link href="/login?role=citizen" className="block group">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="p-6 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-800
                      hover:shadow-lg hover:shadow-cyan-500/30 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300
                      border border-blue-400/20 cursor-pointer relative overflow-hidden"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/10 p-3 rounded-xl">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold">Citizen</h2>
                        <p className="text-blue-200 text-sm mt-1">File complaints and track status</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </Link>
              </div>

              {/* Right column - Help Service */}
              <div className="md:w-1/2 flex items-center">
                <Link href="/dashboard/communityDashboard" className="block w-full h-full group">
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="p-8 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600
                      hover:shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-2 hover:scale-102 transition-all duration-300
                      border border-blue-400/20 cursor-pointer relative overflow-hidden h-full flex flex-col justify-center items-center"
                  >
                    <div className="bg-white/10 p-4 rounded-full mb-6">
                      <HelpCircle className="h-16 w-16 text-white" />
                    </div>
                    <h3 className="text-3xl font-semibold text-center mb-4">
                      Need Help?
                    </h3>
                    <p className="text-xl text-center font-medium text-blue-100 mb-6">
                      Click here for our community<br /> help service
                    </p>
                    <div className="bg-white/10 rounded-lg px-4 py-2 mt-4">
                      <span className="text-blue-100">24/7 Support Available</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default CopConnectLanding

