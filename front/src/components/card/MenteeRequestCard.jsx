import { ArrowLeft, Calendar, Check, Clock, MessageSquare, MoreHorizontal, X } from "lucide-react"

export function MenteeRequestCard({ mentee, status }) {
    return (
      <div className="border rounded-lg bg-white shadow-sm">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Avatar and Basic Info */}
            <div className="flex flex-col items-center text-center md:text-left md:items-start">
              <div className="relative h-16 w-16 rounded-full overflow-hidden mb-2">
                <img 
                  src="/placeholder.svg?height=64&width=64" 
                  alt={mentee.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-lg font-semibold">
                  {mentee.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <h3 className="font-semibold">{mentee.name}</h3>
              <p className="text-sm text-gray-500">{mentee.role}</p>
              <span className={`mt-2 px-2 py-1 text-xs rounded-full bg-${mentee.badgeColor}-100 text-${mentee.badgeColor}-800`}>
                {mentee.industry}
              </span>
            </div>
  
            {/* Right Column - Details */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      status === 'pending' ? 'border border-gray-300' : 
                      status === 'accepted' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    <p className="text-sm text-gray-500">Requested on {mentee.requestDate}</p>
                  </div>
                  <h4 className="font-medium mt-2">{mentee.package}</h4>
                  <p className="text-sm text-gray-500">{mentee.packageDetails}</p>
                </div>
                <div className="flex mt-4 md:mt-0 gap-2">
                  {status === 'pending' ? (
                    <>
                      <button className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                      </button>
                      <button className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-gray-300 bg-white text-red-500 hover:bg-gray-50 hover:text-red-700">
                        <X className="mr-2 h-4 w-4" />
                        Decline
                      </button>
                      <button className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
                        <Check className="mr-2 h-4 w-4" />
                        Accept
                      </button>
                    </>
                  ) : status === 'accepted' ? (
                    <>
                      <button className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                      </button>
                      <button className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Session
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                      </button>
                      <button className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
                        Reconsider
                      </button>
                    </>
                  )}
                </div>
              </div>
  
              {/* Request Message */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Request Message</h4>
                <p className="text-sm">{mentee.message}</p>
              </div>
  
              {/* Goals */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Goals</h4>
                <ul className="space-y-1">
                  {mentee.goals?.map((goal, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0"></div>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
  
              {/* Status-specific sections */}
              {status === 'accepted' && mentee.nextSession && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Next Session</h4>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <p className="text-sm">{mentee.nextSession}</p>
                  </div>
                </div>
              )}
  
              {status === 'declined' && (
                <>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Decline Reason</h4>
                    <div className="bg-gray-100 p-3 rounded-md">
                      <p className="text-sm">{mentee.declineReason}</p>
                    </div>
                  </div>
                  {mentee.recommendations && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Alternative Recommendations</h4>
                      <p className="text-sm">You recommended the following mentors who might be a better fit:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {mentee.recommendations.map((rec, i) => (
                          <span key={i} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
  
              {/* Availability */}
              {mentee.availability && (
                <div className="pt-2">
                  <p className="text-sm text-gray-500">{mentee.availability}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }