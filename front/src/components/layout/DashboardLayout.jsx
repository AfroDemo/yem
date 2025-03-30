import { useState } from "react";
import {
  BookOpen,
  Calendar,
  Home,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:flex w-64 flex-col border-r bg-card md:block`}
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">YE Platform</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            href="/dashboard"
            icon={<Home className="h-5 w-5" />}
            label="Dashboard"
          />
          <NavItem
            href="/dashboard/events"
            icon={<Calendar className="h-5 w-5" />}
            label="Events"
          />
          <NavItem
            href="/dashboard/resources"
            icon={<BookOpen className="h-5 w-5" />}
            label="Resources"
          />
          <NavItem
            href="/dashboard/network"
            icon={<Users className="h-5 w-5" />}
            label="Network"
          />
          <NavItem
            href="/dashboard/messages"
            icon={<MessageSquare className="h-5 w-5" />}
            label="Messages"
          />
          <NavItem
            href="/dashboard/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
          />
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <img
              src="/placeholder.svg?height=40&width=40"
              alt="User avatar"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Pro Member</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-col flex-1">
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <h2 className="text-xl font-bold">YE Platform</h2>
          <button
            className="p-2 border rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label }) {
  return (
    <a
      href={href}
      className="flex items-center space-x-3 w-full p-2 text-left hover:bg-gray-200 rounded-md"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}
