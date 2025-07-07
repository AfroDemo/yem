import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  FileText,
  Star,
  Users,
} from "lucide-react";
import Badge from "../../components/badge";
import Button from "../../components/button";
import { Link } from "react-router-dom";
import Avatar from "../../components/avatar/Avatar";
import AvatarImage from "../../components/avatar/AvatarImage";
import AvatarFallback from "../../components/avatar/AvatarFallback";
import Card from "../../components/card/card";
import CardHeader from "../../components/card/cardHeader";
import CardTitle from "../../components/card/cardTitle";
import CardDescription from "../../components/card/cardDescription";
import CardContent from "../../components/card/cardContent";
import CardFooter from "../../components/card/cardFooter";
import { useAuth } from "../../context/AuthContext";
import {
  getMentorDashboardMetrics,
  getTodaysSessions,
  getRecentMessages,
  getMenteeProgress,
  getSharedResources,
  getUpcomingReports,
} from "../../services/mentorService";
import MenteeProgress from "../../components/MenteeProgress";

export default function MentorDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    activeMentees: 0,
    upcomingSessions: 0,
    hoursMentored: 0,
    averageRating: 0,
    reviewCount: 0,
  });
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [menteeProgress, setMenteeProgress] = useState([]);
  const [resources, setResources] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          metricsData,
          sessionsData,
          messagesData,
          progressData,
          resourcesData,
          reportsData,
        ] = await Promise.all([
          getMentorDashboardMetrics(user.id),
          getTodaysSessions(user.id),
          getRecentMessages(user.id),
          getMenteeProgress(user.id),
          getSharedResources(user.id),
          getUpcomingReports(user.id),
        ]);

        setMetrics(metricsData);
        setSessions(sessionsData);
        setMessages(messagesData);
        setMenteeProgress(progressData);
        setResources(resourcesData);
        setReports(reportsData);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {user.firstName}. Here's what's happening with your
            mentees.
          </p>
        </div>
        <Button asChild>
          <Link to="/mentor/sessions/new">Schedule New Session</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Mentees
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeMentees}</div>
            <p className="text-xs text-gray-500">Current mentees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.upcomingSessions}</div>
            <p className="text-xs text-gray-500">Next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Hours Mentored
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.hoursMentored.toFixed(1)}
            </div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.averageRating.toFixed(1)}
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(metrics.averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">
                ({metrics.reviewCount} reviews)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Sessions</CardTitle>
            <CardDescription>
              Your scheduled mentoring sessions for today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  name={`${session.mentee.firstName} ${session.mentee.lastName}`}
                  time={`${new Date(session.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} - ${new Date(session.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
                  topic={session.topic}
                  status={session.status}
                  avatar={
                    session.mentee.profileImage ||
                    "/placeholder.svg?height=40&width=40"
                  }
                />
              ))
            ) : (
              <p className="text-gray-500">No sessions scheduled for today.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/mentor/sessions">View All Sessions</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>
              Latest communications from your mentees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {messages.length > 0 ? (
              messages.map((message) => (
                <MessagePreview
                  key={message.id}
                  name={`${message.sender.firstName} ${message.sender.lastName}`}
                  time={new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  message={message.content}
                  avatar={
                    message.sender.profileImage ||
                    "/placeholder.svg?height=40&width=40"
                  }
                  unread={!message.isRead}
                />
              ))
            ) : (
              <p className="text-gray-500">No recent messages.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/mentor/messages">View All Messages</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mentee Progress</CardTitle>
          <CardDescription>
            Track the development of your mentees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {menteeProgress.length > 0 ? (
              menteeProgress.map((mentee) => (
                <MenteeProgress
                  key={mentee.id}
                  name={`${mentee.firstName} ${mentee.lastName}`}
                  avatar={
                    mentee.profileImage || "/placeholder.svg?height=40&width=40"
                  }
                  progress={mentee.progress}
                  goals={mentee.goals}
                />
              ))
            ) : (
              <p className="text-gray-500">
                No mentee progress data available.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/mentor/mentees">View All Mentees</Link>
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resources Shared</CardTitle>
            <CardDescription>
              Recently shared materials with mentees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resources.length > 0 ? (
              resources.map((resource) => (
                <ResourceItem
                  key={resource.id}
                  title={resource.title}
                  type={resource.type}
                  sharedWith={resource.sharedWith
                    .map((user) => `${user.firstName} ${user.lastName}`)
                    .join(", ")}
                  date={new Date(resource.sharedAt).toLocaleDateString()}
                />
              ))
            ) : (
              <p className="text-gray-500">No resources shared recently.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/mentor/resources">Manage Resources</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reports</CardTitle>
            <CardDescription>Mentee progress reports due soon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.length > 0 ? (
              reports.map((report) => (
                <ReportItem
                  key={report.id}
                  mentee={
                    report.mentee
                      ? `${report.mentee.firstName} ${report.mentee.lastName}`
                      : "Unknown Mentee"
                  }
                  dueDate={
                    report.dueDate
                      ? new Date(report.dueDate).toLocaleDateString()
                      : "N/A"
                  }
                  type={report.type || "Unknown"}
                  status={report.status || "pending"}
                />
              ))
            ) : (
              <p className="text-gray-500">No upcoming reports.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/mentor/reports">View All Reports</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function SessionCard({ name, time, topic, status, avatar }) {
  return (
    <div className="flex items-center space-x-4 p-3 rounded-lg border">
      <Avatar>
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">{time}</p>
        <p className="text-sm">{topic}</p>
      </div>
      <Badge
        className={
          status === "completed"
            ? "bg-green-100 text-green-800 hover:bg-green-100"
            : status === "upcoming"
            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
            : "bg-amber-100 text-amber-800 hover:bg-amber-100"
        }
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    </div>
  );
}

function MessagePreview({ name, time, message, avatar, unread }) {
  return (
    <div className="flex items-start space-x-4 p-3 rounded-lg border">
      <Avatar>
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className={`font-medium ${unread ? "text-blue-600" : ""}`}>
            {name}
          </p>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p
          className={`text-sm truncate ${
            unread ? "font-medium" : "text-gray-500"
          }`}
        >
          {message}
        </p>
      </div>
      {unread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
    </div>
  );
}

function ResourceItem({ title, type, sharedWith, date }) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg border">
      <div
        className={`p-2 rounded-md ${
          type === "PDF"
            ? "bg-red-100"
            : type === "Spreadsheet"
            ? "bg-green-100"
            : type === "Article"
            ? "bg-blue-100"
            : "bg-gray-100"
        }`}
      >
        <FileText
          className={`h-4 w-4 ${
            type === "PDF"
              ? "text-red-600"
              : type === "Spreadsheet"
              ? "text-green-600"
              : type === "Article"
              ? "text-blue-600"
              : "text-gray-600"
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        <p className="text-xs text-gray-500">
          {type} • Shared with {sharedWith}
        </p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
      <Button variant="ghost" size="sm">
        View
      </Button>
    </div>
  );
}

function ReportItem({ mentee, dueDate, type, status }) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg border">
      <div className="p-2 rounded-md bg-blue-100">
        <FileText className="h-4 w-4 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{mentee}</p>
        <p className="text-xs text-gray-500">
          {type} • Due {dueDate}
        </p>
      </div>
      <Badge
        className={
          status === "completed"
            ? "bg-green-100 text-green-800 hover:bg-green-100"
            : status === "pending"
            ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
            : "bg-red-100 text-red-800 hover:bg-red-100"
        }
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    </div>
  );
}
