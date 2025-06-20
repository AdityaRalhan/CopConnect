import React from "react";
import { Shield } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Shield className="text-blue-400 h-8 w-8" />
            <span className="ml-2 text-2xl font-bold text-white">
              CopConnect
            </span>
          </div>
          <Link href="/supportPages/about" className="text-blue-300 hover:text-blue-100 transition-colors">
            About Us
          </Link>
          <Link href="/information" className="text-blue-300 hover:text-blue-100 transition-colors">
            About Us
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
