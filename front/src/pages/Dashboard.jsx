import { Bell, BookOpen, Calendar, MessageSquare, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button className="p-2 border rounded-lg">
          <Bell className="h-5 w-5" />
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between pb-2">
            <span className="text-sm font-medium">Upcoming Events</span>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 from last week</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between pb-2">
            <span className="text-sm font-medium">New Connections</span>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+4 from last week</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between pb-2">
            <span className="text-sm font-medium">Unread Messages</span>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">-2 from last week</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between pb-2">
            <span className="text-sm font-medium">Resources Accessed</span>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
          </div>
        </div>
      </div>

      {/* Events and Resources Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Events */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Upcoming Events</h3>
            <p className="text-sm text-muted-foreground">
              Events you've registered for in the next 30 days
            </p>
            <EventCard
              title="Startup Funding Workshop"
              date="April 15, 2025"
              time="2:00 PM - 4:00 PM"
              location="Virtual"
            />
            <EventCard
              title="Networking Mixer"
              date="April 22, 2025"
              time="6:00 PM - 8:00 PM"
              location="Downtown Business Hub"
            />
            <EventCard
              title="Marketing Masterclass"
              date="May 5, 2025"
              time="1:00 PM - 3:30 PM"
              location="Virtual"
            />
            <button className="w-full mt-4 p-2 border rounded-lg">
              <Link href="/events">View All Events</Link>
            </button>
          </div>
        </div>

        {/* Recommended Resources */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recommended Resources</h3>
            <p className="text-sm text-muted-foreground">
              Personalized resources based on your interests
            </p>
            <ResourceCard
              title="The Lean Startup Methodology"
              type="E-Book"
              category="Business Strategy"
            />
            <ResourceCard
              title="Digital Marketing for Beginners"
              type="Course"
              category="Marketing"
            />
            <ResourceCard
              title="Financial Planning for Startups"
              type="Webinar Recording"
              category="Finance"
            />
            <button className="w-full mt-4 p-2 border rounded-lg">
              <Link href="/resources">View All Resources</Link>
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Connections */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium">Suggested Connections</h3>
        <p className="text-sm text-muted-foreground">
          People you might want to connect with based on your industry and
          interests
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ConnectionCard
            name="Emily Chen"
            role="Tech Startup Founder"
            image="/placeholder.svg?height=100&width=100"
            mutualConnections={4}
          />
          <ConnectionCard
            name="Marcus Johnson"
            role="Marketing Consultant"
            image="/placeholder.svg?height=100&width=100"
            mutualConnections={2}
          />
          <ConnectionCard
            name="Sophia Rodriguez"
            role="E-commerce Entrepreneur"
            image="/placeholder.svg?height=100&width=100"
            mutualConnections={5}
          />
        </div>
        <button className="w-full mt-6 p-2 border rounded-lg">
          <Link href="/network">View All Connections</Link>
        </button>
      </div>
    </div>
  );
}

function EventCard({ title, date, time, location }) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg border">
      <div className="bg-primary/10 p-2 rounded-md">
        <Calendar className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">
          {date} • {time}
        </p>
        <p className="text-sm text-muted-foreground">Location: {location}</p>
      </div>
    </div>
  );
}

function ResourceCard({ title, type, category }) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg border">
      <div className="bg-primary/10 p-2 rounded-md">
        <BookOpen className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">Type: {type}</p>
        <p className="text-sm text-muted-foreground">Category: {category}</p>
      </div>
    </div>
  );
}

function ConnectionCard({ name, role, image, mutualConnections }) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-lg border">
      <img
        src={image || "/placeholder.svg"}
        alt={name}
        className="h-20 w-20 rounded-full mb-4"
      />
      <h4 className="font-medium">{name}</h4>
      <p className="text-sm text-muted-foreground mb-2">{role}</p>
      <p className="text-xs text-muted-foreground mb-4">
        {mutualConnections} mutual connections
      </p>
      <button className="w-full p-2 border rounded-lg">Connect</button>
    </div>
  );
}
