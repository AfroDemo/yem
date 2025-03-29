import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <div className="py-4">{children}</div>}
    </div>
  );
}

const Events = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  // Mock data for events
  const upcomingEvents = [
    {
      id: 1,
      title: "Startup Funding Workshop",
      type: "Workshop",
      date: "April 15, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Online",
      host: "Michael Chen",
      description:
        "Learn about different funding options for startups and how to prepare for investor meetings.",
      attendees: 45,
      maxAttendees: 100,
      tags: ["Funding", "Investors", "Startup"],
    },
    {
      id: 2,
      title: "Networking Mixer",
      type: "Networking",
      date: "April 22, 2025",
      time: "6:00 PM - 8:00 PM",
      location: "Innovation Hub, 123 Main St",
      host: "Sarah Johnson",
      description:
        "Connect with fellow entrepreneurs and mentors in a casual networking environment.",
      attendees: 28,
      maxAttendees: 50,
      tags: ["Networking", "Community", "Connections"],
    },
    {
      id: 3,
      title: "Marketing Strategies Webinar",
      type: "Webinar",
      date: "May 5, 2025",
      time: "1:00 PM - 2:30 PM",
      location: "Online",
      host: "Jennifer Lee",
      description:
        "Discover effective marketing strategies for startups with limited budgets.",
      attendees: 72,
      maxAttendees: 200,
      tags: ["Marketing", "Digital", "Strategy"],
    },
    {
      id: 4,
      title: "Product Development Workshop",
      type: "Workshop",
      date: "May 12, 2025",
      time: "10:00 AM - 3:00 PM",
      location: "Tech Center, 456 Innovation Ave",
      host: "David Rodriguez",
      description:
        "Hands-on workshop covering the product development lifecycle from idea to launch.",
      attendees: 18,
      maxAttendees: 30,
      tags: ["Product", "Development", "Innovation"],
    },
  ];

  const pastEvents = [
    {
      id: 101,
      title: "Legal Basics for Startups",
      type: "Workshop",
      date: "March 10, 2025",
      location: "Online",
      host: "Robert Williams",
      attendees: 65,
      tags: ["Legal", "Startup", "Compliance"],
    },
    {
      id: 102,
      title: "Pitch Competition",
      type: "Competition",
      date: "February 28, 2025",
      location: "Entrepreneur Center, 789 Business Blvd",
      host: "Aisha Patel",
      attendees: 120,
      tags: ["Pitch", "Competition", "Funding"],
    },
    {
      id: 103,
      title: "Financial Planning for Entrepreneurs",
      type: "Webinar",
      date: "February 15, 2025",
      location: "Online",
      host: "Michael Chen",
      attendees: 88,
      tags: ["Finance", "Planning", "Cash Flow"],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Events & Workshops</h1>
          <p className="text-xl mb-6">
            Join our events to learn, connect, and grow your entrepreneurial
            skills
          </p>
          <div className="flex flex-wrap gap-4">
            <RouterLink
              to="/events/calendar"
              className="inline-flex items-center px-6 py-3 bg-blue-700 hover:bg-blue-800 rounded-md text-white transition-colors"
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              View Calendar
            </RouterLink>
            <RouterLink
              to="/contact"
              className="inline-flex items-center px-6 py-3 border border-white hover:bg-white hover:text-blue-600 rounded-md text-white transition-colors"
            >
              Suggest an Event
            </RouterLink>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Find Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="event-type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event Type
              </label>
              <select
                id="event-type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="">All Types</option>
                <option value="workshop">Workshops</option>
                <option value="webinar">Webinars</option>
                <option value="networking">Networking</option>
                <option value="competition">Competitions</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                placeholder="Online or City"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Search Events
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Events Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => handleTabChange(0)}
                  className={`px-4 py-2 font-medium ${
                    tabValue === 0
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Upcoming Events
                </button>
                <button
                  onClick={() => handleTabChange(1)}
                  className={`px-4 py-2 font-medium ${
                    tabValue === 1
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Past Events
                </button>
              </div>
            </div>

            {/* Upcoming Events Tab */}
            <TabPanel value={tabValue} index={0}>
              <div className="space-y-6">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {event.type}
                          </span>
                          <h3 className="text-2xl font-bold mt-1 mb-3">
                            {event.title}
                          </h3>

                          <div className="flex items-center text-gray-500 mb-1">
                            <CalendarIcon className="h-5 w-5 mr-2" />
                            <span className="text-sm">
                              {event.date} • {event.time}
                            </span>
                          </div>

                          <div className="flex items-center text-gray-500 mb-1">
                            {event.location.includes("Online") ? (
                              <VideoCameraIcon className="h-5 w-5 mr-2" />
                            ) : (
                              <MapPinIcon className="h-5 w-5 mr-2" />
                            )}
                            <span className="text-sm">{event.location}</span>
                          </div>

                          <div className="flex items-center text-gray-500 mb-4">
                            <UsersIcon className="h-5 w-5 mr-2" />
                            <span className="text-sm">
                              {event.attendees} attending •{" "}
                              {event.maxAttendees - event.attendees} spots left
                            </span>
                          </div>

                          <p className="text-gray-600 mb-4">
                            {event.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {event.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">
                              Hosted by:
                            </h4>
                            <p className="text-gray-700">{event.host}</p>
                          </div>

                          <div className="mt-4 space-y-2">
                            <RouterLink
                              to={`/events/${event.id}`}
                              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md transition-colors"
                            >
                              Register Now
                            </RouterLink>
                            <RouterLink
                              to={`/events/${event.id}`}
                              className="block w-full border border-blue-600 text-blue-600 hover:bg-blue-50 text-center py-2 px-4 rounded-md transition-colors"
                            >
                              Learn More
                            </RouterLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabPanel>

            {/* Past Events Tab */}
            <TabPanel value={tabValue} index={1}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendees
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pastEvents.map((event) => (
                        <tr key={event.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {event.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.attendees}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <RouterLink
                              to={`/events/${event.id}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              View Details
                            </RouterLink>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabPanel>
          </div>

          {/* Calendar Sidebar */}
          <div className="md:w-1/3 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Event Calendar</h3>
              <div className="p-2 border rounded-lg">
                {/* Simple calendar placeholder - consider using a library like react-datepicker */}
                <div className="text-center font-medium mb-2">
                  {selectedDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="text-xs text-center font-medium text-gray-500"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <button
                      key={day}
                      onClick={() =>
                        setSelectedDate(
                          new Date(
                            selectedDate.getFullYear(),
                            selectedDate.getMonth(),
                            day
                          )
                        )
                      }
                      className={`h-8 w-8 rounded-full text-sm ${
                        day === selectedDate.getDate()
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Event Categories</h3>
              <div className="border-t border-gray-200 mb-4"></div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Workshops",
                  "Webinars",
                  "Networking",
                  "Competitions",
                  "Conferences",
                ].map((category) => (
                  <button
                    key={category}
                    className="text-left py-2 px-3 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Host an Event Section */}
      <div className="bg-gray-50 py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-3xl font-bold mb-4">Want to Host an Event?</h2>
            <p className="text-gray-600 mb-6">
              Share your expertise with our community of young entrepreneurs by
              hosting a workshop, webinar, or networking event.
            </p>
            <RouterLink
              to="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors"
            >
              Apply to Host
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
