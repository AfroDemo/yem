import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  // Mock data for featured mentors
  const featuredMentors = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Tech Entrepreneur',
      expertise: 'Software Development, Startup Growth',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Marketing Director',
      expertise: 'Digital Marketing, Brand Strategy',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 3,
      name: 'Aisha Patel',
      title: 'Finance Consultant',
      expertise: 'Investment, Financial Planning',
      image: 'https://randomuser.me/api/portraits/women/68.jpg'
    }
  ];

  // Mock data for success stories
  const successStories = [
    {
      id: 1,
      title: 'From Idea to Funded Startup',
      mentee: 'Jason Rodriguez',
      excerpt: 'With my mentor\'s guidance, I transformed my idea into a funded startup within 6 months.',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      title: 'Scaling My E-commerce Business',
      mentee: 'Emma Wilson',
      excerpt: 'My mentor helped me scale my e-commerce business from $5k to $50k monthly revenue.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ];

  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Startup Funding Workshop',
      date: 'April 15, 2025',
      type: 'Workshop'
    },
    {
      id: 2,
      title: 'Networking Mixer',
      date: 'April 22, 2025',
      type: 'Networking'
    },
    {
      id: 3,
      title: 'Marketing Strategies Webinar',
      date: 'May 5, 2025',
      type: 'Webinar'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-6">Connect. Learn. Grow.</h1>
              <p className="text-xl mb-8">
                Connecting young entrepreneurs with experienced mentors to help you build your future.
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-center">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">200+</p>
            <p className="text-lg">Active Mentors</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">500+</p>
            <p className="text-lg">Young Entrepreneurs</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">50+</p>
            <p className="text-lg">Success Stories</p>
          </div>
        </div>
      </div>

      {/* Featured Mentors Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Featured Mentors</h2>
          <p className="text-xl text-center text-gray-600 mb-8">
            Connect with experienced professionals ready to guide you on your entrepreneurial journey.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMentors.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                <div className="p-6 flex flex-col items-center">
                  <img 
                    src={mentor.image} 
                    alt={mentor.name}
                    className="w-32 h-32 rounded-full mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-center">{mentor.name}</h3>
                  <p className="text-gray-600 text-center">{mentor.title}</p>
                  <p className="text-gray-500 text-sm text-center mt-2">{mentor.expertise}</p>
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

      {/* Success Stories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-4">Success Stories</h2>
        <p className="text-xl text-center text-gray-600 mb-8">
          See how mentorship has helped young entrepreneurs achieve their goals.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {successStories.map((story) => (
            <div key={story.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
              <img
                src={story.image}
                alt={story.title}
                className="w-full md:w-48 h-48 object-cover flex-shrink-0"
              />
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-semibold">{story.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{story.mentee}</p>
                <p className="text-gray-700 mb-4">{story.excerpt}</p>
                <RouterLink
                  to={`/success-stories/${story.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Read Full Story
                </RouterLink>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <RouterLink
            to="/success-stories"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            View All Success Stories
          </RouterLink>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Upcoming Events</h2>
          <p className="text-xl text-center text-gray-600 mb-8">
            Join our workshops, webinars, and networking events to enhance your skills.
          </p>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-gray-600 text-sm">{event.date} • {event.type}</p>
                </div>
                <RouterLink
                  to={`/events/${event.id}`}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-md text-sm transition-colors"
                >
                  Details
                </RouterLink>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <RouterLink
              to="/events"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              View All Events
            </RouterLink>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-blue-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-700 mb-6">
            Subscribe to our newsletter for the latest events, resources, and opportunities.
          </p>
          <RouterLink
            to="/contact"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Subscribe Now
          </RouterLink>
        </div>
      </div>
    </div>
  );
};

export default Home;