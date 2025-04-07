import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export function MenteeCard({
    name,
    avatar,
    business,
    industry,
    location,
    startDate,
    endDate,
    pauseDate,
    progress,
    nextSession,
    status,
    pauseReason,
    goals,
  }) {
    const industryColors = {
      "SaaS": "blue",
      "Retail": "green",
      "Healthcare": "purple",
      "Education": "amber",
      "Food & Beverage": "red",
      "Renewable Energy": "indigo",
      "Logistics": "cyan",
      "Marketing": "pink",
      "Technology": "blue"
    };
  
    const color = industryColors[industry] || "gray";
  
    return (
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column with avatar and basic info */}
          <div className="flex flex-col items-center text-center md:text-left md:items-start">
            <div className="relative h-20 w-20 rounded-full overflow-hidden mb-2">
              <img 
                src={avatar} 
                alt={name}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-xl font-semibold">
                {name.charAt(0)}
              </div>
            </div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-gray-500">{business}</p>
            <div className="flex items-center mt-2">
              <span className={`px-2 py-1 text-xs rounded-full bg-${color}-100 text-${color}-800`}>
                {industry}
              </span>
            </div>
          </div>
  
          {/* Right column with details */}
          <div className="flex-1 space-y-4">
            {/* Header with actions */}
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <p className="text-sm text-gray-500">Location: {location}</p>
                <p className="text-sm text-gray-500">
                  Started: {startDate}
                  {endDate && ` • Completed: ${endDate}`}
                  {pauseDate && ` • Paused: ${pauseDate}`}
                </p>
                {nextSession && <p className="text-sm text-gray-500">Next Session: {nextSession}</p>}
                {pauseReason && <p className="text-sm text-gray-500">Note: {pauseReason}</p>}
              </div>
              <div className="flex mt-2 md:mt-0">
                <Link 
                  to={`/mentor/mentees/${name.toLowerCase().replace(" ", "-")}`}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 mr-2"
                >
                  View Profile
                </Link>
                {/* Dropdown menu implementation would go here */}
              </div>
            </div>
  
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Progress</p>
                <span className="text-sm">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
  
            {/* Goals list */}
            <div className="space-y-1">
              <p className="text-sm font-medium">Goals</p>
              <div className="grid grid-cols-1 gap-1">
                {goals.map((goal, index) => {
                  const statusColors = {
                    "completed": "green",
                    "in-progress": "amber",
                    "not-started": "gray"
                  };
                  const statusText = {
                    "completed": "Completed",
                    "in-progress": "In Progress",
                    "not-started": "Not Started"
                  };
                  const color = statusColors[goal.status];
  
                  return (
                    <div key={index} className="flex items-center text-sm">
                      <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center bg-${color}-100`}>
                        {goal.status === "completed" && <Check className="h-3 w-3 text-${color}-600" />}
                      </div>
                      <span className={goal.status === "completed" ? "line-through text-gray-400" : ""}>
                        {goal.title}
                      </span>
                      <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full bg-${color}-100 text-${color}-800`}>
                        {statusText[goal.status]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }