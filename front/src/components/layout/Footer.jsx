import React from "react";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white py-12 mt-auto border-t border-gray-200">
      <div className="container mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div className="col-span-1">
            <h6 className="text-lg font-semibold text-gray-900 mb-4">
              Youth Entrepreneur Mentorship
            </h6>
            <p className="text-sm text-gray-600">
              Connecting young entrepreneurs with experienced mentors to help
              build the future.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="col-span-1">
            <h6 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h6>
            <div className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
              ].map((item) => (
                <div key={item.name}>
                  <RouterLink
                    to={item.path}
                    className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors"
                  >
                    {item.name}
                  </RouterLink>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 - Resources */}
          <div className="col-span-1">
            <h6 className="text-lg font-semibold text-gray-900 mb-4">
              Resources
            </h6>
            <div className="space-y-2">
              {[
                { name: "Articles", path: "/resources/articles" },
                { name: "Events", path: "/events" },
                { name: "Success Stories", path: "/success-stories" },
                { name: "FAQ", path: "/faq" },
              ].map((item) => (
                <div key={item.name}>
                  <RouterLink
                    to={item.path}
                    className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors"
                  >
                    {item.name}
                  </RouterLink>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4 - Contact */}
          <div className="col-span-1">
            <h6 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Us
            </h6>
            <p className="text-sm text-gray-600 mb-4">
              Have questions or feedback? We'd love to hear from you.
            </p>
            <RouterLink
              to="/contact"
              className="inline-block px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </RouterLink>
          </div>
        </div>

        <div className="mt-12">
          <div className="border-t border-gray-200 mb-4"></div>
          <p className="text-sm text-gray-600 text-center">
            © {new Date().getFullYear()} Youth Entrepreneur Mentorship Platform.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
