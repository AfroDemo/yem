import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "For Mentees", path: "/for-mentees" },
    { name: "For Mentors", path: "/for-mentors" },
    { name: "Resources", path: "/resources" },
    { name: "Events", path: "/events" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <RouterLink
              to="/"
              className="text-xl font-bold text-gray-900 hover:text-blue-600"
            >
              Youth Entrepreneur Mentorship
            </RouterLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <RouterLink
                key={item.name}
                to={item.path}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              >
                {item.name}
              </RouterLink>
            ))}

            <div className="ml-4 flex items-center space-x-2">
              <RouterLink
                to="/login"
                className="px-4 py-2 border border-blue-600 text-sm font-medium text-blue-600 rounded-md hover:bg-blue-50"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/register"
                className="px-4 py-2 bg-blue-600 text-sm font-medium text-white rounded-md hover:bg-blue-700"
              >
                Register
              </RouterLink>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <XIcon className="block h-6 w-6" />
              ) : (
                <MenuIcon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <RouterLink
                key={item.name}
                to={item.path}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              >
                {item.name}
              </RouterLink>
            ))}
            <div className="pt-4 pb-2 border-t border-gray-200">
              <RouterLink
                to="/login"
                className="block w-full px-4 py-2 text-left text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/register"
                className="block w-full mt-2 px-4 py-2 text-left text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Register
              </RouterLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
