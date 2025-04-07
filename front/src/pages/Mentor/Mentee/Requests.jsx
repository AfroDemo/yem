import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { MenteeRequestCard } from "../../../components/card/MenteeRequestCard";
import api from "../../../utils/api";
import { useUser } from "../../../context/UserContext";

export default function MenteeRequestsPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [menteeRequests, setMenteeRequests] = useState({
    pending: [],
    accepted: [],
    declined: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const user = useUser();

  const getRequestData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/mentorships/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Transform the API data into our desired format
      const transformedData = {
        pending: [],
        accepted: [],
        declined: [],
      };

      response.data.forEach((request) => {
        const mentee = request.mentee;
        const industries = JSON.parse(mentee.industries || "[]").join(", ");

        const baseData = {
          id: request.id,
          name: `${mentee.firstName} ${mentee.lastName}`,
          role: mentee.bio || "Entrepreneur",
          industry: industries || "Not specified",
          badgeColor: "blue", // Default color
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
          goals: request.goals
            ? [request.goals]
            : ["No specific goals provided"],
          background: request.background || "No background provided",
          expectations: request.expectations || "No expectations provided",
          availability: request.availability
            ? `${request.availability} • Timezone: ${
                request.timezone || "Not specified"
              }`
            : "Not specified",
          menteeData: mentee, // Include full mentee data if needed
        };

        if (request.status === "pending") {
          transformedData.pending.push({
            ...baseData,
            packageDetails: "Details not specified",
            message: request.expectations || "Looking for mentorship",
          });
        } else if (request.status === "accepted") {
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
        } else if (request.status === "declined") {
          transformedData.declined.push({
            ...baseData,
            declineReason: "Not specified",
            recommendations: [],
          });
        }
      });

      setMenteeRequests(transformedData);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRequestData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/mentor"
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">Mentee Requests</h1>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="grid w-full grid-cols-3 max-w-md bg-gray-100 p-1 rounded-md">
          {["pending", "accepted", "declined"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-1.5 px-3 text-sm font-medium rounded-sm transition-all ${
                activeTab === tab
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} (
              {menteeRequests[tab].length})
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4 mt-4">
          {activeTab === "pending" &&
            menteeRequests.pending.map((mentee) => (
              <MenteeRequestCard
                key={mentee.id}
                mentee={mentee}
                status="pending"
                onUpdate={getRequestData} // Pass refresh function
              />
            ))}

          {activeTab === "accepted" &&
            menteeRequests.accepted.map((mentee) => (
              <MenteeRequestCard
                key={mentee.id}
                mentee={mentee}
                status="accepted"
                onUpdate={getRequestData} // Pass refresh function
              />
            ))}

          {activeTab === "declined" &&
            menteeRequests.declined.map((mentee) => (
              <MenteeRequestCard
                key={mentee.id}
                mentee={mentee}
                status="declined"
                onUpdate={getRequestData} // Pass refresh function
              />
            ))}
        </div>
      </div>

      {/* Mentorship Tips Card */}
      <div className="border rounded-lg bg-white shadow-sm">
        <div className="border-b p-6">
          <h3 className="text-lg font-bold">Mentorship Request Management</h3>
          <p className="text-sm text-gray-500">
            Tips for handling mentee requests effectively
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Review Thoroughly</h3>
              <p className="text-sm text-gray-500">
                Take time to understand the mentee's background, goals, and
                challenges to determine if you're the right fit.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Set Clear Expectations</h3>
              <p className="text-sm text-gray-500">
                Clearly communicate what you can and cannot help with to avoid
                misunderstandings.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Be Responsive</h3>
              <p className="text-sm text-gray-500">
                Try to respond to requests within 48 hours, even if it's just to
                acknowledge receipt.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t p-6">
          <Link
            to="/mentor/resources/mentorship-guide"
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 w-full"
          >
            View Mentorship Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
