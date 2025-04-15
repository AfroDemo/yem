import { Check, ChevronDown, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function MenteeCard({
  id,
  name,
  status,
  role,
  industry,
  interest,
  requestDate,
  package: mentorshipPackage,
  goals,
  background,
  expectations,
  availability,
  nextSession,
  menteeData,
  onComplete, // New prop for completion handler
}) {
  const industryColors = {
    Technology: "blue",
    Education: "amber",
    Healthcare: "purple",
    Retail: "green",
    "Food & Beverage": "red",
    "Renewable Energy": "indigo",
    Logistics: "cyan",
    Marketing: "pink",
    SaaS: "blue",
  };
  const [isCompleting, setIsCompleting] = useState(false);

  // Get first industry if multiple exist
  const primaryIndustry = industry?.split(",")[0]?.trim() || "Not specified";
  const color = industryColors[primaryIndustry] || "gray";

  // Format goals if they exist
  const formattedGoals =
    goals?.map((goal) => ({
      title: goal,
      status: "in-progress", // Default status
    })) || [];

  // Get location from menteeData if available
  const location = menteeData?.location || "Not specified";

  const handleComplete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to mark this mentorship as completed?"
      )
    ) {
      return;
    }
    if (onComplete) {
      setIsCompleting(true);
      try {
        await onComplete(id);
      } finally {
        setIsCompleting(false);
      }
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column with avatar and basic info */}
        <div className="flex flex-col items-center text-center md:text-left md:items-start">
          <div className="relative h-20 w-20 rounded-full overflow-hidden mb-2">
            {menteeData?.profileImage ? (
              <img
                src={menteeData.profileImage}
                alt={name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-xl font-semibold">
                {name?.charAt(0) || "M"}
              </div>
            )}
          </div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-gray-500">{role || "Mentee"}</p>
          <div className="flex items-center mt-2">
            <span
              className={`px-2 py-1 text-xs rounded-full bg-${color}-100 text-${color}-800`}
            >
              {primaryIndustry}
            </span>
          </div>
        </div>

        {/* Right column with details */}
        <div className="flex-1 space-y-4">
          {/* Header with actions */}
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <p className="text-sm text-gray-500">Location: {location}</p>
              <p className="text-sm text-gray-500">Started: {requestDate}</p>
              {status === "completed" && (
                <p className="text-sm text-gray-500">
                  Completed:{" "}
                  {menteeData?.updatedAt
                    ? new Date(menteeData.updatedAt).toLocaleDateString()
                    : requestDate}
                </p>
              )}
              {nextSession && nextSession !== "No session scheduled" && (
                <p className="text-sm text-gray-500">
                  Next Session: {nextSession}
                </p>
              )}
              <p className="text-sm text-gray-500">
                Package: {mentorshipPackage}
              </p>
              <p className="text-sm text-gray-500">
                Availability: {availability}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
              <Link
                to={`/mentor/mentees/${id}`}
                className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                View Profile
              </Link>
              {status !== "completed" && (
                <button
                  onClick={handleComplete}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md border border-green-600 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50"
                  disabled={isCompleting}
                >
                  <Check className="h-4 w-4 mr-1" />
                  {isCompleting ? "Completing..." : "Complete"}
                </button>
              )}
            </div>
          </div>

          {/* Progress bar - using a default if not provided */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Progress</p>
              <span className="text-sm">0%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `0%` }}
              ></div>
            </div>
          </div>

          {/* Goals list */}
          <div className="space-y-1">
            <p className="text-sm font-medium">Goals</p>
            <div className="grid grid-cols-1 gap-1">
              {formattedGoals.length > 0 ? (
                formattedGoals.map((goal, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div
                      className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center bg-amber-100`}
                    >
                      <Check className={`h-3 w-3 text-amber-600`} />
                    </div>
                    <span>{goal.title}</span>
                    <span
                      className={`ml-2 px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800`}
                    >
                      In Progress
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No goals specified</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
