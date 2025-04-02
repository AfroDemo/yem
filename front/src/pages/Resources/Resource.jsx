import React, { useState } from "react";
import { BookOpen, Bookmark, Filter, Search } from "lucide-react";
import Progress from "../../components/progress";

// Button Component
const Button = ({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-gray-100",
    link: "text-blue-600 underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component
const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};

// Card Components
const Card = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className = "", children, ...props }) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ className = "", children, ...props }) => {
  return (
    <h3
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ className = "", children, ...props }) => {
  return (
    <p className={`text-sm text-gray-500 ${className}`} {...props}>
      {children}
    </p>
  );
};

const CardContent = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ className = "", children, ...props }) => {
  return (
    <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Tabs Components
const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === TabsList) {
        return React.cloneElement(child, { activeTab, setActiveTab });
      }
      if (child.type === TabsContent) {
        return React.cloneElement(child, { activeTab });
      }
    }
    return child;
  });

  return <div className="space-y-4">{childrenWithProps}</div>;
};

const TabsList = ({
  className = "",
  children,
  activeTab,
  setActiveTab,
  ...props
}) => {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 ${className}`}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
};

const TabsTrigger = ({
  value,
  children,
  activeTab,
  setActiveTab,
  ...props
}) => {
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 ${
        activeTab === value
          ? "bg-white shadow-sm"
          : "text-gray-500 hover:text-gray-900"
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, activeTab, ...props }) => {
  return activeTab === value ? (
    <div className="mt-2" {...props}>
      {children}
    </div>
  ) : null;
};

// Badge Component
const Badge = ({ className = "", variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-800",
    indigo: "bg-indigo-100 text-indigo-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// ResourceCard Component
const ResourceCard = ({
  title,
  type,
  category,
  author,
  description,
  rating,
  reviews,
  progress,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1">
              {type} • {category} • By {author}
            </CardDescription>
          </div>
          <Badge
            variant={
              type === "E-Book"
                ? "blue"
                : type === "Course"
                ? "green"
                : type === "Webinar Recording"
                ? "purple"
                : "default"
            }
          >
            {type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex items-center mt-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-sm font-medium">{rating}</span>
          <span className="mx-1.5 text-sm font-medium text-gray-500">•</span>
          <span className="text-sm text-gray-500">{reviews} reviews</span>
        </div>
        {progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between mb-1 text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        <Button size="sm" variant="ghost" className="gap-1">
          <Bookmark className="h-4 w-4" />
          Bookmark
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("all");

  const allResources = [
    {
      id: 1,
      title: "The Lean Startup Methodology",
      type: "E-Book",
      category: "Business Strategy",
      author: "Eric Ries",
      description:
        "Learn how to build a successful business with minimal resources and maximum impact.",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 2,
      title: "Digital Marketing for Beginners",
      type: "Course",
      category: "Marketing",
      author: "Sarah Johnson",
      description:
        "A comprehensive guide to digital marketing strategies for new entrepreneurs.",
      rating: 4.6,
      reviews: 89,
      progress: 35,
    },
    {
      id: 3,
      title: "Financial Planning for Startups",
      type: "Webinar Recording",
      category: "Finance",
      author: "Michael Chen",
      description:
        "Essential financial planning strategies for small business owners and entrepreneurs.",
      rating: 4.7,
      reviews: 56,
    },
    {
      id: 4,
      title: "Building a Strong Brand Identity",
      type: "E-Book",
      category: "Branding",
      author: "Jessica Williams",
      description:
        "Discover how to create a compelling brand that resonates with your target audience.",
      rating: 4.5,
      reviews: 78,
    },
    {
      id: 5,
      title: "Effective Leadership Skills",
      type: "Course",
      category: "Leadership",
      author: "David Thompson",
      description:
        "Develop the leadership skills needed to inspire and manage your team effectively.",
      rating: 4.9,
      reviews: 112,
      progress: 75,
    },
  ];

  const ebooks = allResources.filter((resource) => resource.type === "E-Book");
  const courses = allResources.filter((resource) => resource.type === "Course");
  const webinars = allResources.filter(
    (resource) => resource.type === "Webinar Recording"
  );

  const learningProgress = [
    {
      id: 2,
      title: "Digital Marketing for Beginners",
      progress: 35,
    },
    {
      id: 5,
      title: "Effective Leadership Skills",
      progress: 75,
    },
    {
      id: 6,
      title: "Sales Techniques Masterclass",
      progress: 10,
    },
  ];

  const recommendedResources = [
    {
      id: 7,
      title: "Social Media Marketing Strategies",
      type: "Course",
      duration: "3.5 hours",
    },
    {
      id: 8,
      title: "Pitch Deck Essentials",
      type: "E-Book",
      duration: "45 min read",
    },
    {
      id: 9,
      title: "Customer Acquisition Strategies",
      type: "Webinar",
      duration: "1 hour",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Resources</h1>
        <Button variant="outline">My Bookmarks</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Main Content */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search resources..."
                className="pl-8"
              />
            </div>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="ebooks">E-Books</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="webinars">Webinars</TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="all" className="space-y-4 mt-4">
              {allResources.map((resource) => (
                <ResourceCard key={resource.id} {...resource} />
              ))}
            </TabsContent>
            <TabsContent value="ebooks" className="space-y-4 mt-4">
              {ebooks.map((ebook) => (
                <ResourceCard key={ebook.id} {...ebook} />
              ))}
            </TabsContent>
            <TabsContent value="courses" className="space-y-4 mt-4">
              {courses.map((course) => (
                <ResourceCard key={course.id} {...course} />
              ))}
            </TabsContent>
            <TabsContent value="webinars" className="space-y-4 mt-4">
              {webinars.map((webinar) => (
                <ResourceCard key={webinar.id} {...webinar} />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Resource Categories</CardTitle>
              <CardDescription>Browse by topic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Badge className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                  24
                </Badge>
                Business Strategy
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-100">
                  18
                </Badge>
                Marketing
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Badge className="mr-2 bg-purple-100 text-purple-800 hover:bg-purple-100">
                  15
                </Badge>
                Finance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Badge className="mr-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                  12
                </Badge>
                Leadership
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Badge className="mr-2 bg-red-100 text-red-800 hover:bg-red-100">
                  9
                </Badge>
                Technology
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Badge className="mr-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
                  7
                </Badge>
                Branding
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Learning</CardTitle>
              <CardDescription>Track your progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningProgress.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{item.title}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Learning Dashboard
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recommended For You</CardTitle>
              <CardDescription>Based on your interests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedResources.map((resource) => (
                <div key={resource.id} className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{resource.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {resource.type} • {resource.duration}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
