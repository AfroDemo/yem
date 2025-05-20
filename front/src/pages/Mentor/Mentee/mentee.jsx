import Button from "../../../components/button";
import Card from "../../../components/card/card";
import CardHeader from "../../../components/card/cardHeader";
import CardTitle from "../../../components/card/cardTitle";
import CardDescription from "../../../components/card/cardDescription";
import CardContent from "../../../components/card/cardContent";
import Badge from "../../../components/badge";
import { MenteeCard } from "../../../components/card/MenteeCard";
import Avatar from "../../../components/avatar/Avatar";
import AvatarImage from "../../../components/avatar/AvatarImage";
import AvatarFallback from "../../../components/avatar/AvatarFallback";
import CardFooter from "../../../components/card/cardFooter";
import { Bell, CheckCircle, Clock, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getMentorDashboardMetrics,
  getIndustries,
  getRecentAchievements,
} from "../../../services/mentorService";
import { toast } from "react-toastify";
import api from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";

export default function MenteesPage() {
  const [activeTab, setActiveTab] = useState("accepted");
  const [mentees, setMentees] = useState({
    accepted: [],
    completed: [],
  });
  const [statsData, setStatsData] = useState([]);
  const [industriesData, setIndustriesData] = useState([]);
  const [achievementsData, setAchievementsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();

  // Fetch mentee data (mentorship requests)
  const getRequestData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/mentorships/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const transformedData = {
        accepted: [],
        completed: [],
      };

      response.data.forEach((request) => {
        const mentee = request.mentee;
        
        // Parse JSON strings safely
        const industries = safeJSONParse(mentee.industries, []).join(", ");
        const interests = safeJSONParse(mentee.interests, []).join(", ");
        const businessStage = safeJSONParse(mentee.businessStage, []).join(", ");
        
        // Parse goals safely
        const goals = safeJSONParse(request.goals, []);

        const baseData = {
          id: request.id,
          name: `${mentee.firstName} ${mentee.lastName}`,
          status: request.status,
          role: businessStage || "Not specified",
          industry: industries || "Not specified",
          interest: interests || "Not specified",
          badgeColor: "blue",
          requestDate: new Date(request.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          package: request.packageType
            ? request.packageType.charAt(0).toUpperCase() +
              request.packageType.slice(1) +
              " Package"
            : "Custom Package",
          // Enhanced goals rendering
          goals: goals.length > 0 
            ? goals.map(goal => {
                // Combine title and status for more informative display
                return `${goal.title} (${goal.status})`;
              })
            : ["No specific goals provided"],
          background: request.background || "No background provided",
          expectations: request.expectations || "No expectations provided",
          availability: request.availability
            ? `${request.availability} • Timezone: ${
                request.timezone || "Not specified"
              }`
            : "Not specified",
          menteeData: mentee,
        };

        if (request.status === "accepted") {
          transformedData.accepted.push({
            ...baseData,
            nextSession: request.nextMeetingDate
              ? new Date(request.nextMeetingDate).toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "No session scheduled",
          });
        } else if (request.status === "completed") {
          transformedData.completed.push({
            ...baseData,
            completedAt: request.completedAt || request.updatedAt,
          });
        }
      });

      setMentees(transformedData);
    } catch (error) {
      console.error("Error fetching mentees:", error);
      toast.error("Failed to load mentee data");
    } finally {
      setIsLoading(false);
    }
  };

// Utility function for safe JSON parsing
function safeJSONParse(jsonString, defaultValue = []) {
  if (!jsonString || jsonString.trim() === '') return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON:', jsonString, error);
    return defaultValue;
  }
}


  // Fetch dashboard metrics
  const fetchDashboardMetrics = async () => {
    try {
      const response = await getMentorDashboardMetrics(user.id);
      setStatsData([
        {
          icon: <Users className="h-5 w-5 text-primary" />,
          title: "Total Mentees",
          description: "Current and past",
          value: response.activeMentees + (response.completedMentees || 0), // Adjust based on backend response
        },
        {
          icon: <Clock className="h-5 w-5 text-primary" />,
          title: "Hours Mentored",
          description: "This month",
          value: response.hoursMentored.toFixed(1),
        },
        {
          icon: <Star className="h-5 w-5 text-primary" />,
          title: "Average Rating",
          description: "Based on reviews",
          value: response.averageRating.toFixed(1),
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      toast.error("Failed to load dashboard metrics");
    }
  };

  // Fetch industries
  const fetchIndustries = async () => {
    try {
      const response = await getIndustries(user.id);
      setIndustriesData(response); // Backend already returns in correct format
    } catch (error) {
      console.error("Error fetching industries:", error);
      toast.error("Failed to load industry data");
    }
  };

  // Fetch recent achievements
  const fetchAchievements = async () => {
    try {
      const response = await getRecentAchievements(user.id);
      setAchievementsData(response);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast.error("Failed to load achievements");
    }
  };

  useEffect(() => {
    if (user?.id) {
      Promise.all([
        getRequestData(),
        fetchDashboardMetrics(),
        fetchIndustries(),
        fetchAchievements(),
      ]).finally(() => setIsLoading(false));
    }
  }, [user]);

  const handleCompleteMentorship = async (mentorshipId) => {
    try {
      setIsUpdating(true);
      const response = await api.put(
        `/mentorships/${mentorshipId}/status`,
        {
          status: "completed",
          endDate: new Date().toISOString(), // Use endDate as per backend
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success(
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          Mentorship completed successfully!
        </div>
      );

      await getRequestData();

      if (mentees.accepted.length <= 1) {
        setActiveTab("completed");
      }
    } catch (error) {
      console.error("Error completing mentorship:", error);
      let errorMessage = "Failed to complete mentorship";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Mentees</h1>
          <p className="text-muted-foreground">
            Manage and track your mentee relationships
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              window.location.href = "/mentor/mentees/requests";
            }}
            variant="outline"
          >
            <Bell className="mr-2 h-4 w-4" />
            View Mentee Requests
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3 space-y-6">
          <div className="tabs-container">
            <div className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-md">
              {[
                { id: "accepted", label: "Active" },
                { id: "completed", label: "Completed" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`py-1.5 px-3 text-sm font-medium rounded-sm transition-all ${
                    activeTab === tab.id
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label} ({mentees[tab.id].length})
                </button>
              ))}
            </div>

            <div className="tab-content mt-4 space-y-4">
              {activeTab === "accepted" &&
                mentees.accepted.map((mentee) => (
                  <MenteeCard
                    key={mentee.id}
                    {...mentee}
                    onComplete={handleCompleteMentorship}
                    isUpdating={isUpdating}
                  />
                ))}

              {activeTab === "completed" &&
                mentees.completed.map((mentee) => (
                  <MenteeCard key={mentee.id} {...mentee} />
                ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Mentee Statistics</CardTitle>
              <CardDescription>
                Overview of your mentoring impact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="font-medium">{stat.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Industry Breakdown</CardTitle>
              <CardDescription>Mentees by industry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {industriesData.map((industry, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Badge
                    className={`mr-2 bg-${industry.color}-100 text-${industry.color}-800 hover:bg-${industry.color}-100`}
                  >
                    {industry.count}
                  </Badge>
                  {industry.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Mentee milestones reached</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievementsData.map((achievement, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={achievement.avatar}
                        alt={achievement.name}
                      />
                      <AvatarFallback>
                        {achievement.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">
                      {achievement.name}
                    </span>
                  </div>
                  <p className="text-sm mb-1">{achievement.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {achievement.date}
                  </p>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Achievements
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
