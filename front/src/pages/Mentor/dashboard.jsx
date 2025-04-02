import {
  ArrowUpRight,
  Calendar,
  Clock,
  FileText,
  Star,
  Users,
} from "lucide-react";
import Badge from "../../components/badge";
import Button from "../../components/button";
import Progress from "../../components/progress";
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

export default function MentorDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {user.firstName}. Here's what's happening with your mentees.
          </p>
        </div>
        <Button asChild>
          <Link href="/mentor/sessions/new">Schedule New Session</Link>
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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">+2 from last month</p>
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
            <div className="text-2xl font-bold">8</div>
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
            <div className="text-2xl font-bold">24.5</div>
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
            <div className="text-2xl font-bold">4.9</div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">(28 reviews)</span>
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
            <SessionCard
              name="Alex Johnson"
              time="10:00 AM - 11:00 AM"
              topic="Business Model Validation"
              status="upcoming"
              avatar="/placeholder.svg?height=40&width=40"
            />
            <SessionCard
              name="Sarah Chen"
              time="1:30 PM - 2:30 PM"
              topic="Fundraising Strategy"
              status="upcoming"
              avatar="/placeholder.svg?height=40&width=40"
            />
            <SessionCard
              name="David Park"
              time="4:00 PM - 5:00 PM"
              topic="Marketing Plan Review"
              status="upcoming"
              avatar="/placeholder.svg?height=40&width=40"
            />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/mentor/sessions">View All Sessions</Link>
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
            <MessagePreview
              name="Emily Rodriguez"
              time="10 min ago"
              message="Thanks for the feedback on my pitch deck! I've made the changes you suggested."
              avatar="/placeholder.svg?height=40&width=40"
              unread
            />
            <MessagePreview
              name="James Wilson"
              time="2 hours ago"
              message="I have a question about the financial projections we discussed yesterday."
              avatar="/placeholder.svg?height=40&width=40"
            />
            <MessagePreview
              name="Sophia Lee"
              time="Yesterday"
              message="Just wanted to confirm our session for tomorrow at 3 PM."
              avatar="/placeholder.svg?height=40&width=40"
            />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/mentor/messages">View All Messages</Link>
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
            <MenteeProgress
              name="Alex Johnson"
              avatar="/placeholder.svg?height=40&width=40"
              progress={75}
              goals={[
                { title: "Complete Business Plan", status: "completed" },
                { title: "Secure Initial Funding", status: "in-progress" },
                { title: "Launch MVP", status: "not-started" },
              ]}
            />
            <MenteeProgress
              name="Sarah Chen"
              avatar="/placeholder.svg?height=40&width=40"
              progress={40}
              goals={[
                { title: "Market Research", status: "completed" },
                { title: "Develop Marketing Strategy", status: "in-progress" },
                { title: "Create Sales Funnel", status: "not-started" },
              ]}
            />
            <MenteeProgress
              name="David Park"
              avatar="/placeholder.svg?height=40&width=40"
              progress={90}
              goals={[
                { title: "Identify Target Market", status: "completed" },
                { title: "Create Brand Identity", status: "completed" },
                {
                  title: "Launch Social Media Campaign",
                  status: "in-progress",
                },
              ]}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/mentor/mentees">View All Mentees</Link>
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
            <ResourceItem
              title="Startup Financial Model Template"
              type="Spreadsheet"
              sharedWith="Alex Johnson"
              date="2 days ago"
            />
            <ResourceItem
              title="Pitch Deck Best Practices"
              type="PDF"
              sharedWith="Sarah Chen, Emily Rodriguez"
              date="1 week ago"
            />
            <ResourceItem
              title="Customer Acquisition Strategies"
              type="Article"
              sharedWith="David Park"
              date="2 weeks ago"
            />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/mentor/resources">Manage Resources</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reports</CardTitle>
            <CardDescription>Mentee progress reports due soon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ReportItem
              mentee="Alex Johnson"
              dueDate="April 15, 2025"
              type="Quarterly Progress"
              status="pending"
            />
            <ReportItem
              mentee="Sarah Chen"
              dueDate="April 22, 2025"
              type="Monthly Check-in"
              status="pending"
            />
            <ReportItem
              mentee="David Park"
              dueDate="May 1, 2025"
              type="Goal Assessment"
              status="pending"
            />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/mentor/reports">View All Reports</Link>
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
        {status === "completed"
          ? "Completed"
          : status === "upcoming"
          ? "Upcoming"
          : "In Progress"}
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

function MenteeProgress({ name, avatar, progress, goals }) {
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
            <p className="text-xs text-gray-500">Overall Progress</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <Link
            href={`/mentor/mentees/${name.toLowerCase().replace(" ", "-")}`}
          >
            View Profile
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
        {goals.map((goal, index) => (
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
        ))}
      </div>
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
        {status === "completed"
          ? "Completed"
          : status === "pending"
          ? "Pending"
          : "Overdue"}
      </Badge>
    </div>
  );
}
