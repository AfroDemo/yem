"use client"

import { useState } from "react"
import { ArrowLeft, Paperclip, Send, X } from "lucide-react"
import { Link } from "react-router-dom"

// Custom Button component with Tailwind
const Button = ({ children, variant = 'default', size = 'default', className = '', asChild = false, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'underline-offset-4 hover:underline text-primary',
  }[variant]
  const sizeClasses = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
    icon: 'h-10 w-10',
  }[size]

  const Component = asChild ? Link : 'button'

  return (
    <Component className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} {...props}>
      {children}
    </Component>
  )
}

// Custom Card components
const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
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
  <p className={`text-sm text-muted-foreground ${className}`}>
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
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

// Custom Textarea component
const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

// Custom Avatar components
const Avatar = ({ children, className = '' }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
)

const AvatarImage = ({ src, alt, className = '' }) => (
  <img
    src={src}
    alt={alt}
    className={`aspect-square h-full w-full ${className}`}
  />
)

const AvatarFallback = ({ children, className = '' }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>
    {children}
  </div>
)

// Custom Badge component
const Badge = ({ children, variant = 'default', className = '' }) => {
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
  const variantClasses = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground border-border',
  }[variant]

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </div>
  )
}

export default function NewMessagePage() {
  const [selectedRecipients, setSelectedRecipients] = useState([
    { id: 1, name: "Emily Chen", avatar: "/placeholder.svg?height=40&width=40" },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])

  // Mock search function
  const handleSearch = (query) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    // Mock search results
    const results = [
      { id: 2, name: "Marcus Johnson", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 3, name: "Sophia Rodriguez", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 4, name: "David Thompson", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 5, name: "Jessica Williams", avatar: "/placeholder.svg?height=40&width=40" },
    ].filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) && !selectedRecipients.some((r) => r.id === user.id),
    )

    setSearchResults(results)
  }

  const addRecipient = (recipient) => {
    setSelectedRecipients([...selectedRecipients, recipient])
    setSearchQuery("")
    setSearchResults([])
  }

  const removeRecipient = (id) => {
    setSelectedRecipients(selectedRecipients.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <a href="/dashboard/messages">
            <ArrowLeft className="h-5 w-5" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold">New Message</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compose Message</CardTitle>
          <CardDescription>Send a message to one or more connections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">To:</label>
            <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md">
              {selectedRecipients.map((recipient) => (
                <Badge key={recipient.id} variant="secondary" className="flex items-center gap-1 pl-1">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={recipient.avatar} alt={recipient.name} />
                    <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{recipient.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-full"
                    onClick={() => removeRecipient(recipient.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              <Input
                type="text"
                placeholder="Search connections..."
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-w-[200px]"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  handleSearch(e.target.value)
                }}
              />
            </div>

            {searchResults.length > 0 && (
              <div className="border rounded-md shadow-sm max-h-60 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => addRecipient(result)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={result.avatar} alt={result.name} />
                      <AvatarFallback>{result.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{result.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject:
            </label>
            <Input id="subject" placeholder="Enter message subject..." />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message:
            </label>
            <Textarea id="message" placeholder="Type your message here..." className="min-h-[200px]" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Attachments:</label>
            <div className="border border-dashed rounded-md p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <Paperclip className="h-8 w-8 text-gray-500" />
                <p className="text-sm text-gray-500">
                  Drag and drop files here, or <span className="text-blue-600 cursor-pointer">browse</span>
                </p>
                <p className="text-xs text-gray-500">Maximum file size: 10MB</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Save Draft</Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}