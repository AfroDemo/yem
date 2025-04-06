import {
  BadgeCheck,
  BookOpen,
  Calendar,
  Filter,
  MessageSquare,
  Search,
  Star,
  UserPlus,
} from "lucide-react";
import Button from "../../components/button";
import { Link } from "react-router-dom";
import Card from "../../components/card/card";
import CardHeader from "../../components/card/cardHeader";
import CardTitle from "../../components/card/cardTitle";
import CardDescription from "../../components/card/cardDescription";
import CardContent from "../../components/card/cardContent";
import Progress from "../../components/progress";
import Badge from "../../components/badge";
import Avatar from "../../components/avatar/Avatar";
import AvatarImage from "../../components/avatar/AvatarImage";
import AvatarFallback from "../../components/avatar/AvatarFallback";
import CardFooter from "../../components/card/cardFooter";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";

// Mentor data object
const mentorData = {
  recommended: [
    {
      id: 1,
      name: "Michael Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Senior Mentor",
      industry: "Technology",
      experience: "15+ years",
      specialties: ["Business Strategy", "Fundraising", "Product Development"],
      rating: 4.9,
      reviews: 28,
      matchPercentage: 95,
      availability: "Available next week",
      verified: true,
    },
    {
      id: 2,
      name: "Jennifer Williams",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Marketing Expert",
      industry: "Technology",
      experience: "12+ years",
      specialties: ["Digital Marketing", "Brand Strategy", "Growth Hacking"],
      rating: 4.8,
      reviews: 34,
      matchPercentage: 92,
      availability: "Available this week",
      verified: true,
    },
    {
      id: 3,
      name: "Robert Chen",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Startup Advisor",
      industry: "Technology",
      experience: "10+ years",
      specialties: [
        "Venture Capital",
        "Pitch Development",
        "Business Planning",
      ],
      rating: 4.7,
      reviews: 19,
      matchPercentage: 88,
      availability: "Limited availability",
      verified: true,
    },
    {
      id: 4,
      name: "Sophia Martinez",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Product Strategist",
      industry: "SaaS",
      experience: "8+ years",
      specialties: ["Product Management", "UX Strategy", "Market Research"],
      rating: 4.6,
      reviews: 15,
      matchPercentage: 85,
      availability: "Available this week",
      verified: false,
    },
  ],
  industry: [
    {
      id: 1,
      name: "Michael Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Senior Mentor",
      industry: "Technology",
      experience: "15+ years",
      specialties: ["Business Strategy", "Fundraising", "Product Development"],
      rating: 4.9,
      reviews: 28,
      matchPercentage: 95,
      availability: "Available next week",
      verified: true,
    },
    {
      id: 2,
      name: "Jennifer Williams",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Marketing Expert",
      industry: "Technology",
      experience: "12+ years",
      specialties: ["Digital Marketing", "Brand Strategy", "Growth Hacking"],
      rating: 4.8,
      reviews: 34,
      matchPercentage: 92,
      availability: "Available this week",
      verified: true,
    },
    {
      id: 5,
      name: "David Thompson",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Tech Entrepreneur",
      industry: "Technology",
      experience: "9+ years",
      specialties: ["Software Development", "Tech Stack", "Scaling"],
      rating: 4.5,
      reviews: 12,
      matchPercentage: 82,
      availability: "Available next week",
      verified: false,
    },
  ],
  all: [
    {
      id: 1,
      name: "Michael Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Senior Mentor",
      industry: "Technology",
      experience: "15+ years",
      specialties: ["Business Strategy", "Fundraising", "Product Development"],
      rating: 4.9,
      reviews: 28,
      matchPercentage: 95,
      availability: "Available next week",
      verified: true,
    },
    {
      id: 2,
      name: "Jennifer Williams",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Marketing Expert",
      industry: "Technology",
      experience: "12+ years",
      specialties: ["Digital Marketing", "Brand Strategy", "Growth Hacking"],
      rating: 4.8,
      reviews: 34,
      matchPercentage: 92,
      availability: "Available this week",
      verified: true,
    },
    {
      id: 3,
      name: "Robert Chen",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Startup Advisor",
      industry: "Technology",
      experience: "10+ years",
      specialties: [
        "Venture Capital",
        "Pitch Development",
        "Business Planning",
      ],
      rating: 4.7,
      reviews: 19,
      matchPercentage: 88,
      availability: "Limited availability",
      verified: true,
    },
    {
      id: 4,
      name: "Sophia Martinez",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Product Strategist",
      industry: "SaaS",
      experience: "8+ years",
      specialties: ["Product Management", "UX Strategy", "Market Research"],
      rating: 4.6,
      reviews: 15,
      matchPercentage: 85,
      availability: "Available this week",
      verified: false,
    },
    {
      id: 6,
      name: "James Wilson",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Financial Advisor",
      industry: "Finance",
      experience: "20+ years",
      specialties: ["Financial Planning", "Investment Strategy", "Fundraising"],
      rating: 4.9,
      reviews: 42,
      matchPercentage: 78,
      availability: "Limited availability",
      verified: true,
    },
    {
      id: 7,
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Marketing Director",
      industry: "E-commerce",
      experience: "12+ years",
      specialties: ["E-commerce Strategy", "Customer Acquisition", "Retention"],
      rating: 4.7,
      reviews: 23,
      matchPercentage: 75,
      availability: "Available next week",
      verified: true,
    },
  ],
};

