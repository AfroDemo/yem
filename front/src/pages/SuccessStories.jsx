import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

const SuccessStories = () => {
  // Mock data for success stories (same as original)
  const featuredStories = [
    // ... same featuredStories data
  ];

  const moreStories = [
    // ... same moreStories data
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl font-bold mb-4">Success Stories</h1>
          <p className="text-xl mb-8">
            Real stories from young entrepreneurs who transformed their ideas into thriving businesses
          </p>
          <RouterLink
            to="/register"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium"
          >
            Start Your Success Story
          </RouterLink>
        </div>
      </div>

      {/* Featured Stories Section */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <h2 className="text-3xl font-bold mb-4 text-center">Featured Success Stories</h2>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Discover how our mentorship program has helped these entrepreneurs achieve their goals.
        </p>
        
        <div className="space-y-8">
          {featuredStories.map((story) => (
            <div key={story.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
              <img
                src={story.image}
                alt={story.title}
                className="w-full md:w-2/5 h-64 md:h-auto object-cover"
              />
              <div className="p-6 flex-1">
                <div className="flex items-center mb-4">
                  <ChatBubbleLeftIcon className="h-10 w-10 text-blue-600 mr-2" />
                  <h3 className="text-2xl font-semibold">{story.title}</h3>
                </div>
                
                <blockquote className="italic text-gray-700 mb-6">
                  "{story.content}"
                </blockquote>
                
                <hr className="my-6 border-gray-200" />
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={story.menteeImage} 
                      alt={story.mentee}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{story.mentee}</p>
                      <p className="text-sm text-gray-500">Founder, {story.business}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Mentored by</p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={story.mentorImage} 
                      alt={story.mentor}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{story.mentor}</p>
                      <p className="text-sm text-gray-500">Mentor</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Key Achievements:</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {story.achievements.map((achievement, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {story.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="border border-gray-300 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <RouterLink
                  to={`/success-stories/${story.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Read Full Story
                </RouterLink>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* More Success Stories Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold mb-4 text-center">More Success Stories</h2>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Explore more inspiring journeys from our community of entrepreneurs.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moreStories.map((story) => (
              <div key={story.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 flex-1">
                  <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {story.mentee}, {story.business}
                  </p>
                  <p className="text-gray-700 mb-4">{story.excerpt}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Mentored by {story.mentor}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {story.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="border border-gray-300 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="px-6 pb-4">
                  <RouterLink
                    to={`/success-stories/${story.id}`}
                    className="block w-full text-center border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium"
                  >
                    Read More
                  </RouterLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <h2 className="text-3xl font-bold mb-4 text-center">What Our Mentees Say</h2>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Hear directly from the entrepreneurs who have benefited from our mentorship program.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <ChatBubbleLeftIcon className="h-10 w-10 text-blue-600 mb-4" />
            <blockquote className="text-gray-700 mb-6">
              "The mentorship I received was transformative. My mentor didn't just give me advice; she helped me develop the skills and confidence to make better business decisions on my own."
            </blockquote>
            <div className="flex items-center">
              <img 
                src="https://randomuser.me/api/portraits/women/65.jpg" 
                alt="Rachel Kim"
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <p className="font-medium">Rachel Kim</p>
                <p className="text-sm text-gray-500">Founder, ArtisanAI</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <ChatBubbleLeftIcon className="h-10 w-10 text-blue-600 mb-4" />
            <blockquote className="text-gray-700 mb-6">
              "Having a mentor who had already navigated the challenges I was facing saved me countless hours and helped me avoid costly mistakes. The ROI on this mentorship has been immeasurable."
            </blockquote>
            <div className="flex items-center">
              <img 
                src="https://randomuser.me/api/portraits/men/67.jpg" 
                alt="Thomas Wright"
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <p className="font-medium">Thomas Wright</p>
                <p className="text-sm text-gray-500">CEO, FinTech Solutions</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <ChatBubbleLeftIcon className="h-10 w-10 text-blue-600 mb-4" />
            <blockquote className="text-gray-700 mb-6">
              "The network I gained through my mentor has been just as valuable as the advice. She introduced me to key industry contacts that have become crucial partners in our growth."
            </blockquote>
            <div className="flex items-center">
              <img 
                src="https://randomuser.me/api/portraits/women/33.jpg" 
                alt="Maya Patel"
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <p className="font-medium">Maya Patel</p>
                <p className="text-sm text-gray-500">Founder, EduTech Innovations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;