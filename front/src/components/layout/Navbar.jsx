// src/components/layout/Navbar.js
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext"; // Import the Auth context

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated,user, logout } = useAuth(); // Get isAuthenticated and logout from context

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Resources", path: "/resources" },
    { name: "Events", path: "/events" },
    { name: "Contact", path: "/contact" },
  ];

  const authNavItems = isAuthenticated ? (
    <div className="ml-4 flex items-center space-x-2">
      <RouterLink
        to={user?.role === "mentor" ? "/mentor" : "/dashboard"}
        className="px-4 py-2 border border-blue-600 text-sm font-medium text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
      >
        Dashboard
      </RouterLink>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-600 text-sm font-medium text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </div>
  ) : (
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
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <RouterLink
            to="/"
            className="text-xl font-bold text-gray-900 hover:text-blue-600 flex-grow"
          >
            YEM
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
            {authNavItems} {/* Display Login/Register or Profile/Logout */}
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
          {authNavItems} {/* Display Login/Register or Profile/Logout */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
