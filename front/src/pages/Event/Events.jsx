import { CalendarIcon, Filter, MapPin, Search } from "lucide-react"

// Custom Button component
const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    ghost: 'hover:bg-gray-100',
    link: 'text-blue-600 underline-offset-4 hover:underline',
  }[variant]
  const sizeClasses = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
    icon: 'h-10 w-10',
  }[size]

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Custom Card components
const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
)

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
)

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
)

const CardFooter = ({ children, className = '' }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
)

// Custom Input component
const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

// Custom Tabs components
const Tabs = ({ children, defaultValue, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

const TabsList = ({ children, className = '' }) => {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}>
      {children}
    </div>
  )
}

const TabsTrigger = ({ children, value, className = '' }) => {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm ${className}`}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ children, value, className = '' }) => {
  return (
    <div className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}>
      {children}
    </div>
  )
}

// Custom Badge component
const Badge = ({ children, className = '', ...props }) => {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`} {...props}>
      {children}
    </span>
  )
}

// EventCard component
function EventCard({ title, date, time, location, description, category, attendees, isRegistered, isPast = false }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1">
              {date} • {time}
            </CardDescription>
          </div>
          <Badge
            className={`
              ${category === "Workshop" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : ""}
              ${category === "Networking" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
              ${category === "Conference" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" : ""}
              ${category === "Seminar" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" : ""}
              ${category === "Competition" ? "bg-red-100 text-red-800 hover:bg-red-100" : ""}
            `}
          >
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-2 text-sm text-gray-500 mb-4">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{location}</span>
        </div>
        <p className="text-sm">{description}</p>
        <div className="mt-4 text-sm text-gray-500">{attendees} people attending</div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        {isPast ? (
          <Button variant="secondary" size="sm">
            View Recording
          </Button>
        ) : (
          <Button size="sm" variant={isRegistered ? "secondary" : "default"}>
            {isRegistered ? "Registered" : "Register"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button>Create Event</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input type="search" placeholder="Search events..." className="pl-8" />
            </div>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="registered">Registered</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="space-y-4 mt-4">
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
              <EventCard
                title="Tech Startup Conference"
                date="May 12-14, 2025"
                time="9:00 AM - 5:00 PM"
                location="Innovation Center"
                description="A three-day conference featuring keynote speakers, panel discussions, and networking opportunities."
                category="Conference"
                attendees={210}
                isRegistered={false}
              />
              <EventCard
                title="Financial Planning Seminar"
                date="May 20, 2025"
                time="10:00 AM - 12:00 PM"
                location="Virtual"
                description="Essential financial planning strategies for small business owners and entrepreneurs."
                category="Seminar"
                attendees={38}
                isRegistered={false}
              />
            </TabsContent>
            <TabsContent value="registered" className="space-y-4 mt-4">
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
            </TabsContent>
            <TabsContent value="past" className="space-y-4 mt-4">
              <EventCard
                title="Business Plan Competition"
                date="March 10, 2025"
                time="1:00 PM - 5:00 PM"
                location="City Convention Center"
                description="Pitch your business plan to a panel of judges for a chance to win funding and mentorship."
                category="Competition"
                attendees={56}
                isRegistered={true}
                isPast={true}
              />
              <EventCard
                title="Social Media Strategy Workshop"
                date="February 28, 2025"
                time="10:00 AM - 12:00 PM"
                location="Virtual"
                description="Learn how to leverage social media platforms to grow your business and engage with customers."
                category="Workshop"
                attendees={89}
                isRegistered={true}
                isPast={true}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Event Calendar</CardTitle>
              <CardDescription>View upcoming events by date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 text-center">
                <div className="text-sm font-medium text-gray-500 mb-2">April 2025</div>
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
                  <div className="text-gray-400">30</div>
                  <div className="text-gray-400">31</div>
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
                  <div className="bg-blue-600 text-white rounded-full">15</div>
                  <div>16</div>
                  <div>17</div>
                  <div>18</div>
                  <div>19</div>
                  <div>20</div>
                  <div>21</div>
                  <div className="bg-blue-600 text-white rounded-full">22</div>
                  <div>23</div>
                  <div>24</div>
                  <div>25</div>
                  <div>26</div>
                  <div>27</div>
                  <div>28</div>
                  <div>29</div>
                  <div>30</div>
                  <div className="text-gray-400">1</div>
                  <div className="text-gray-400">2</div>
                  <div className="text-gray-400">3</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Add to Calendar
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Event Categories</CardTitle>
              <CardDescription>Browse events by type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Badge className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-100">42</Badge>
                Workshops
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-100">28</Badge>
                Networking
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Badge className="mr-2 bg-purple-100 text-purple-800 hover:bg-purple-100">15</Badge>
                Conferences
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Badge className="mr-2 bg-amber-100 text-amber-800 hover:bg-amber-100">23</Badge>
                Seminars
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Badge className="mr-2 bg-red-100 text-red-800 hover:bg-red-100">9</Badge>
                Competitions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}