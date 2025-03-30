import { Filter, Plus, Search, UserPlus, Users } from "lucide-react";
import { useState } from "react";

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState("connections");

  const connections = [
    {
      id: 1,
      name: "Emily Chen",
      role: "Tech Startup Founder",
      location: "San Francisco, CA",
      industry: "Technology",
      image: "/placeholder.svg?height=100&width=100",
      mutualConnections: 4,
      isConnected: true,
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Marketing Consultant",
      location: "New York, NY",
      industry: "Marketing",
      image: "/placeholder.svg?height=100&width=100",
      mutualConnections: 2,
      isConnected: true,
    },
    {
      id: 3,
      name: "Sophia Rodriguez",
      role: "E-commerce Entrepreneur",
      location: "Miami, FL",
      industry: "Retail",
      image: "/placeholder.svg?height=100&width=100",
      mutualConnections: 5,
      isConnected: true,
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Financial Advisor",
      location: "Chicago, IL",
      industry: "Finance",
      image: "/placeholder.svg?height=100&width=100",
      mutualConnections: 3,
      isConnected: true,
    },
    {
      id: 5,
      name: "Jessica Williams",
      role: "UX Designer",
      location: "Austin, TX",
      industry: "Design",
      image: "/placeholder.svg?height=100&width=100",
      mutualConnections: 1,
      isConnected: true,
    },
    {
      id: 6,
      name: "Michael Brown",
      role: "Angel Investor",
      location: "Boston, MA",
      industry: "Finance",
      image: "/placeholder.svg?height=100&width=100",
      mutualConnections: 6,
      isConnected: true,
    },
  ];

  const requests = [
    {
      id: 7,
      name: "Alex Johnson",
      role: "Software Developer",
      location: "Seattle, WA",
      industry: "Technology",
      image: "/placeholder.svg?height=100&width=100",
      mutualConnections: 3,
      isPending: true,
    },
    {
      id: 8,
      name: "Sarah Miller",
      role: "Content Creator",
      location: "Los Angeles, CA",
      industry: "Media",
      image: "/placeholder.svg?height=100&width=100",
      mutualConnections: 2,
      isPending: true,
    },
    {
      id: 9,
      name: "James Wilson",
      role: "Business Consultant",
      location: "Denver, CO",
      industry: "Consulting",
      image: "/placeholder.svg?height=100&width=100",
      mutualConnections: 4,
      isPending: true,
    },
  ];

  const suggestions = [
    {
      id: 10,
      name: "Lisa Park",
      role: "Product Manager",
      location: "Portland, OR",
      industry: "Technology",
      image: "/placeholder.svg?height=100&width=100",
      mutualConnections: 7,
      isSuggestion: true,
    },
    {
      id: 11,
      name: "Robert Chen",
      role: "Venture Capitalist",
      location: "San Francisco, CA",
      industry: "Finance",
      image: "/placeholder.svg?height=100&width=100",
      mutualConnections: 5,
      isSuggestion: true,
    },
    {
      id: 12,
      name: "Olivia Martinez",
      role: "Social Media Strategist",
      location: "Miami, FL",
      industry: "Marketing",
      image: "/placeholder.svg?height=100&width=100",
      mutualConnections: 3,
      isSuggestion: true,
    },
    {
      id: 13,
      name: "Daniel Kim",
      role: "E-commerce Specialist",
      location: "Chicago, IL",
      industry: "Retail",
      image: "/placeholder.svg?height=100&width=100",
      mutualConnections: 4,
      isSuggestion: true,
    },
    {
      id: 14,
      name: "Natalie Wong",
      role: "Startup Founder",
      location: "Austin, TX",
      industry: "Technology",
      image: "/placeholder.svg?height=100&width=100",
      mutualConnections: 2,
      isSuggestion: true,
    },
    {
      id: 15,
      name: "Thomas Garcia",
      role: "Business Development",
      location: "New York, NY",
      industry: "Sales",
      image: "/placeholder.svg?height=100&width=100",
      mutualConnections: 6,
      isSuggestion: true,
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Network
        </h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <UserPlus className="h-4 w-4" />
            <span>Invitations</span>
            <span className="ml-2 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              3
            </span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <span>Find Connections</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search your network..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("connections")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "connections"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Connections
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "requests"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Requests
              </button>
              <button
                onClick={() => setActiveTab("suggestions")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "suggestions"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Suggestions
              </button>
            </nav>
          </div>

          {/* Connections Grid */}
          {activeTab === "connections" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {connections.map((connection) => (
                <ConnectionCard key={connection.id} {...connection} />
              ))}
            </div>
          )}

          {activeTab === "requests" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((request) => (
                <ConnectionCard key={request.id} {...request} />
              ))}
            </div>
          )}

          {activeTab === "suggestions" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((suggestion) => (
                <ConnectionCard key={suggestion.id} {...suggestion} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/3 space-y-6">
          {/* Network Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Network Stats
              </h2>
              <p className="text-sm text-gray-500">Your networking overview</p>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Total Connections
                    </p>
                    <p className="text-sm text-gray-500">Your network size</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-900">68</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">New Connections</p>
                    <p className="text-sm text-gray-500">Last 30 days</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-900">12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-600"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Profile Views</p>
                    <p className="text-sm text-gray-500">Last 30 days</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-900">47</span>
              </div>
            </div>
          </div>

          {/* Industry Connections */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Industry Connections
              </h2>
              <p className="text-sm text-gray-500">Your network by industry</p>
            </div>
            <div className="p-4 space-y-2">
              <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center">
                  <span className="mr-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    24
                  </span>
                  <span>Technology</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center">
                  <span className="mr-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    18
                  </span>
                  <span>Marketing</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center">
                  <span className="mr-2 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    12
                  </span>
                  <span>Finance</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center">
                  <span className="mr-2 bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    8
                  </span>
                  <span>Retail</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center">
                  <span className="mr-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    6
                  </span>
                  <span>Design</span>
                </div>
              </button>
            </div>
          </div>

          {/* Upcoming Networking Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Upcoming Networking Events
              </h2>
              <p className="text-sm text-gray-500">Connect with your network</p>
            </div>
            <div className="p-4 space-y-4">
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    Networking Mixer
                  </h4>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    Networking
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  April 22, 2025 • 6:00 PM
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  Connect with fellow entrepreneurs in a casual setting.
                </p>
                <div className="flex -space-x-2">
                  <img
                    src="/placeholder.svg?height=30&width=30"
                    alt="Attendee"
                    className="h-7 w-7 rounded-full border-2 border-white"
                  />
                  <img
                    src="/placeholder.svg?height=30&width=30"
                    alt="Attendee"
                    className="h-7 w-7 rounded-full border-2 border-white"
                  />
                  <img
                    src="/placeholder.svg?height=30&width=30"
                    alt="Attendee"
                    className="h-7 w-7 rounded-full border-2 border-white"
                  />
                  <div className="flex items-center justify-center h-7 w-7 rounded-full border-2 border-white bg-gray-100 text-xs text-gray-700">
                    +12
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    Industry Roundtable
                  </h4>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    Discussion
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  May 8, 2025 • 4:00 PM
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  Join industry leaders for an insightful discussion.
                </p>
                <div className="flex -space-x-2">
                  <img
                    src="/placeholder.svg?height=30&width=30"
                    alt="Attendee"
                    className="h-7 w-7 rounded-full border-2 border-white"
                  />
                  <img
                    src="/placeholder.svg?height=30&width=30"
                    alt="Attendee"
                    className="h-7 w-7 rounded-full border-2 border-white"
                  />
                  <div className="flex items-center justify-center h-7 w-7 rounded-full border-2 border-white bg-gray-100 text-xs text-gray-700">
                    +8
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                View All Networking Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectionCard({
  name,
  role,
  location,
  industry,
  image,
  mutualConnections,
  isConnected,
  isPending,
  isSuggestion,
}) {
  const getIndustryColor = (industry) => {
    switch (industry) {
      case "Technology":
        return "bg-blue-100 text-blue-800";
      case "Marketing":
        return "bg-green-100 text-green-800";
      case "Finance":
        return "bg-purple-100 text-purple-800";
      case "Retail":
        return "bg-amber-100 text-amber-800";
      case "Design":
        return "bg-red-100 text-red-800";
      case "Media":
        return "bg-indigo-100 text-indigo-800";
      case "Consulting":
        return "bg-teal-100 text-teal-800";
      case "Sales":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative h-20 w-20 mb-4">
            <img
              src={image}
              alt={name}
              className="h-full w-full rounded-full object-cover"
            />
            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 font-medium">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          </div>
          <h4 className="font-medium text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500 mb-1">{role}</p>
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {location}
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full mb-3 ${getIndustryColor(
              industry
            )}`}
          >
            {industry}
          </span>
          {mutualConnections > 0 && (
            <p className="text-xs text-gray-500 mb-4">
              {mutualConnections} mutual connection
              {mutualConnections !== 1 ? "s" : ""}
            </p>
          )}

          {isConnected && (
            <div className="flex gap-2 w-full">
              <button className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                Message
              </button>
              <button className="flex-1 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                View Profile
              </button>
            </div>
          )}

          {isPending && (
            <div className="flex gap-2 w-full">
              <button className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                Ignore
              </button>
              <button className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Accept
              </button>
            </div>
          )}

          {isSuggestion && (
            <button className="w-full py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
              <Plus className="h-4 w-4 mr-2" />
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
