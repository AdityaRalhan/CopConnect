
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Navbar from "../HelpingComponents/Navbar";

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
    if (!role || !["police", "citizen", "anonymous", "community"].includes(role)) {
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
<<<<<<< HEAD
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
=======
      if (!response.ok) throw new Error(data.message || "Something went wrong");
>>>>>>> bd4cc6b545b67df56b95f554d722b0185fab6322

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

<<<<<<< HEAD
  const capitalizedRole = role?.charAt(0).toUpperCase() + role?.slice(1);
=======
  const getImageSrc = () => {
    const imageMap = {
      police: "/policeBg.jpg",
      citizen: "/citizenBg.jpg",
      anonymous: "/anonymousBg.jpg",
    };
    return imageMap[role] || "/defaultBg.jpg";
  };
>>>>>>> bd4cc6b545b67df56b95f554d722b0185fab6322

  return (
    <>
      <Navbar />
      {role !== "anonymous" && (
<<<<<<< HEAD
        <div className="min-h-screen flex items-center bg-gradient-to-b from-gray-900 to-blue-900">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-5xl pb-8 pl-16 font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              {isSignup ? "Sign Up" : "Login"} as {capitalizedRole}
            </h1>

            <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-xl flex-shrink-0 ml-20">
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                {role === "police" && (
                  <>
                    <input
                      type="text"
                      name="badgeNumber"
                      placeholder="Badge Number"
                      className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring focus:ring-blue-500"
                      value={credentials.badgeNumber}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring focus:ring-blue-500"
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
                      placeholder="Name"
                      className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring focus:ring-blue-500"
                      value={credentials.name}
                      onChange={handleChange}
                    />
                   <input
                      type="tel"
                      name="phone"
                      placeholder="Mobile Number"
                      className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring focus:ring-blue-500"
                      value={credentials.phone}
                      onChange={handleChange}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      }}
                      maxLength="10"
                    />

                  </>
                )}

                {role === "community" && (
                  <>
                    <input
                      type="text"
                      name="adminId"
                      placeholder="Admin ID"
                      className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring focus:ring-blue-500"
                      value={credentials.adminId}
                      onChange={handleChange}
                    />
                  </>
                )}

                {/* Common password input for all except anonymous */}
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring focus:ring-blue-500"
                  value={credentials.password}
                  onChange={handleChange}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${
                    loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
                  } text-white p-3 rounded-lg transition`}
                >
                  {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
                </button>
              </form>

              <p className="text-gray-400 text-sm text-center mt-4">
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

          {/* Right Section: Role-specific background image */}
          <div className="absolute top-4 right-8 bottom-4 w-1/2 h-[95%] rounded-3xl overflow-hidden">
            <img
              src={`/${role ?? "default"}Bg.jpg`}
              alt="Login Background"
              className="w-full h-full object-cover rounded-3xl"
=======
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white flex flex-col lg:flex-row items-center justify-center px-4 pt-6 pb-16 lg:pt-8 lg:pb-8 gap-8">
          {/* Left: Form Section */}
          <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl p-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              {isSignup ? "Sign Up" : "Login"} as{" "}
              {role?.charAt(0).toUpperCase() + role?.slice(1)}
            </h1>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <form onSubmit={handleAuth} className="space-y-4 mt-4">
              {role === "police" && (
                <>
                  <input
                    type="text"
                    name="badgeNumber"
                    placeholder="Badge Number"
                    className="input-style"
                    value={credentials.badgeNumber}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="input-style"
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
                    placeholder="Name"
                    className="input-style"
                    value={credentials.name}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Mobile Number"
                    className="input-style"
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
                    placeholder="Admin ID"
                    className="input-style"
                    value={credentials.adminId}
                    onChange={handleChange}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="input-style"
                    value={credentials.password}
                    onChange={handleChange}
                  />
                </>
              )}
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input-style"
                value={credentials.password}
                onChange={handleChange}
              />
              <button
                type="submit"
                className="w-full bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition"
              >
                {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-4">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                className="text-blue-400 hover:underline"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? "Login" : "Sign Up"}
              </button>
            </p>
          </div>

          {/* Right: Image Section */}
          <div className="w-full max-w-xl hidden lg:block">
            <img
              src={getImageSrc()}
              alt="Login Background"
              className="rounded-2xl w-full h-auto object-cover shadow-lg"
>>>>>>> bd4cc6b545b67df56b95f554d722b0185fab6322
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
