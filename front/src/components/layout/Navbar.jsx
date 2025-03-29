import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Bars3Icon as MenuIcon, XMarkIcon as XIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <RouterLink
            to="/"
            className="text-xl font-bold text-gray-900 hover:text-blue-600 flex-grow"
          >
            Youth Entrepreneur Mentorship
          </RouterLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
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
                className="px-4 py-2 border border-blue-600 text-sm font-medium text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/register"
                className="px-4 py-2 bg-blue-600 text-sm font-medium text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Register
              </RouterLink>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${mobileOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          {navItems.map((item) => (
            <RouterLink
              key={item.name}
              to={item.path}
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileOpen(false)}
            >
              {item.name}
            </RouterLink>
          ))}
          <div className="pt-2 border-t border-gray-200">
            <RouterLink
              to="/login"
              className="block w-full px-4 py-2 mt-2 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              className="block w-full px-4 py-2 mt-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              onClick={() => setMobileOpen(false)}
            >
              Register
            </RouterLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
