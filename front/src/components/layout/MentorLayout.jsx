import {
  BookOpen,
  Calendar,
  ChevronDown,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import Avatar from "../avatar/Avatar";
import AvatarImage from "../avatar/AvatarImage";
import AvatarFallback from "../avatar/AvatarFallback";
import { Link, Outlet } from "react-router-dom";
import Button from "../button";
import Badge from "../badge";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/authService";

export default function MentorLayout() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="flex min-h-screen bg-gray-100/20">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 px-2">
              Mentor
            </Badge>
            <h2 className="text-xl font-bold">YE Platform</h2>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            href="/mentor"
            icon={<Home className="h-5 w-5" />}
            label="Dashboard"
          />
          <NavItem
            href="/mentor/mentees"
            icon={<Users className="h-5 w-5" />}
            label="My Mentees"
          />
          <NavItem
            href="/mentor/sessions"
            icon={<Calendar className="h-5 w-5" />}
            label="Sessions"
          />
          <NavItem
            href="/mentor/resources"
            icon={<BookOpen className="h-5 w-5" />}
            label="Resources"
          />
          <NavItem
            href="/mentor/messages"
            icon={<MessageSquare className="h-5 w-5" />}
            label="Messages"
          />
          <NavItem
            href="/mentor/reports"
            icon={<FileText className="h-5 w-5" />}
            label="Reports"
          />
          <NavItem
            href="/mentor/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
          />
          <Link
            onClick={logout}
            className="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Sign Out
          </Link>
        </nav>
        <div className="p-4 border-t absolute bottom-0">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={
                  user.profileImage
                    ? `http://localhost:5000${user.profileImage}`
                    : "/placeholder.svg?height=96&width=96"
                }
                alt={user.name}
              />
              <AvatarFallback>MJ</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-medium text-sm">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500">Senior Mentor</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-col flex-1">
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 px-2">
              Mentor
            </Badge>
            <h2 className="text-xl font-bold">YE Platform</h2>
          </div>
          <Button variant="outline" size="icon">
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
          </Button>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
