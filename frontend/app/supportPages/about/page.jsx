import React from "react";
import Navbar from "@/app/HelpingComponents/Navbar";

const About = () => {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen text-white bg-gradient-to-b from-slate-900 via-blue-900 to-blue-800">

      {/* Main Content */}
      <main className="w-full px-6 py-12 mx-auto max-w-7xl">
        {/* Hero Section with Your Content */}
        <section className="mb-16">
          <h2 className="text-4xl font-extrabold text-blue-100">For You — The Heart of CopConnect</h2>
          
          <p className="max-w-3xl mt-6 text-lg leading-relaxed text-blue-200">
            At <span className="font-semibold text-white">CopConnect</span>, we're more than just a platform. We're a bridge between
            communities and law enforcement. Whether you're a vigilant citizen or a dedicated officer, everything here is built <span className="italic text-blue-100">for you</span>.
          </p>
        </section>

        {/* Cards Grid */}
        <div className="grid gap-6 mt-10 md:grid-cols-2">
          {/* For Citizens Card */}
          <div className="p-6 transition border border-blue-700 shadow-lg bg-blue-900/50 rounded-xl hover:shadow-blue-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-blue-700/50">
                <svg className="w-6 h-6 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-blue-100">For Citizens</h2>
            </div>
            <p className="text-blue-200">
              Stay informed, connected, and protected. Receive updates, request help, and engage with your community — all while knowing your data is safe.
            </p>
          </div>

          {/* For Officers Card */}
          <div className="p-6 transition border border-blue-700 shadow-lg bg-blue-900/50 rounded-xl hover:shadow-blue-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-blue-700/50">
                <svg className="w-6 h-6 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-blue-100">For Officers</h2>
            </div>
            <p className="text-blue-200">
              Empower your service with modern tools. Communicate clearly, respond faster, and gain real-time insights to serve better and safer.
            </p>
          </div>

          {/* Our Mission Card - Spans Full Width */}
          <div className="p-6 transition border border-blue-700 shadow-lg bg-blue-900/50 rounded-xl hover:shadow-blue-800 md:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-blue-700/50">
                <svg className="w-6 h-6 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-blue-100">Our Mission</h2>
            </div>
            <p className="text-blue-200">
              We believe in trust, transparency, and teamwork. CopConnect redefines how safety is delivered — not top-down, but side-by-side.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="p-8 mt-16 text-center border bg-blue-800/30 border-blue-700/50 rounded-2xl">
          <h3 className="text-xl font-medium text-white">Together, we build stronger, safer communities.</h3>
          <p className="mt-2 mb-6 text-blue-200">CopConnect — made for connection, driven by trust.</p>
          <button className="px-8 py-3 font-medium text-white transition-all bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700">
            Join Now
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-8 mx-auto border-t max-w-7xl border-blue-700/30">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-blue-800 rounded">
              <svg className="w-4 h-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-blue-200">CopConnect © 2025</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-blue-300 transition-colors hover:text-white">Privacy</a>
            <a href="#" className="text-blue-300 transition-colors hover:text-white">Terms</a>
            <a href="#" className="text-blue-300 transition-colors hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default About;
