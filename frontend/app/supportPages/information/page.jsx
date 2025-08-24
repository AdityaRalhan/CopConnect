"use client";
import { Shield } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Information = () => {
  const [laws, setLaws] = useState([]);
  const router = useRouter();

  useEffect(() => {
  fetch('http://localhost:5001/api/information')
    .then((response) => response.json())
    .then((data) => setLaws(data))
    .catch((error) => console.error('Error fetching laws:', error));
}, []);


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-blue-800 text-white">
      <main className="w-full max-w-7xl mx-auto px-6 py-12">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center px-4 py-2 transparent hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all"
        >
         <div className="flex items-center space-x-2">
                <Shield className="text-blue-400 h-8 w-8" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                  CopConnect
                </span>
              </div>
        </button>

        {/* Page Header */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold text-blue-100">Citizen Awareness - Know Your Rights</h1>
          <p className="mt-4 text-blue-200 max-w-2xl mx-auto">
            CopConnect empowers citizens to make informed decisions. Know the laws, understand your rights, and connect with the right authorities confidently.
          </p>
        </section>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {laws.map((law, index) => (
            <div
              key={index}
              className="bg-blue-900/50 border border-blue-700 p-6 rounded-xl shadow-lg hover:shadow-blue-800 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer group"
            >
              <h2 className="text-2xl font-bold text-blue-100 mb-4 group-hover:text-white transition-colors duration-300">{law.title}</h2>
              <p className="text-blue-200 mb-6 group-hover:text-blue-100 transition-colors duration-300">{law.description}</p>
              <a
                href={law.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all text-white font-medium shadow-md"
              >
                View Official Details
              </a>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center p-8 bg-blue-800/30 border border-blue-700/50 rounded-2xl">
          <h3 className="text-xl text-white font-medium">Stay Aware, Stay Empowered.</h3>
          <p className="text-blue-200 mt-2 mb-6">Explore more laws and take charge of your safety and rights.</p>
          <a 
            href="https://lawcommissionofindia.nic.in/cat_indian_penal_code/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all text-white font-medium shadow-lg"
          >
            Learn More
          </a>
        </div>
      </main>
    </div>
  );
};

export default Information;
