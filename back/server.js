require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize, testConnection } = require("./config/db");
const path = require('path');

// Route imports
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const mentorProfileRoutes = require("./routes/mentorProfiles");
const menteeProfileRoutes = require("./routes/menteeProfiles");
const mentorshipRoutes = require("./routes/mentorships");
const resourceRoutes = require("./routes/resources");
const eventRoutes = require("./routes/events");
const eventRegistrationRoutes = require("./routes/eventRegistrations");
const messageRoutes = require("./routes/messages");
const conversationRoutes = require("./routes/conversations");
const successStoryRoutes = require("./routes/successStories");

// Initialize express app
const app = express();
// Debugging middleware for static files
app.use('/uploads', (req, res, next) => {
  console.log('Request for:', req.path);
  console.log('Looking in:', path.join(__dirname, 'public/uploads', req.path));
  next();
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

testConnection();

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log("MySQL connected successfully"))
  .catch((err) => console.error("MySQL connection error:", err));

// Sync all models
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Database sync error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mentor-profiles", mentorProfileRoutes);
app.use("/api/mentee-profiles", menteeProfileRoutes);
app.use("/api/mentorships", mentorshipRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/event-registrations", eventRegistrationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/success-stories", successStoryRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Youth Entrepreneur Mentorship Platform API",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
