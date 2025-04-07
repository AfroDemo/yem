import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForMentees from "./pages/ForMentees";
import Resources from "./pages/Resources";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import SuccessStories from "./pages/SuccessStories";
import About from "./pages/About";
import EventsPage from "./pages/Event/Events";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import DashboardLayout from "./components/layout/DashboardLayout";
import MessagesPage from "./pages/Message/Messages";
import ResourcesPage from "./pages/Dashboard/Resources/Resource";
import NewMessagePage from "./pages/Message/Create";
import MentorLayout from "./components/layout/MentorLayout";
import MentorResources from "./pages/Mentor/Resources";
import UploadResourcePage from "./pages/Mentor/Resources/create";
import MatchPage from "./pages/Matches/Index";
import MentorProfilePage from "./pages/Matches/Show";
import RequestMentorshipPage from "./pages/Matches/Create";
import MentorRequestsPage from "./pages/Matches/Requests";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenteesPage from "./pages/Mentor/Mentee/mentee";
import MenteeRequestsPage from "./pages/Mentor/Mentee/Requests";
import Dashboard from "./pages/Dashboard/Dashboard";
import SettingsPage from "./pages/Setting";

// Loading component
const LoadingScreen = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin border-t-4 border-blue-500 rounded-full w-12 h-12"></div>
  </div>
);

// Role-based Route Component
const RoleBasedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

// Auth Redirect Component
const AuthRedirectRoute = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Outlet />;
  return user.role == "mentor" ? (
    <Navigate to="/mentor" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

// Main Layout Component
const MainLayout = () => (
  <>
    <Navbar />
    <main className="flex-grow">
      <Outlet />
      <ToastContainer />
    </main>
    <Footer />
  </>
);

// Dashboard Routes
const dashboardRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/dashboard/events", component: <EventsPage /> },
  { path: "/dashboard/messages", component: <MessagesPage /> },
  { path: "/dashboard/messages/new", component: <NewMessagePage /> },
  { path: "/dashboard/mentors", component: <MatchPage /> },
  { path: "/dashboard/mentors/:mentorId", component: <MentorProfilePage /> },
  { path: "/dashboard/mentors/requests", component: <MentorRequestsPage /> },
  {
    path: "/dashboard/mentors/:mentorId/request",
    component: <RequestMentorshipPage />,
  },
  { path: "/dashboard/resources", component: <ResourcesPage /> },
  { path: "/dashboard/settings", component: <SettingsPage /> },
];

const mentorDashboardRoutes = [
  { path: "/mentor", component: <Dashboard /> },
  { path: "/mentor/events", component: <EventsPage /> },
  { path: "/mentor/messages", component: <MessagesPage /> },
  { path: "/mentor/messages/new", component: <NewMessagePage /> },
  { path: "/mentor/mentees", component: <MenteesPage /> },
  { path: "/mentor/mentees/requests", component: <MenteeRequestsPage /> },
  { path: "/mentor/resources", component: <MentorResources /> },
  { path: "/mentor/resource/upload", component: <UploadResourcePage /> },
  { path: "/mentor/settings", component: <SettingsPage /> },
];

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Routes with main layout */}
            <Route element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/events" element={<Events />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/success-stories" element={<SuccessStories />} />

              {/* Auth routes with redirect */}
              <Route path="/login" element={<AuthRedirectRoute />}>
                <Route index element={<Login />} />
              </Route>
              <Route path="/register" element={<AuthRedirectRoute />}>
                <Route index element={<Register />} />
              </Route>
            </Route>

            {/* Protected Dashboard Routes */}
            <Route
              element={<RoleBasedRoute allowedRoles={["mentee", "admin"]} />}
            >
              <Route element={<DashboardLayout />}>
                {dashboardRoutes.map(({ path, component }) => (
                  <Route key={path} path={path} element={component} />
                ))}
                <Route path="/for-mentees" element={<ForMentees />} />
              </Route>
            </Route>

            {/* Mentor Routes */}
            <Route element={<RoleBasedRoute allowedRoles={["mentor"]} />}>
              <Route element={<MentorLayout />}>
                {mentorDashboardRoutes.map(({ path, component }) => (
                  <Route key={path} path={path} element={component} />
                ))}
              </Route>
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
