import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import Badge from "../../components/badge";
import Button from "../../components/button";
import Progress from "../../components/progress";
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
  getMenteeDashboardMetrics,
  getTodaysSessions,
  getRecentMessages,
  getMenteeProgress,
  getSharedResources,
  getUpcomingReports,
  getNewConnections,
} from "../../services/menteeService";
import MenteeProgress from "../../components/MenteeProgress";

export default function Dashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    activeMentors: 0,
    upcomingSessions: 0,
    hoursMentored: 0,
    averageMentorRating: 0,
    reviewCount: 0,
    newConnections: 0,
  });
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [menteeProgress, setMenteeProgress] = useState([]);
  const [resources, setResources] = useState([]);
  const [reports, setReports] = useState([]);
  const [connections, setConnections] = useState([]);
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
          connectionsData,
        ] = await Promise.all([
          getMenteeDashboardMetrics(user.id),
          getTodaysSessions(user.id),
          getRecentMessages(user.id),
          getMenteeProgress(user.id),
          getSharedResources(user.id),
          getUpcomingReports(user.id),
          getNewConnections(user.id),
        ]);

        setMetrics(metricsData);
        setSessions(sessionsData);
        setMessages(messagesData);
        setMenteeProgress(progressData);
        setResources(resourcesData);
        setReports(reportsData);
        setConnections(connectionsData);
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
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mentee Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {user.firstName}. Here's your mentorship overview.
          </p>
        </div>
        <Button className="p-2 border rounded-lg">
          <Bell className="h-5 w-5" />
        </Button>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Mentors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeMentors}</div>
            <p className="text-xs text-muted-foreground">Current mentors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.upcomingSessions}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Hours Mentored
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.hoursMentored.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Mentor Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.averageMentorRating.toFixed(1)}
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(metrics.averageMentorRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                ({metrics.reviewCount} reviews)
              </span>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Sessions, Messages, and Connections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {/* Today's Sessions */}
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
                  name={`${session.mentor.firstName} ${session.mentor.lastName}`}
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
                    session.mentor.profileImage ||
                    "/placeholder.svg?height=40&width=40"
                  }
                />
              ))
            ) : (
              <p className="text-muted-foreground">
                No sessions scheduled for today.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard/sessions">View All Sessions</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>
              Latest communications from your mentors
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
                    "http://localhost:5000" + message.sender.profileImage ||
                    "/placeholder.svg?height=40&width=40"
                  }
                  unread={!message.isRead}
                />
              ))
            ) : (
              <p className="text-muted-foreground">No recent messages.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard/messages">View All Messages</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Progress and Resources */}
      {/* <div className="grid gap-6 md:grid-cols-2"> */}
        {/* Mentee Progress */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your development and goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {menteeProgress.length > 0 ? (
                menteeProgress.map((progress) => (
                  <MenteeProgress
                    key={progress.id}
                    name={`${user.firstName} ${user.lastName}`}
                    avatar={
                      user.profileImage || "/placeholder.svg?height=40&width=40"
                    }
                    progress={progress.progress}
                    goals={progress.goals}
                  />
                ))
              ) : (
                <p className="text-muted-foreground">
                  No progress data available.
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/mentee/progress">View Detailed Progress</Link>
            </Button>
          </CardFooter>
        </Card> */}

        {/* Recommended Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Resources</CardTitle>
            <CardDescription>
              Personalized resources based on your interests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resources.length > 0 ? (
              resources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  title={resource.title}
                  type={resource.type}
                  category={resource.category}
                />
              ))
            ) : (
              <p className="text-muted-foreground">No resources available.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard/resources">View All Resources</Link>
            </Button>
          </CardFooter>
        </Card>
      {/* </div> */}

      {/* Upcoming Reports */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Upcoming Reports</CardTitle>
          <CardDescription>Reports or assignments due soon</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reports.length > 0 ? (
            reports.map((report) => (
              <ReportItem
                key={report.id}
                mentor={
                  report.mentor
                    ? `${report.mentor.firstName} ${report.mentor.lastName}`
                    : "Unknown Mentor"
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
            <p className="text-muted-foreground">No upcoming reports.</p>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/mentee/reports">View All Reports</Link>
          </Button>
        </CardFooter>
      </Card> */}
    </div>
  );
}

// Reusable Components

function SessionCard({ name, time, topic, status, avatar }) {
  return (
    <div className="flex items-center space-x-4 p-4 rounded-lg border">
      <Avatar>
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{time}</p>
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
    <div className="flex items-start space-x-4 p-4 rounded-lg border">
      <Avatar>
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className={`font-medium ${unread ? "text-blue-600" : ""}`}>
            {name}
          </p>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p
          className={`text-sm truncate ${
            unread ? "font-medium" : "text-muted-foreground"
          }`}
        >
          {message}
        </p>
      </div>
      {unread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
    </div>
  );
}

function ResourceCard({ title, type, category }) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg border">
      <div
        className={`p-2 rounded-md ${
          type === "E-Book"
            ? "bg-blue-100"
            : type === "Course"
            ? "bg-green-100"
            : type === "Webinar Recording"
            ? "bg-red-100"
            : "bg-gray-100"
        }`}
      >
        <BookOpen
          className={`h-5 w-5 ${
            type === "E-Book"
              ? "text-blue-600"
              : type === "Course"
              ? "text-green-600"
              : type === "Webinar Recording"
              ? "text-red-600"
              : "text-gray-600"
          }`}
        />
      </div>
      <div className="space-y-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">Type: {type}</p>
        <p className="text-sm text-muted-foreground">Category: {category}</p>
      </div>
    </div>
  );
}

function ReportItem({ mentor, dueDate, type, status }) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg border">
      <div className="p-2 rounded-md bg-blue-100">
        <FileText className="h-5 w-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{mentor}</p>
        <p className="text-sm text-muted-foreground">
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

function ConnectionCard({ name, role, image, mutualConnections }) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-lg border">
      <Avatar className="h-20 w-20 mb-4">
        <AvatarImage
          src={
            "http://localhost:5000" + image ||
            "/placeholder.svg?height=96&width=96"
          }
          alt={name}
        />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <h4 className="font-medium">{name}</h4>
      <p className="text-sm text-muted-foreground mb-2">{role}</p>
      <p className="text-xs text-muted-foreground mb-4">
        {mutualConnections} mutual connections
      </p>
      <Button variant="outline" className="w-full">
        Connect
      </Button>
    </div>
  );
}
