import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { MagnifyingGlassIcon, BookmarkIcon } from '@heroicons/react/24/outline';

function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`resources-tabpanel-${index}`}
      aria-labelledby={`resources-tab-${index}`}
    >
      {value === index && (
        <div className="py-6">
          {children}
        </div>
      )}
    </div>
  );
}

const Resources = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  // Mock data for resources
  const articles = [
    {
      id: 1,
      title: 'How to Validate Your Business Idea',
      category: 'Business Planning',
      author: 'Sarah Johnson',
      date: 'March 15, 2025',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      excerpt: 'Learn how to validate your business idea before investing significant time and resources.',
      tags: ['Business Idea', 'Validation', 'Market Research']
    },
    // ... other articles
  ];

  const videos = [
    {
      id: 1,
      title: 'Pitch Deck Essentials',
      category: 'Pitching',
      author: 'Robert Williams',
      date: 'March 12, 2025',
      image: 'https://images.unsplash.com/photo-1551836022-aaac162c2e43?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      duration: '15:24',
      tags: ['Pitch Deck', 'Investors', 'Presentation']
    },
    // ... other videos
  ];

  const templates = [
    {
      id: 1,
      title: 'Business Plan Template',
      category: 'Business Planning',
      author: 'Sarah Johnson',
      date: 'March 14, 2025',
      fileType: 'PDF',
      tags: ['Business Plan', 'Planning', 'Strategy']
    },
    // ... other templates
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl font-bold mb-4">Resource Library</h1>
          <p className="text-xl mb-8">
            Access valuable resources to help you on your entrepreneurial journey
          </p>
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search resources..."
              className="block w-full pl-10 pr-3 py-3 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Resources Content */}
      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="border-b border-gray-200">
          <nav className="flex justify-center -mb-px">
            {['Articles', 'Videos', 'Templates & Tools'].map((tab, index) => (
              <button
                key={tab}
                onClick={() => handleTabChange(index)}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  tabValue === index 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Articles Tab */}
        <TabPanel value={tabValue} index={0}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row h-full">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full md:w-48 h-48 md:h-auto object-cover"
                />
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-xs uppercase text-gray-500">
                    {article.category}
                  </span>
                  <h2 className="text-xl font-semibold mt-1 mb-2">{article.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">
                    By {article.author} • {article.date}
                  </p>
                  <p className="text-sm text-gray-700 mb-4">{article.excerpt}</p>
                  <div className="mt-auto flex justify-between items-center">
                    <RouterLink
                      to={`/resources/articles/${article.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Read More
                    </RouterLink>
                    <button className="text-gray-400 hover:text-gray-600">
                      <BookmarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {article.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabPanel>

        {/* Videos Tab */}
        <TabPanel value={tabValue} index={1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                <div className="relative">
                  <img
                    src={video.image}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white px-2 py-1 rounded-tl-md">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <span className="text-xs uppercase text-gray-500">
                    {video.category}
                  </span>
                  <h2 className="text-lg font-semibold mt-1 mb-2">{video.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    By {video.author} • {video.date}
                  </p>
                  <div className="mt-auto flex justify-between items-center">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">
                      Watch Video
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <BookmarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {video.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabPanel>

        {/* Templates Tab */}
        <TabPanel value={tabValue} index={2}>
          <div className="space-y-4">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="sm:col-span-2">
                    <span className="text-xs uppercase text-gray-500">
                      {template.category} • {template.fileType}
                    </span>
                    <h2 className="text-lg font-semibold mt-1">{template.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      By {template.author} • {template.date}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {template.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-start sm:justify-end gap-2">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">
                      Download
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <BookmarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabPanel>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
          <p className="text-lg text-gray-600 mb-8">
            Explore resources tailored to different aspects of entrepreneurship.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Business Planning', 'Marketing', 'Finance', 'Legal', 'Product Development', 'Sales', 'Leadership', 'Technology'].map((category) => (
              <button
                key={category}
                className="px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="bg-blue-50 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Get Weekly Resources</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter to receive curated resources for young entrepreneurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <div className="sm:w-2/3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:w-1/3">
              <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;