// Expertise data
const expertiseData = [
  { name: "Business Strategy", count: 15, color: "blue" },
  { name: "Marketing", count: 12, color: "green" },
  { name: "Fundraising", count: 10, color: "purple" },
  { name: "Product Development", count: 8, color: "amber" },
  { name: "Financial Planning", count: 6, color: "red" },
];

// How it works steps
const howItWorksSteps = [
  {
    step: 1,
    title: "Browse Mentors",
    description: "Explore profiles of experienced mentors in your industry",
  },
  {
    step: 2,
    title: "Send a Request",
    description:
      "Request mentorship with a brief introduction about your goals",
  },
  {
    step: 3,
    title: "Schedule Sessions",
    description: "Once accepted, schedule regular mentoring sessions",
  },
  {
    step: 4,
    title: "Grow Together",
    description: "Work with your mentor to achieve your business goals",
  },
];

export default function MatchPage() {
  const [activeTab, setActiveTab] = useState("recommended");
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [industryMentors, setIndustryMentors] = useState([]);
  const [allMentors, setAllMentors] = useState([]);
  const user = useUser();

  // Get the current mentor list based on active tab
  const getCurrentMentors = () => {
    switch (activeTab) {
      case "recommended":
        return recommendedMentors;
      case "industry":
        return mentorData.industry;
      case "all":
        return mentorData.all;
      default:
        return allMentors;
    }
  };

  const getMatchedMentors = async () => {
    try {
      const response = await api.get(`/users/matches/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const shapedMentors = response.data.map((item) => {
        const mentor = item.user;
        return {
          id: mentor.id,
          name: `${mentor.firstName} ${mentor.lastName}`,
          avatar: mentor.profileImage,
          role: mentor.role,
          industry: mentor.industries
            ? mentor.industries.replace(/["\\]/g, "")
            : "",
          experience: mentor.experienceYears || "N/A",
          specialties: mentor.skills
            ? mentor.skills
                .replace(/["\\]/g, "")
                .split(",")
                .map((skill) => ({ name: skill.trim() }))
            : [],
          rating: 4.5, // Replace with actual rating if available
          reviews: 12, // Replace with actual reviews count if available
          matchPercentage: item.matchScore,
          availability: mentor.availability || "N/A",
          verified: mentor.isVerified,
        };
      });

      setRecommendedMentors(shapedMentors);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const getAllMentors = async () => {
    try {
      const responseMentors = await api
        .get("/mentors", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((responseMentors) => {
          setAllMentors(responseMentors.data);
        });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getMatchedMentors();
    getAllMentors();
  }, [user]);

  console.log(recommendedMentors, allMentors);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Find a Mentor</h1>
          <p className="text-gray-500">
            Connect with experienced mentors who can help you grow your business
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/mentors/requests">
            <UserPlus className="mr-2 h-4 w-4" />
            My Mentor Requests
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3 space-y-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("recommended")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "recommended"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Recommended
              </button>
              <button
                onClick={() => setActiveTab("industry")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "industry"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Same Industry
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "all"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Mentors
              </button>
            </nav>
          </div>

          <div className="space-y-4">
            {getCurrentMentors().map((mentor) => (
              <MentorCard key={mentor.id} {...mentor} />
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Your Mentor Match</CardTitle>
              <CardDescription>
                How we find the right mentors for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">Profile Completion</p>
                  <span className="text-sm">75%</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-gray-500">
                  Complete your profile to improve mentor matching
                </p>
              </div>

              <div className="rounded-md border p-3">
                <h4 className="font-medium text-sm mb-2">Your Preferences</h4>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Industry:</span>
                    <span>Technology</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Business Stage:</span>
                    <span>Early Startup</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Goals:</span>
                    <span>Fundraising, Growth</span>
                  </p>
                </div>
                <Button variant="link" size="sm" className="px-0 mt-1">
                  Update Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Mentor Expertise</CardTitle>
              <CardDescription>Browse by specialty</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {expertiseData.map((expertise, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Badge
                    className={`mr-2 bg-${expertise.color}-100 text-${expertise.color}-800 hover:bg-${expertise.color}-100`}
                  >
                    {expertise.count}
                  </Badge>
                  {expertise.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How Mentorship Works</CardTitle>
              <CardDescription>Getting started with a mentor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {howItWorksSteps.map((step) => (
                <div key={step.step} className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-gray-500">{step.description}</p>
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

function MentorCard({
  id,
  name,
  avatar,
  role,
  industry,
  experience,
  specialties,
  rating,
  reviews,
  matchPercentage,
  availability,
  verified,
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center text-center md:text-left md:items-start">
            <div className="relative">
              <Avatar className="h-20 w-20 mb-2">
                <AvatarImage src={
                  avatar
                    ? `http://localhost:5000${avatar}`
                    : "/placeholder.svg?height=96&width=96"
                }
                alt={name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              {verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5">
                  <BadgeCheck className="h-4 w-4" />
                </div>
              )}
            </div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-gray-500">{role}</p>
            <div className="flex items-center mt-2">
              <Badge
                className={`${
                  industry === "Technology"
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    : industry === "Finance"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : industry === "E-commerce"
                    ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                    : industry === "SaaS"
                    ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                }`}
              >
                {industry}
              </Badge>
            </div>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-xs font-medium">{rating}</span>
              <span className="mx-1 text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{reviews} reviews</span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Experience: {experience}
                </p>
                <p className="text-sm text-gray-500">
                  Availability: {availability}
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Match Score</p>
                  <div className="flex items-center gap-2">
                    <Progress value={matchPercentage} className="h-2 w-24" />
                    <span className="text-sm font-medium">
                      {matchPercentage}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex mt-4 md:mt-0 md:flex-col gap-2 md:items-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 md:w-auto"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
                <Button size="sm" className="flex-1 md:w-auto" asChild>
                  <Link to={`/dashboard/mentors/${id}`}>View Profile</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">About</p>
              <p className="text-sm">
                Experienced {role.toLowerCase()} with expertise in{" "}
                {industry.toLowerCase()} startups. Passionate about helping
                entrepreneurs navigate challenges and achieve their business
                goals.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Specialties</p>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-xs">1-on-1 Sessions</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span className="text-xs">Chat Support</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-gray-400" />
                <span className="text-xs">Resource Sharing</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-100 px-6 py-3">
        <Button className="w-full" asChild>
          <Link to={`/dashboard/mentors/${id}/request`}>
            <UserPlus className="mr-2 h-4 w-4" />
            Request Mentorship
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
