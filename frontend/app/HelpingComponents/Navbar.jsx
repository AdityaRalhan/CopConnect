import React from "react";
import { Shield } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Shield className="text-blue-400 h-8 w-8" />
            <span className="ml-2 text-2xl font-bold text-white">
              CopConnect
            </span>
            </Link>
          </div>
          
          {/* Replace this part inside the <div className="flex justify-between h-16 items-center"> */}
<div className="flex items-center space-x-6">
  <Link href="/supportPages/about" className="text-blue-300 hover:text-blue-100 hover:underline transition-all duration-200">
    About Us
  </Link>
  <Link href="/information" className="text-blue-300 hover:text-blue-100 hover:underline transition-all duration-200">
    Information
  </Link>
</div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
