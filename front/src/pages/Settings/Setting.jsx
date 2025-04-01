import { CreditCard } from "lucide-react";
import { useState } from "react";
import Card from "../../components/card/card";
import CardTitle from "../../components/card/cardTitle";
import CardDescription from "../../components/card/cardDescription";
import Button from "../../components/ui/button";
import Badge from "../../components/ui/badge";
import CardHeader from "../../components/card/cardHeader";
import CardContent from "../../components/card/cardContent";
import CardFooter from "../../components/card/cardFooter";

const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

const Label = ({ children, className = "", htmlFor }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
      {children}
    </label>
  );
};

const Tabs = ({ defaultValue, children, className = "" }) => {
  return (
    <div className={`${className}`} defaultValue={defaultValue}>
      {children}
    </div>
  );
};

const TabsList = ({ children, className = "" }) => {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
    >
      {children}
    </div>
  );
};

const TabsTrigger = ({ children, value, active, onClick, className = "" }) => {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        active ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, className = "" }) => {
  return (
    <div
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </div>
  );
};

const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

const Switch = ({ className = "", ...props }) => {
  return (
    <button
      type="button"
      className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input ${className}`}
      role="switch"
      {...props}
    >
      <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
    </button>
  );
};

const Avatar = ({ children, className = "" }) => {
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
    >
      {children}
    </div>
  );
};

const AvatarImage = ({ src, alt, className = "" }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`aspect-square h-full w-full ${className}`}
    />
  );
};

const AvatarFallback = ({ children, className = "" }) => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}
    >
      {children}
    </div>
  );
};

const Select = ({ children, defaultValue, className = "" }) => {
  return <div className={`relative ${className}`}>{children}</div>;
};

const SelectTrigger = ({ children, className = "" }) => {
  return (
    <button
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

const SelectValue = ({ placeholder, className = "" }) => {
  return <span className={`${className}`}>{placeholder}</span>;
};

const SelectContent = ({ children, className = "" }) => {
  return (
    <div
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 ${className}`}
    >
      {children}
    </div>
  );
};

const SelectItem = ({ children, value, className = "" }) => {
  return (
    <div
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
      data-value={value}
    >
      {children}
    </div>
  );
};

const Separator = ({ className = "" }) => {
  return (
    <div className={`shrink-0 bg-border h-[1px] w-full my-4 ${className}`} />
  );
};

