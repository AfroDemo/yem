import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  LightBulbIcon,
  UserGroupIcon,
  ChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Founder & CEO',
      bio: 'Serial entrepreneur with 10+ years experience in startup mentoring',
      image: 'https://randomuser.me/api/portraits/men/42.jpg'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      role: 'Head of Mentorship',
      bio: 'Former business consultant passionate about youth development',
      image: 'https://randomuser.me/api/portraits/women/63.jpg'
    },
    {
      id: 3,
      name: 'James Wilson',
      role: 'Community Manager',
      bio: 'Connector who loves bringing people together for mutual growth',
      image: 'https://randomuser.me/api/portraits/men/25.jpg'
    }
  ];

  const values = [
    {
      icon: <LightBulbIcon className="h-10 w-10 text-blue-600" />,
      title: 'Innovation',
      description: 'We believe in fostering creative thinking and new approaches'
    },
    {
      icon: <UserGroupIcon className="h-10 w-10 text-blue-600" />,
      title: 'Community',
      description: 'Building supportive networks is at our core'
    },
    {
      icon: <ChartBarIcon className="h-10 w-10 text-blue-600" />,
      title: 'Growth',
      description: 'Continuous learning and development drive us'
    },
    {
      icon: <GlobeAltIcon className="h-10 w-10 text-blue-600" />,
      title: 'Impact',
      description: 'We measure success by the positive change we create'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Empowering the next generation of entrepreneurs through mentorship and community
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6">
              We exist to bridge the gap between aspiring entrepreneurs and experienced professionals. 
              Our platform connects young visionaries with mentors who can guide them through the challenges 
              of starting and growing a business.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Since our founding in 2020, we've facilitated over 5,000 mentorship connections and helped 
              launch hundreds of successful ventures.
            </p>
            <RouterLink
              to="/register"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Join Our Community
            </RouterLink>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Team working together"
              className="rounded-lg shadow-xl w-full"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-blue-600 mb-3">{member.role}</p>
                <p className="text-gray-700">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">5,000+</p>
              <p className="text-xl">Mentorship Connections</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">200+</p>
              <p className="text-xl">Cities Worldwide</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">92%</p>
              <p className="text-xl">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Whether you're looking for guidance or want to share your expertise, we have a place for you.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <RouterLink
            to="/for-mentees"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Find a Mentor
          </RouterLink>
          <RouterLink
            to="/for-mentors"
            className="px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            Become a Mentor
          </RouterLink>
        </div>
      </div>
    </div>
  );
};

export default About;