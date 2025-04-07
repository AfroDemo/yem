import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { MenteeRequestCard } from "../../../components/card/MenteeRequestCard";

const menteeRequests = {
  pending: [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Tech Startup Founder",
      industry: "Technology",
      badgeColor: "blue",
      requestDate: "April 10, 2025",
      package: "Growth Package",
      packageDetails: "4 sessions per month • 60 minutes each",
      message:
        "I'm looking for guidance on scaling my SaaS startup and securing Series A funding...",
      goals: [
        "Refine pitch deck for Series A funding",
        "Develop scalable growth strategy",
        "Improve team structure and hiring plan",
      ],
      availability: "Weekdays after 3pm PT • Timezone: Pacific Time (PT)",
    },
    // Add other pending mentees...
  ],
  accepted: [
    {
      id: 4,
      name: "Emily Rodriguez",
      role: "EdTech Founder",
      industry: "Education",
      badgeColor: "amber",
      requestDate: "April 2, 2025",
      package: "Starter Package",
      packageDetails: "2 sessions per month • 45 minutes each",
      nextSession: "April 16, 2025 • 2:00 PM - 3:00 PM (PT)",
      goals: [
        "Develop content strategy for educational platform",
        "Create partnerships with educational institutions",
        "Develop sustainable business model for EdTech startup",
      ],
      availability: "Weekdays after 4pm ET • Timezone: Eastern Time (ET)",
    },
    // Add other accepted mentees...
  ],
  declined: [
    {
      id: 6,
      name: "Michael Brown",
      role: "Renewable Energy Startup",
      industry: "Energy",
      badgeColor: "indigo",
      requestDate: "March 25, 2025",
      package: "Growth Package",
      packageDetails: "4 sessions per month • 60 minutes each",
      declineReason:
        "I appreciate your interest in mentorship, but I don't have enough expertise in the renewable energy sector...",
      recommendations: [
        "Jennifer Williams (Energy Expert)",
        "Robert Chen (CleanTech Advisor)",
      ],
    },
  ],
};

export default function MenteeRequestsPage() {
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/mentor"
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
              />
            ))}

          {activeTab === "accepted" &&
            menteeRequests.accepted.map((mentee) => (
              <MenteeRequestCard
                key={mentee.id}
                mentee={mentee}
                status="accepted"
              />
            ))}

          {activeTab === "declined" &&
            menteeRequests.declined.map((mentee) => (
              <MenteeRequestCard
                key={mentee.id}
                mentee={mentee}
                status="declined"
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
            {/* Add other tip cards... */}
          </div>
        </div>
        <div className="border-t p-6">
          <Link
            href="/mentor/resources/mentorship-guide"
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 w-full"
          >
            View Mentorship Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
