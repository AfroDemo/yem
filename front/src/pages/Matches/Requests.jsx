import { ArrowLeft, Calendar, Clock, MessageSquare, MoreHorizontal } from "lucide-react"
import Button from "../../components/button"
import { Link } from "react-router-dom"
import TabsList from "../../components/tab/TabsList"
import TabsTrigger from "../../components/tab/TabsTrigger"
import TabsContent from "../../components/tab/TabsContent"
import Card from "../../components/card/card"
import CardHeader from "../../components/card/cardHeader"
import CardTitle from "../../components/card/cardTitle"
import CardDescription from "../../components/card/cardDescription"
import CardContent from "../../components/card/cardContent"
import Tabs from "../../components/tab/tabs"
import Badge from "../../components/badge"
import Avatar from "../../components/avatar/Avatar"
import AvatarImage from "../../components/avatar/AvatarImage"
import AvatarFallback from "../../components/avatar/AvatarFallback"
import CardFooter from "../../components/card/cardFooter"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/DropDowns"

// Request data objects
const requestsData = {
  pending: [
    {
      id: 1,
      mentor: {
        name: "Michael Johnson",
        avatar: "/placeholder.svg?height=64&width=64",
        role: "Senior Mentor",
        industry: "Technology"
      },
      package: "Growth Package",
      details: "4 sessions per month • 60 minutes each",
      status: "Pending Review",
      date: "Requested on April 10, 2025",
      message: "I'm looking for guidance on scaling my SaaS startup and securing Series A funding. I need help with refining my pitch deck and developing a growth strategy for the next 12 months.",
      note: "Mentors typically respond within 2-3 business days. You'll receive a notification when Michael responds."
    },
    {
      id: 2,
      mentor: {
        name: "Jennifer Williams",
        avatar: "/placeholder.svg?height=64&width=64",
        role: "Marketing Expert",
        industry: "Technology"
      },
      package: "Starter Package",
      details: "2 sessions per month • 45 minutes each",
      status: "Pending Review",
      date: "Requested on April 8, 2025",
      message: "I need help developing a comprehensive digital marketing strategy for my tech startup. I'm particularly interested in content marketing and social media strategies to increase our brand awareness.",
      note: "Mentors typically respond within 2-3 business days. You'll receive a notification when Jennifer responds."
    }
  ],
  accepted: [
    {
      id: 3,
      mentor: {
        name: "Robert Chen",
        avatar: "/placeholder.svg?height=64&width=64",
        role: "Startup Advisor",
        industry: "Technology"
      },
      package: "Growth Package",
      details: "4 sessions per month • 60 minutes each",
      status: "Accepted",
      statusClass: "bg-green-100 text-green-800 hover:bg-green-100",
      date: "Accepted on April 5, 2025",
      response: "I'm excited to work with you on your pitch deck and fundraising strategy. Your business model has a lot of potential, and I believe I can help you refine your approach to investors. Let's schedule our first session to discuss your goals in more detail.",
      note: "Please schedule your first session within the next 7 days to begin your mentorship journey."
    }
  ],
  active: [
    {
      id: 4,
      mentor: {
        name: "Sophia Martinez",
        avatar: "/placeholder.svg?height=64&width=64",
        role: "Product Strategist",
        industry: "SaaS"
      },
      package: "Starter Package",
      details: "2 sessions per month • 45 minutes each",
      status: "Active",
      statusClass: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      date: "Started on March 15, 2025",
      nextSession: "April 18, 2025 • 10:00 AM - 10:45 AM (PT)",
      progress: "1 session completed • 1 remaining this month",
      note: "Your mentorship is active. You can schedule sessions, message your mentor, and track your progress."
    }
  ],
  completed: []
}

// Mentorship tips data
const mentorshipTips = [
  {
    title: "Prepare for Sessions",
    description: "Come to each session with specific questions and topics you want to discuss. This helps make the most of your limited time."
  },
  {
    title: "Take Action",
    description: "Implement the advice and feedback you receive. The most successful mentees actively apply what they learn."
  },
  {
    title: "Communicate Clearly",
    description: "Be open about your challenges and progress. Regular communication helps your mentor provide better guidance."
  }
]

export default function MentorRequestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/mentors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">My Mentor Requests</h1>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="pending">Pending ({requestsData.pending.length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({requestsData.accepted.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({requestsData.active.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({requestsData.completed.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4 mt-4">
          {requestsData.pending.map(request => (
            <RequestCard key={request.id} request={request} type="pending" />
          ))}
        </TabsContent>
        
        <TabsContent value="accepted" className="space-y-4 mt-4">
          {requestsData.accepted.map(request => (
            <RequestCard key={request.id} request={request} type="accepted" />
          ))}
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4 mt-4">
          {requestsData.active.map(request => (
            <RequestCard key={request.id} request={request} type="active" />
          ))}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 mt-4">
          {requestsData.completed.length > 0 ? (
            requestsData.completed.map(request => (
              <RequestCard key={request.id} request={request} type="completed" />
            ))
          ) : (
            <EmptyState />
          )}
        </TabsContent>
      </Tabs>

      <MentorshipTipsCard tips={mentorshipTips} />
    </div>
  )
}

// Request Card Component
function RequestCard({ request, type }) {
  const industryColor = {
    Technology: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    SaaS: "bg-amber-100 text-amber-800 hover:bg-amber-100"
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center text-center md:text-left md:items-start">
            <Avatar className="h-16 w-16 mb-2">
              <AvatarImage src={request.mentor.avatar} alt={request.mentor.name} />
              <AvatarFallback>
                {request.mentor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold">{request.mentor.name}</h3>
            <p className="text-sm text-gray-500">{request.mentor.role}</p>
            <Badge className={`mt-2 ${industryColor[request.mentor.industry] || "bg-gray-100 text-gray-800"}`}>
              {request.mentor.industry}
            </Badge>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={request.statusClass}>
                    {request.status}
                  </Badge>
                  <p className="text-sm text-gray-500">{request.date}</p>
                </div>
                <h4 className="font-medium mt-2">{request.package}</h4>
                <p className="text-sm text-gray-500">{request.details}</p>
              </div>
              <div className="flex mt-4 md:mt-0 gap-2">
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
                {type === 'pending' ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Request Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Request</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Cancel Request</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Session
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">
                {type === 'accepted' ? "Mentor's Response" : 
                 type === 'active' ? "Next Session" : "Your Request"}
              </h4>
              {type === 'active' ? (
                <>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{request.nextSession}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{request.progress}</p>
                  </div>
                </>
              ) : (
                <p className="text-sm">{type === 'accepted' ? request.response : request.message}</p>
              )}
            </div>

            <div className="pt-2">
              <p className="text-sm text-gray-500">{request.note}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Empty State Component
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Calendar className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium mb-2">No Completed Mentorships</h3>
      <p className="text-gray-500 max-w-md mb-6">
        You don't have any completed mentorship relationships yet. Completed mentorships will appear here.
      </p>
      <Button asChild>
        <Link href="/dashboard/mentors">Find a Mentor</Link>
      </Button>
    </div>
  )
}

// Mentorship Tips Card Component
function MentorshipTipsCard({ tips }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentorship Tips</CardTitle>
        <CardDescription>Get the most out of your mentorship experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tips.map((tip, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-500">{tip.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/dashboard/resources/mentorship-guide">View Mentorship Guide</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}