import { useEffect, useState, createContext } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Home,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import { getCurrentUser } from "../../services/authService";
import { UserContext } from "../../context/UserContext"; // Import context
import Avatar from "../avatar/Avatar";
import AvatarImage from "../avatar/AvatarImage";
import AvatarFallback from "../avatar/AvatarFallback";
import { ToastContainer } from "react-toastify";

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <UserContext.Provider value={user}>
      <div className="flex max-h-screen overflow-scroll bg-muted/20">
        {/* Sidebar */}
        <aside
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } w-64 flex-col border-r bg-card md:block`}
        >
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">YE Platform</h2>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <NavItem
              to="/dashboard"
              icon={<Home className="h-5 w-5" />}
              label="Dashboard"
            />
            <NavItem
              to="/dashboard/sessions"
              icon={<Calendar className="h-5 w-5" />}
              label="Session"
            />
            <NavItem
              to="/dashboard/resources"
              icon={<BookOpen className="h-5 w-5" />}
              label="Resources"
            />
            <NavItem
              to="/dashboard/mentors"
              icon={<Users className="h-5 w-5" />}
              label="Mentors"
            />
            <NavItem
              to="/dashboard/messages"
              icon={<MessageSquare className="h-5 w-5" />}
              label="Messages"
            />
            <NavItem
              to="/dashboard/settings"
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
            />
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

          {/* Main content - Now all child components can access `user` */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    <ToastContainer />
    </UserContext.Provider>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-3 w-full p-2 text-left hover:bg-gray-200 rounded-md"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
