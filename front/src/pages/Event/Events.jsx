import { CalendarIcon, Filter, MapPin, Search } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Events</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Create Event
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search events..."
                className="pl-8 border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <button className="flex gap-2 px-4 py-2 border border-gray-300 rounded-md">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-gray-200 rounded-md">
                Upcoming
              </button>
              <button className="px-4 py-2 bg-gray-200 rounded-md">
                Registered
              </button>
              <button className="px-4 py-2 bg-gray-200 rounded-md">Past</button>
            </div>

            <div className="space-y-4">
              <EventCard
                title="Startup Funding Workshop"
                date="April 15, 2025"
                time="2:00 PM - 4:00 PM"
                location="Virtual"
                description="Learn how to secure funding for your startup from experienced venture capitalists and angel investors."
                category="Workshop"
                attendees={42}
                isRegistered={true}
              />
              <EventCard
                title="Networking Mixer"
                date="April 22, 2025"
                time="6:00 PM - 8:00 PM"
                location="Downtown Business Hub"
                description="Connect with fellow entrepreneurs in a casual setting. Light refreshments will be served."
                category="Networking"
                attendees={78}
                isRegistered={true}
              />
              <EventCard
                title="Marketing Masterclass"
                date="May 5, 2025"
                time="1:00 PM - 3:30 PM"
                location="Virtual"
                description="Discover the latest digital marketing strategies to grow your business online."
                category="Workshop"
                attendees={65}
                isRegistered={true}
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <div className="border border-gray-300 rounded-md p-4">
            <h3 className="text-xl font-bold">Event Calendar</h3>
            <p className="text-sm text-muted-foreground">
              View upcoming events by date
            </p>
            <div className="text-center mt-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                April 2025
              </div>
              <div className="grid grid-cols-7 gap-1 text-xs mb-2">
                <div>Su</div>
                <div>Mo</div>
                <div>Tu</div>
                <div>We</div>
                <div>Th</div>
                <div>Fr</div>
                <div>Sa</div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-sm">
                <div className="text-muted-foreground">30</div>
                <div className="text-muted-foreground">31</div>
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
                <div>6</div>
                <div>7</div>
                <div>8</div>
                <div>9</div>
                <div>10</div>
                <div>11</div>
                <div>12</div>
                <div>13</div>
                <div>14</div>
                <div className="bg-blue-500 text-white rounded-full">15</div>
                <div>16</div>
                <div>17</div>
                <div>18</div>
                <div>19</div>
                <div>20</div>
                <div>21</div>
                <div className="bg-blue-500 text-white rounded-full">22</div>
                <div>23</div>
                <div>24</div>
                <div>25</div>
                <div>26</div>
                <div>27</div>
                <div>28</div>
                <div>29</div>
                <div>30</div>
                <div className="text-muted-foreground">1</div>
                <div className="text-muted-foreground">2</div>
                <div className="text-muted-foreground">3</div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="border border-gray-300 rounded-md p-4">
              <h3 className="text-xl font-bold">Event Categories</h3>
              <p className="text-sm text-muted-foreground">
                Browse events by type
              </p>
              <button className="w-full text-left py-2 border-b border-gray-300">
                Workshops
              </button>
              <button className="w-full text-left py-2 border-b border-gray-300">
                Networking
              </button>
              <button className="w-full text-left py-2 border-b border-gray-300">
                Conferences
              </button>
              <button className="w-full text-left py-2 border-b border-gray-300">
                Seminars
              </button>
              <button className="w-full text-left py-2 border-b border-gray-300">
                Competitions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({
  title,
  date,
  time,
  location,
  description,
  category,
  attendees,
  isRegistered,
}) {
  return (
    <div className="border border-gray-300 rounded-md p-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-xl font-semibold">{title}</h4>
          <p className="text-sm text-muted-foreground">
            {date} • {time}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-md text-xs font-semibold ${
            category === "Workshop"
              ? "bg-blue-100 text-blue-800"
              : category === "Networking"
              ? "bg-green-100 text-green-800"
              : category === "Conference"
              ? "bg-purple-100 text-purple-800"
              : category === "Seminar"
              ? "bg-amber-100 text-amber-800"
              : category === "Competition"
              ? "bg-red-100 text-red-800"
              : ""
          }`}
        >
          {category}
        </span>
      </div>
      <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2">
        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
        <span>{location}</span>
      </div>
      <p className="text-sm mt-2">{description}</p>
      <div className="mt-4 text-sm text-muted-foreground">
        {attendees} people attending
      </div>
      <div className="mt-4 flex justify-between">
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm">
          View Details
        </button>
        <button
          className={`px-4 py-2 border rounded-md text-sm ${
            isRegistered ? "bg-gray-300" : "bg-blue-500 text-white"
          }`}
        >
          {isRegistered ? "Registered" : "Register"}
        </button>
      </div>
    </div>
  );
}
