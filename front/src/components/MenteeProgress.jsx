import { Link } from "react-router-dom";
import Avatar from "./avatar/Avatar";
import AvatarFallback from "./avatar/AvatarFallback";
import AvatarImage from "./avatar/AvatarImage";
import Button from "./button";
import { ArrowUpRight } from "lucide-react";
import Progress from "./progress";

export default function MenteeProgress({ name, avatar, progress, goals }) {
  // Parse the goals string to an array
  const parsedGoals = typeof goals === 'string' ? JSON.parse(goals) : goals;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">Overall Progress</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <Link to="/mentee/profile">
            View Profile
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>
      <Progress value={parseInt(progress)} className="h-2" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
        {parsedGoals && parsedGoals.length > 0 ? (
          parsedGoals.map((goal, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  goal.status === "completed"
                    ? "bg-green-500"
                    : goal.status === "in-progress"
                    ? "bg-amber-500"
                    : "bg-gray-300"
                }`}
              ></div>
              <span className="text-sm truncate">{goal.title}</span>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">No goals set</p>
        )}
      </div>
    </div>
  );
}