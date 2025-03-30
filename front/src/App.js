import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForMentees from "./pages/ForMentees";
import Resources from "./pages/Resources";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import SuccessStories from "./pages/SuccessStories";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import EventsPage from "./pages/Event/Events";

// Layout components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import DashboardLayout from "./components/layout/DashboardLayout";
import MessagesPage from "./pages/Message/Messages";
import NetworkPage from "./pages/Network/Network";
import ResourcesPage from "./pages/Resources/Resource";
import SettingsPage from "./pages/Settings/Setting";
import NewMessagePage from "./pages/Message/Create";

// Protected route component
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const AuthRedirectRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

// Main layout component
const MainLayout = () => (
  <>
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </>
);

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
              <Route element={<AuthRedirectRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
            </Route>

            {/* Protected dashboard routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/events" element={<EventsPage />} />
                <Route path="/dashboard/messages" element={<MessagesPage />} />
                <Route path="/dashboard/messages/new" element={<NewMessagePage />} />
                <Route path="/dashboard/network" element={<NetworkPage />} />
                <Route path="/dashboard/resources" element={<ResourcesPage />} />
                <Route path="/dashboard/settings" element={<SettingsPage />} />
                <Route path="/for-mentees" element={<ForMentees />} />
              </Route>
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
