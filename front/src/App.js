import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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

// Layout components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AuthRedirectRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" />; // Redirect to home/dashboard if logged in
  }

  return children;
};

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthProvider>
        <Router>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />

              {/* If user is logged in, redirect to homepage */}
              <Route
                path="/login"
                element={
                  <AuthRedirectRoute>
                    <Login />
                  </AuthRedirectRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthRedirectRoute>
                    <Register />
                  </AuthRedirectRoute>
                }
              />

              <Route
                path="/for-mentees"
                element={
                  <ProtectedRoute>
                    <ForMentees />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/events" element={<Events />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/success-stories" element={<SuccessStories />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
