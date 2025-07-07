import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { getHomePageData } from "../services/homeService";
import Avatar from "../components/avatar/Avatar";
import AvatarImage from "../components/avatar/AvatarImage";
import AvatarFallback from "../components/avatar/AvatarFallback";

const Home = () => {
  const [data, setData] = useState({
    featuredMentors: [],
    stats: { activeMentors: 0, youngEntrepreneurs: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getHomePageData();
        setData(response);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-6">Connect. Learn. Grow.</h1>
              <p className="text-xl mb-8">
                Connecting young entrepreneurs with experienced mentors to help
                you build your future.
              </p>
              <div className="flex flex-wrap gap-4">
                <RouterLink
                  to="/register"
                  className="inline-block px-6 py-3 bg-blue-700 hover:bg-blue-800 rounded-md text-white transition-colors"
                >
                  Find a Mentor
                </RouterLink>
                <RouterLink
                  to="/register"
                  className="inline-block px-6 py-3 border border-white hover:bg-white hover:text-blue-600 rounded-md text-white transition-colors"
                >
                  Become a Mentor
                </RouterLink>
              </div>
            </div>
            <div>
              <img
                src="https://plus.unsplash.com/premium_photo-1707155466125-a7943a37e8f9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Mentorship"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">
              {data.stats.activeMentors}
            </p>
            <p className="text-lg">Active Mentors</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">
              {data.stats.youngEntrepreneurs}
            </p>
            <p className="text-lg">Young Entrepreneurs</p>
          </div>
        </div>
      </div>

      {/* Featured Mentors Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Featured Mentors
          </h2>
          <p className="text-xl text-center text-gray-600 mb-8">
            Connect with experienced professionals ready to guide you on your
            entrepreneurial journey.
          </p>
          {data.featuredMentors.length === 0 ? (
            <p className="text-center text-gray-600">
              No mentors available at this time.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.featuredMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                >
                  <div className="p-6 flex flex-col items-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={
                          "http://localhost:5000" + mentor.image ||
                          "/placeholder.svg?height=96&width=96"
                        }
                        alt="Profile picture"
                      />
                      <AvatarFallback>
                        {mentor.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold text-center">
                      {mentor.name}
                    </h3>
                    <p className="text-gray-600 text-center">{mentor.title}</p>
                    <p className="text-gray-500 text-sm text-center mt-2">
                      {mentor.expertise}
                    </p>
                  </div>
                  <div className="mt-auto p-4">
                    <RouterLink
                      to={`/mentors/${mentor.id}`}
                      className="block w-full border border-blue-600 text-blue-600 hover:bg-blue-50 text-center py-2 px-4 rounded-md transition-colors"
                    >
                      View Profile
                    </RouterLink>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <RouterLink
              to="/for-mentees"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Browse All Mentors
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
