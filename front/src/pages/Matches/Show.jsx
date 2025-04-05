import { ArrowLeft, BadgeCheck, Calendar, Clock, FileText, MessageSquare, Star, UserPlus } from "lucide-react"
import Button from "../../components/button"
import { Link, useParams } from "react-router-dom"
import TabsList from "../../components/tab/TabsList"
import TabsTrigger from "../../components/tab/TabsTrigger"
import TabsContent from "../../components/tab/TabsContent"
import Card from "../../components/card/card"
import CardHeader from "../../components/card/cardHeader"
import CardTitle from "../../components/card/cardTitle"
import CardDescription from "../../components/card/cardDescription"
import CardContent from "../../components/card/cardContent"
import Progress from "../../components/progress"
import Tabs from "../../components/tab/tabs"
import Badge from "../../components/badge"
import Avatar from "../../components/avatar/Avatar"
import AvatarImage from "../../components/avatar/AvatarImage"
import AvatarFallback from "../../components/avatar/AvatarFallback"
import CardFooter from "../../components/card/cardFooter"

// Mentor data object
const mentorData = {
  id: 1,
  name: "Michael Johnson",
  avatar: "/placeholder.svg?height=150&width=150",
  role: "Senior Mentor",
  industry: "Technology",
  experience: "15+ years",
  specialties: ["Business Strategy", "Fundraising", "Product Development", "Market Entry", "Team Building"],
  rating: 4.9,
  reviews: 28,
  matchPercentage: 95,
  generalAvailability: "Available next week",
  verified: true,
  bio: "I'm a technology entrepreneur with over 15 years of experience founding and scaling startups. I've successfully raised over $20M in venture capital and led two companies to acquisition. My passion is helping early-stage founders navigate the challenges of building a sustainable business and avoiding common pitfalls.",
  location: "San Francisco, CA",
  languages: ["English", "Spanish"],
  education: "MBA, Stanford University",
  achievements: [
    "Founded and exited two technology startups",
    "Raised $20M+ in venture funding",
    "Mentor at Y Combinator and Techstars",
    "Published author on startup strategy",
  ],
  mentorshipStyle: "I believe in a hands-on, practical approach to mentorship. I focus on actionable advice and accountability, helping founders set clear goals and develop strategies to achieve them. My mentees describe my style as direct, supportive, and results-oriented.",
  testimonials: [
    {
      text: "Michael's guidance was instrumental in helping us secure our seed round. His strategic insights and network connections made all the difference.",
      author: "Alex Chen",
      role: "CEO, DataSync",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      text: "Working with Michael helped me avoid countless mistakes in my startup journey. His experience and practical advice saved us time and money.",
      author: "Sarah Williams",
      role: "Founder, EcoTech",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
  mentorshipPackages: [
    {
      title: "Starter Package",
      sessions: "2 sessions per month",
      duration: "45 minutes each",
      communication: "Email support between sessions",
      price: "Free for platform members",
    },
    {
      title: "Growth Package",
      sessions: "4 sessions per month",
      duration: "60 minutes each",
      communication: "Email and chat support",
      price: "Free for platform members",
    },
  ],
  availability: {
    timezone: "Pacific Time (PT)",
    availableDays: ["Monday", "Wednesday", "Friday"],
    availableHours: "9:00 AM - 5:00 PM PT",
  }
}

// Similar mentors data
const similarMentors = [
  {
    id: "jennifer-williams",
    name: "Jennifer Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Marketing Expert",
    matchPercentage: 92
  },
  {
    id: "robert-chen",
    name: "Robert Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Startup Advisor",
    matchPercentage: 88
  },
  {
    id: "sophia-martinez",
    name: "Sophia Martinez",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Product Strategist",
    matchPercentage: 85
  }
]

export default function MentorProfilePage() {
  const {mentorId} = useParams()
  const mentor = mentorData // In a real app, you would fetch based on mentorId

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/mentors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Mentor Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MentorProfileHeader mentor={mentor} />
          
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="packages">Mentorship Packages</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <MentorDetails mentor={mentor} />
            </TabsContent>
            
            <TabsContent value="testimonials" className="space-y-4 mt-4">
              <Testimonials testimonials={mentor.testimonials} />
            </TabsContent>
            
            <TabsContent value="packages" className="space-y-4 mt-4">
              <MentorshipPackages packages={mentor.mentorshipPackages} mentorId={mentorId} />
            </TabsContent>
            
            <TabsContent value="availability" className="space-y-4 mt-4">
              <Availability availability={mentor.availability} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <MentorshipRequestCard mentor={mentor} mentorId={mentorId} />
          <SimilarMentors mentors={similarMentors} />
        </div>
      </div>
    </div>
  )
}

// Extracted Components

function MentorProfileHeader({ mentor }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center text-center md:text-left md:items-start">
            <div className="relative">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarImage src={mentor.avatar} alt={mentor.name} />
                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {mentor.verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1">
                  <BadgeCheck className="h-5 w-5" />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold">{mentor.name}</h2>
            <p className="text-gray-500">{mentor.role}</p>
            <div className="flex items-center mt-2">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{mentor.industry}</Badge>
            </div>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(mentor.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium">{mentor.rating}</span>
              <span className="mx-1 text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{mentor.reviews} reviews</span>
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                Experience: {mentor.experience}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                {mentor.generalAvailability}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">About</h3>
              <p className="text-sm">{mentor.bio}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Match Score</h3>
              <div className="flex items-center gap-2">
                <Progress value={mentor.matchPercentage} className="h-2 w-40" />
                <span className="text-sm font-medium">{mentor.matchPercentage}% match with your profile</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button className="flex-1" asChild>
                <Link href={`/dashboard/mentors/${mentor.id}/request`}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Request Mentorship
                </Link>
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MentorDetails({ mentor }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Background & Expertise</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Location</h4>
            <p className="text-sm">{mentor.location}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Languages</h4>
            <div className="flex flex-wrap gap-2">
              {mentor.languages.map((language, index) => (
                <Badge key={index} variant="outline">
                  {language}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Education</h4>
            <p className="text-sm">{mentor.education}</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Key Achievements</h4>
          <ul className="space-y-1">
            {mentor.achievements.map((achievement, index) => (
              <li key={index} className="text-sm flex items-start">
                <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0"></div>
                {achievement}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Mentorship Style</h4>
          <p className="text-sm">{mentor.mentorshipStyle}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function Testimonials({ testimonials }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What Mentees Say</CardTitle>
        <CardDescription>Feedback from previous mentees</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="border rounded-lg p-4">
            <p className="text-sm italic mb-4">"{testimonial.text}"</p>
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{testimonial.author}</p>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function MentorshipPackages({ packages, mentorId }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {packages.map((pkg, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{pkg.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start">
              <Calendar className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Session Frequency</p>
                <p className="text-sm text-gray-500">{pkg.sessions}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Session Duration</p>
                <p className="text-sm text-gray-500">{pkg.duration}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MessageSquare className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Communication</p>
                <p className="text-sm text-gray-500">{pkg.communication}</p>
              </div>
            </div>
            <div className="flex items-start">
              <FileText className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Price</p>
                <p className="text-sm text-gray-500">{pkg.price}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href={`/dashboard/mentors/${mentorId}/request?package=${index}`}>Select Package</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function Availability({ availability }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentor Availability</CardTitle>
        <CardDescription>When this mentor is available for sessions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Timezone</h4>
          <p className="text-sm">{availability.timezone}</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Available Days</h4>
          <div className="flex flex-wrap gap-2">
            {availability.availableDays.map((day, index) => (
              <Badge key={index} variant="outline">
                {day}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Available Hours</h4>
          <p className="text-sm">{availability.availableHours}</p>
        </div>
        <div className="pt-2">
          <p className="text-sm text-gray-500">
            After requesting mentorship, you'll be able to schedule specific session times based on this
            availability.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function MentorshipRequestCard({ mentor, mentorId }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Mentorship</CardTitle>
        <CardDescription>Start your mentorship journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">
          {mentor.name} is currently accepting new mentees. Send a request to start the mentorship process.
        </p>
        <div className="rounded-md bg-gray-100 p-3">
          <h4 className="font-medium text-sm mb-1">What to include in your request:</h4>
          <ul className="space-y-1 text-sm text-gray-500">
            <li className="flex items-start">
              <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0"></div>
              Your business goals and challenges
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0"></div>
              What you hope to gain from mentorship
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0"></div>
              Your commitment and availability
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/dashboard/mentors/${mentorId}/request`}>
            <UserPlus className="mr-2 h-4 w-4" />
            Request Mentorship
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function SimilarMentors({ mentors }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Mentors</CardTitle>
        <CardDescription>Other mentors you might like</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-100/50 cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src={mentor.avatar} alt={mentor.name} />
              <AvatarFallback>{mentor.name.charAt(0)}{mentor.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{mentor.name}</p>
              <p className="text-xs text-gray-500 truncate">{mentor.role} • {mentor.matchPercentage}% match</p>
            </div>
            <Button variant="ghost" size="sm" className="shrink-0" asChild>
              <Link href={`/dashboard/mentors/${mentor.id}`}>View</Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}