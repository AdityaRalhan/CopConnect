"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../HelpingComponents/Navbar";
import Image from "next/image";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const [isSignup, setIsSignup] = useState(false);
  const [credentials, setCredentials] = useState({
    name: "",
    phone: "",
    badgeNumber: "",
    adminId: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!role || !["police", "citizen", "community", "anonymous"].includes(role)) {
      router.push("/");
    }
    if (role === "anonymous") {
      sessionStorage.setItem("loggedIn", "anonymous");
      router.push("/dashboard/anonymousDashboard");
    }
  }, [role, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isSignup
      ? "http://localhost:5001/api/users/register"
      : "http://localhost:5001/api/users/login";
    const payload = { ...credentials, role };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      if (data.token) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("data", JSON.stringify(data));
        router.push(`/dashboard/${role}Dashboard`);
      } else {
        setError("❌ Unexpected error, please try again.");
      }
    } catch (error) {
      setError(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {role !== "anonymous" && (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-blue-950 text-white flex flex-col lg:flex-row items-center justify-center px-6 py-10 gap-10">
          {/* Hero Text Section */}
          <div className="w-full max-w-xl p-8 rounded-3xl bg-gradient-to-br from-blue-900/40 to-blue-800/10 border border-white/10 shadow-xl backdrop-blur-md">
            <h2 className="text-4xl font-bold text-cyan-300 mb-4">
              {role === "citizen"
                ? "Empowering Citizens"
                : role === "police"
                ? "Police Access Portal"
                : role === "community"
                ? "For Community Helpers"
                : "Secure Access"}
            </h2>
            <p className="text-white/80 text-lg mb-6 leading-relaxed">
              {role === "citizen"
                ? "Raise complaints, get updates, and connect with law enforcement — all in one place."
                : role === "police"
                ? "Log in securely to view and manage public reports and community safety tasks."
                : role === "community"
                ? "Support citizens, report issues, and contribute to a safer neighborhood."
                : "Get started with CopConnect to access your dashboard."}
            </p>

            {role === "citizen" && (
              <div className="flex flex-col md:flex-row items-center gap-5">
                
                <ul className="space-y-3 text-white/70 text-base md:w-1/2">
                  <li>📌 Register and track your complaints</li>
                  <li>📞 Reach out to local police</li>
                  <li>📍 Get real-time status updates</li>
                </ul>
                <div className="md:w-1/2">
                  <Image
                    src="/citizenBg.jpg"
                    alt="Citizen Illustration"
                    width={300}
                    height={200}
                    className="w-full h-auto max-w-sm rounded-xl object-cover shadow-lg"
                  />
                </div>
              </div>
            )}

            {role === "police" && (
  <div className="flex flex-col md:flex-row items-center gap-4">
    <ul className="space-y-3 text-white/70 text-base md:w-1/2">
      <li>🔐 Access complaint database</li>
      <li>📊 Monitor case progress</li>
      <li>🗂️ Verify citizen reports</li>
    </ul>
    <div className="md:w-1/2">
      <Image
        src="/policeBg.jpg"
        alt="Police Illustration"
        width={300}
        height={200}
        className="rounded-xl object-cover shadow-md"
      />
    </div>
  </div>
)}


            {role === "community" && (
              <ul className="space-y-3 text-white/70 text-base">
                <li>💡 Help moderate neighborhood reports</li>
                <li>🔗 Collaborate with local officers</li>
                <li>📣 Spread awareness & info</li>
              </ul>
            )}
          </div>

          {/* Form Section */}
          <div className="w-full max-w-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10 backdrop-blur-md">
            <h1 className="text-3xl font-bold text-center text-white mb-6">
              {isSignup ? "Create your account" : "Welcome back"}
              <span className="block text-sm font-medium text-blue-300 mt-1">
                {isSignup ? `Signing up as ${role}` : `Logging in as ${role}`}
              </span>
            </h1>

            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

            <form onSubmit={handleAuth} className="space-y-5">
              {role === "police" && (
                <>
                  <input
                    type="text"
                    name="badgeNumber"
                    placeholder="👮 Badge Number"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-al"
                    value={credentials.badgeNumber}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="🧑 Name"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-al"
                    value={credentials.name}
                    onChange={handleChange}
                  />
                </>
              )}

              {role === "citizen" && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="🧑 Name"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-al"
                    value={credentials.name}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="📱 Mobile Number"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-al"
                    value={credentials.phone}
                    onChange={handleChange}
                  />
                </>
              )}

              {role === "community" && (
                <>
                  <input
                    type="text"
                    name="adminId"
                    placeholder="🆔 Admin ID"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-al"
                    value={credentials.adminId}
                    onChange={handleChange}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="🔒 Password"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-al"
                    value={credentials.password}
                    onChange={handleChange}
                  />
                </>
              )}

              <input
                type="password"
                name="password"
                placeholder="🔒 Password"
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-al"
                value={credentials.password}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg text-lg font-semibold hover:brightness-110 transition-all"
              >
                {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-300 mt-6">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                className="text-blue-400 hover:underline"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? "Login" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
