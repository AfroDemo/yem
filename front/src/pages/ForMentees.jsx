import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  CheckCircleIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const MentorProfiles = () => {
  // Mock data for mentors
  const mentors = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Tech Entrepreneur',
      expertise: ['Software Development', 'Startup Growth', 'Product Management'],
      experience: 8,
      bio: 'Founder of two successful tech startups with over 8 years of experience in software development and product management. Passionate about helping young entrepreneurs navigate the tech industry.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Marketing Director',
      expertise: ['Digital Marketing', 'Brand Strategy', 'Social Media'],
      experience: 10,
      bio: 'Marketing Director with 10+ years of experience working with Fortune 500 companies and startups. Specializes in digital marketing strategies and brand development.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 3,
      name: 'Aisha Patel',
      title: 'Finance Consultant',
      expertise: ['Investment', 'Financial Planning', 'Fundraising'],
      experience: 12,
      bio: 'Finance professional with experience in investment banking and venture capital. Helps entrepreneurs understand financial planning, fundraising, and sustainable growth strategies.',
      image: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
      id: 4,
      name: 'David Rodriguez',
      title: 'E-commerce Specialist',
      expertise: ['E-commerce', 'Supply Chain', 'International Business'],
      experience: 7,
      bio: 'Built and scaled multiple e-commerce businesses across different markets. Expert in supply chain management and international business operations.',
      image: 'https://randomuser.me/api/portraits/men/75.jpg'
    },
    {
      id: 5,
      name: 'Jennifer Lee',
      title: 'Creative Director',
      expertise: ['Design Thinking', 'UX/UI', 'Brand Identity'],
      experience: 9,
      bio: 'Creative Director with background in design thinking and user experience. Helps entrepreneurs build compelling brand identities and user-centered products.',
      image: 'https://randomuser.me/api/portraits/women/22.jpg'
    },
    {
      id: 6,
      name: 'Robert Williams',
      title: 'Sales Executive',
      expertise: ['B2B Sales', 'Negotiation', 'Business Development'],
      experience: 15,
      bio: 'Sales executive with experience in both B2B and B2C environments. Specializes in helping entrepreneurs develop effective sales strategies and business development plans.',
      image: 'https://randomuser.me/api/portraits/men/45.jpg'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Our Mentors</h1>
          <p className="text-xl mb-6">
            Connect with experienced professionals ready to guide you on your entrepreneurial journey
          </p>
          <div className="flex flex-wrap gap-4">
            <RouterLink
              to="/register"
              className="inline-flex items-center px-6 py-3 bg-blue-700 hover:bg-blue-800 rounded-md text-white transition-colors"
            >
              Apply as Mentee
            </RouterLink>
            <RouterLink
              to="/for-mentors"
              className="inline-flex items-center px-6 py-3 border border-white hover:bg-white hover:text-blue-600 rounded-md text-white transition-colors"
            >
              Become a Mentor
            </RouterLink>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Find the Perfect Mentor</h2>
          <p className="text-gray-600 mb-6">
            Browse our community of experienced mentors or use filters to find the perfect match for your needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Filter by Expertise
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Filter by Industry
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Filter by Experience
            </button>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
              <div 
                className="pt-[75%] relative bg-cover bg-center"
                style={{ backgroundImage: `url(${mentor.image})` }}
              ></div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold mb-2">{mentor.name}</h3>
                <p className="text-gray-600 mb-4">{mentor.title} • {mentor.experience} years</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.expertise.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 flex-grow">{mentor.bio}</p>
                
                <RouterLink
                  to={`/mentors/${mentor.id}`}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md transition-colors"
                >
                  View Profile
                </RouterLink>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Our Mentors Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose Our Mentors</h2>
          <p className="text-lg text-center text-gray-600 mb-8">
            Our mentors are carefully selected to provide the best guidance for young entrepreneurs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm h-full">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <BriefcaseIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Proven Experience</h3>
                <p className="text-gray-600">
                  All our mentors have at least 5 years of experience in their field and have demonstrated success in their ventures.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm h-full">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <AcademicCapIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Specialized Knowledge</h3>
                <p className="text-gray-600">
                  Our mentors bring specialized knowledge in various industries and functions, providing targeted guidance for your specific needs.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm h-full">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <UsersIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Commitment to Youth</h3>
                <p className="text-gray-600">
                  Our mentors are passionate about supporting young entrepreneurs and committed to helping the next generation succeed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-4">How Mentorship Works</h2>
        <p className="text-lg text-center text-gray-600 mb-8">
          Our structured mentorship program is designed to help you achieve your entrepreneurial goals.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-4">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Apply as a Mentee</h3>
                  <p className="text-gray-600">Create your profile and tell us about your business and goals.</p>
                </div>
              </li>
              
              <div className="border-l-2 border-gray-200 h-6 ml-3"></div>
              
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-4">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Get Matched</h3>
                  <p className="text-gray-600">We'll match you with mentors who have the expertise you need.</p>
                </div>
              </li>
              
              <div className="border-l-2 border-gray-200 h-6 ml-3"></div>
              
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-4">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Connect and Plan</h3>
                  <p className="text-gray-600">Meet your mentor and create a personalized mentorship plan.</p>
                </div>
              </li>
              
              <div className="border-l-2 border-gray-200 h-6 ml-3"></div>
              
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-4">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Regular Sessions</h3>
                  <p className="text-gray-600">Engage in regular mentoring sessions to work toward your goals.</p>
                </div>
              </li>
              
              <div className="border-l-2 border-gray-200 h-6 ml-3"></div>
              
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-4">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Track Progress</h3>
                  <p className="text-gray-600">Monitor your progress and adjust your plan as needed.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Mentorship Meeting"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your Entrepreneurial Journey?</h2>
          <p className="text-lg text-gray-700 mb-6">
            Join our community of young entrepreneurs and experienced mentors today.
          </p>
          <RouterLink
            to="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors"
          >
            Apply Now
          </RouterLink>
        </div>
      </div>
    </div>
  );
};

export default MentorProfiles;