// Main component
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger
            value="profile"
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="account"
            active={activeTab === "account"}
            onClick={() => setActiveTab("account")}
          >
            Account
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            active={activeTab === "privacy"}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            active={activeTab === "billing"}
            onClick={() => setActiveTab("billing")}
          >
            Billing
          </TabsTrigger>
        </TabsList>

        {activeTab === "profile" && (
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information and how it appears to others
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src="/placeholder.svg?height=96&width=96"
                        alt="Profile picture"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First name</Label>
                        <Input id="first-name" defaultValue="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input id="last-name" defaultValue="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="headline">Professional Headline</Label>
                      <Input
                        id="headline"
                        defaultValue="Tech Entrepreneur & Startup Founder"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    defaultValue="Passionate tech entrepreneur with 5 years of experience in SaaS startups. Currently building innovative solutions for small businesses."
                  />
                  <p className="text-xs text-gray-500">
                    Brief description of yourself for your profile.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Business Name</Label>
                    <Input id="company" defaultValue="TechNova Solutions" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role/Position</Label>
                    <Input id="role" defaultValue="Founder & CEO" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select defaultValue="technology">
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="health">
                          Health & Wellness
                        </SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue="San Francisco, CA" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    defaultValue="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Skills & Expertise</Label>
                  <div className="border rounded-md p-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center">
                        Entrepreneurship
                        <button className="ml-2 text-gray-500 hover:text-gray-900">
                          ×
                        </button>
                      </div>
                      <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center">
                        Product Management
                        <button className="ml-2 text-gray-500 hover:text-gray-900">
                          ×
                        </button>
                      </div>
                      <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center">
                        Business Strategy
                        <button className="ml-2 text-gray-500 hover:text-gray-900">
                          ×
                        </button>
                      </div>
                      <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center">
                        Marketing
                        <button className="ml-2 text-gray-500 hover:text-gray-900">
                          ×
                        </button>
                      </div>
                      <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center">
                        Fundraising
                        <button className="ml-2 text-gray-500 hover:text-gray-900">
                          ×
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Add a skill..." className="h-8" />
                      <Button size="sm">Add</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Profiles</CardTitle>
                <CardDescription>
                  Connect your social media accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0077B5]/10 p-2 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="#0077B5"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">LinkedIn</h4>
                      <p className="text-sm text-gray-500">
                        linkedin.com/in/johndoe
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Disconnect
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1DA1F2]/10 p-2 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="#1DA1F2"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Twitter</h4>
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  </div>
                  <Button size="sm">Connect</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#4267B2]/10 p-2 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="#4267B2"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Facebook</h4>
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  </div>
                  <Button size="sm">Connect</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#E4405F]/10 p-2 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="#E4405F"
                      >
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Instagram</h4>
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  </div>
                  <Button size="sm">Connect</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {activeTab === "account" && (
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your account details and email preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john.doe@example.com"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Verification</Label>
                    <p className="text-sm text-gray-500">
                      Your email has been verified
                    </p>
                  </div>
                  <div className="flex h-5 items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span className="text-sm font-medium text-green-500">
                      Verified
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Password</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">
                      Protect your account with 2FA
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border border-red-300 p-4">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-medium text-red-600">Delete Account</h4>
                    <p className="text-sm text-gray-500">
                      Once you delete your account, there is no going back. This
                      action cannot be undone.
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-fit mt-2"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {activeTab === "notifications" && (
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <Separator />

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Messages</Label>
                      <p className="text-sm text-gray-500">
                        Receive email notifications for new messages
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Connection Requests</Label>
                      <p className="text-sm text-gray-500">
                        Receive email notifications for new connection requests
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Event Reminders</Label>
                      <p className="text-sm text-gray-500">
                        Receive email reminders for upcoming events
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Resource Updates</Label>
                      <p className="text-sm text-gray-500">
                        Receive emails about new resources in your areas of
                        interest
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Platform Updates</Label>
                      <p className="text-sm text-gray-500">
                        Receive emails about platform updates and new features
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-gray-500">
                        Receive promotional emails and special offers
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">In-App Notifications</h3>
                  <Separator />

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Messages</Label>
                      <p className="text-sm text-gray-500">
                        Receive in-app notifications for new messages
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Connection Activity</Label>
                      <p className="text-sm text-gray-500">
                        Receive in-app notifications for connection activity
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Event Reminders</Label>
                      <p className="text-sm text-gray-500">
                        Receive in-app reminders for upcoming events
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Resource Recommendations</Label>
                      <p className="text-sm text-gray-500">
                        Receive in-app notifications for recommended resources
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}

        {activeTab === "privacy" && (
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control who can see your information and how it's used
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Visibility</h3>
                  <Separator />

                  <div className="space-y-2">
                    {" "}
                    <Label htmlFor="profile-visibility">
                      Who can see your profile
                    </Label>
                    <Select defaultValue="connections">
                      <SelectTrigger id="profile-visibility">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="connections">
                          Connections only
                        </SelectItem>
                        <SelectItem value="nobody">Nobody</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="connection-visibility">
                      Who can see your connections
                    </Label>
                    <Select defaultValue="connections">
                      <SelectTrigger id="connection-visibility">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="connections">
                          Connections only
                        </SelectItem>
                        <SelectItem value="nobody">Nobody</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show online status</Label>
                      <p className="text-sm text-gray-500">
                        Allow others to see when you're online
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Connection Requests</h3>
                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="connection-requests">
                      Who can send you connection requests
                    </Label>
                    <Select defaultValue="everyone">
                      <SelectTrigger id="connection-requests">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="connections-of-connections">
                          Connections of connections
                        </SelectItem>
                        <SelectItem value="nobody">Nobody</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Messaging</h3>
                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="messaging-permissions">
                      Who can message you
                    </Label>
                    <Select defaultValue="connections">
                      <SelectTrigger id="messaging-permissions">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="connections">
                          Connections only
                        </SelectItem>
                        <SelectItem value="nobody">Nobody</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Read receipts</Label>
                      <p className="text-sm text-gray-500">
                        Let others know when you've read their messages
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Usage</h3>
                  <Separator />

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Personalized recommendations</Label>
                      <p className="text-sm text-gray-500">
                        Allow us to use your data to provide personalized
                        recommendations
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Usage analytics</Label>
                      <p className="text-sm text-gray-500">
                        Allow us to collect anonymous usage data to improve our
                        platform
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Privacy Settings</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data & Privacy</CardTitle>
                <CardDescription>
                  Manage your data and download information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-medium">Download Your Data</h4>
                    <p className="text-sm text-gray-500">
                      You can download a copy of all the data we have stored for
                      your account.
                    </p>
                    <Button variant="outline" size="sm" className="w-fit mt-2">
                      Request Data Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {activeTab === "billing" && (
          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4 bg-gray-50">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        Current Plan: Professional
                      </h4>
                      <Badge>Active</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Your subscription renews on May 15, 2025
                    </p>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Plan includes:</p>
                      <ul className="text-sm text-gray-500 mt-1 space-y-1">
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-blue-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Access to community forum
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-blue-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          1-on-1 mentorship sessions
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-blue-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Advanced courses and workshops
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-blue-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Weekly mastermind groups
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="outline" className="text-red-600">
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Manage your payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Visa ending in 4242</h4>
                        <p className="text-sm text-gray-500">Expires 04/2026</p>
                      </div>
                    </div>
                    <Badge variant="outline">Default</Badge>
                  </div>
                </div>

                <Button variant="outline">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View your past invoices and payment history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 p-4 font-medium border-b">
                    <div>Date</div>
                    <div>Description</div>
                    <div>Amount</div>
                    <div className="text-right">Status</div>
                  </div>
                  <div className="divide-y">
                    <div className="grid grid-cols-4 p-4">
                      <div className="text-sm">Apr 15, 2025</div>
                      <div className="text-sm">Professional Plan - Monthly</div>
                      <div className="text-sm">$19.99</div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          Paid
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 p-4">
                      <div className="text-sm">Mar 15, 2025</div>
                      <div className="text-sm">Professional Plan - Monthly</div>
                      <div className="text-sm">$19.99</div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          Paid
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 p-4">
                      <div className="text-sm">Feb 15, 2025</div>
                      <div className="text-sm">Professional Plan - Monthly</div>
                      <div className="text-sm">$19.99</div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          Paid
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Invoices
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </div>
    </div>
  );
}
