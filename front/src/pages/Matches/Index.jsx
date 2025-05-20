import { UserPlus } from "lucide-react";
import Button from "../../components/button";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/card/card";
import CardHeader from "../../components/card/cardHeader";
import CardTitle from "../../components/card/cardTitle";
import CardDescription from "../../components/card/cardDescription";
import CardContent from "../../components/card/cardContent";
import Progress from "../../components/progress";
import Badge from "../../components/badge";
import api from "../../utils/api";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
import { getArrayFromJsonString } from "../../utils/csvHelpers";
import { MentorCard, MentorCardAll } from "../../components/card/MentorCard";

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
  const navigate = useNavigate();

  const getProfileCompletionPercentage = () => {
    const fields = [
      user.firstName,
      user.lastName,
      user.email,
      user.bio,
      user.industries,
      user.skills,
    ];

    const completedFields = fields.filter((field) => field && field !== "");
    return Math.round((completedFields.length / fields.length) * 100);
  };

  const getCurrentMentors = () => {
    switch (activeTab) {
      case "recommended":
        return recommendedMentors;
      case "industry":
        return industryMentors;
      case "all":
        return allMentors;
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

  const getSameIndustryMentors = (user, mentors) => {
    const userIndustries = getArrayFromJsonString(user.industries);

    const sameIndustryMentors = mentors
      .map((mentor) => {
        const mentorIndustries = getArrayFromJsonString(mentor.industry);
        const shared = mentorIndustries.filter((industry) =>
          userIndustries.includes(industry)
        );

        if (shared.length > 0) {
          return {
            ...mentor,
            sharedIndustries: shared,
          };
        }

        return null;
      })
      .filter(Boolean); // remove nulls

    setIndustryMentors(sameIndustryMentors);
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

  useEffect(() => {
    getSameIndustryMentors(user, recommendedMentors);
  }, [user, recommendedMentors]);


  console.log(allMentors)

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
            {activeTab === "all" ? (
              // For all mentors tab, use getCurrentMentors()
              Array.isArray(getCurrentMentors()?.mentors) &&
              getCurrentMentors().mentors.length > 0 ? (
                getCurrentMentors().mentors.map((mentor) => (
                  <MentorCardAll key={mentor.id} mentor={mentor} />
                ))
              ) : (
                <p>No mentors available</p>
              )
            ) : // For recommended mentors tab, use getRecommendedMentors()
            Array.isArray(getCurrentMentors()) &&
              getCurrentMentors().length > 0 ? (
              getCurrentMentors().map((mentor) => (
                <MentorCard key={mentor.id} {...mentor} />
              ))
            ) : (
              <p>No recommended mentors available</p>
            )}
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
              {/* Profile Completion */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">Profile Completion</p>
                  <span className="text-sm">
                    {getProfileCompletionPercentage()}%
                  </span>
                </div>
                <Progress
                  value={getProfileCompletionPercentage()}
                  className="h-2"
                />
                <p className="text-xs text-gray-500">
                  Complete your profile to improve mentor matching
                </p>
              </div>

              {/* Preferences Section */}
              <div className="rounded-md border p-3">
                <h4 className="font-medium text-sm mb-2">Your Preferences</h4>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Industry:</span>
                    <span>{getArrayFromJsonString(user.industries) || "Not specified"}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Business Stage:</span>
                    <span>{user.businessStage || "Not specified"}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Goals:</span>
                    <span>{getArrayFromJsonString(user.interests) || "Not specified"}</span>
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/dashboard/settings")}
                  variant="link"
                  size="sm"
                  className="px-0 mt-1"
                >
                  Update Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="mt-6">
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
          </Card> */}

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
