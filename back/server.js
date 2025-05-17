require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize, testConnection } = require("./config/db");
const path = require("path");
const fs = require("fs");

// Route imports
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const mentorshipRoutes = require("./routes/mentorships");
const resourceRoutes = require("./routes/resources");
const eventRoutes = require("./routes/events");
const eventRegistrationRoutes = require("./routes/eventRegistrations");
const messageRoutes = require("./routes/messages");
const conversationRoutes = require("./routes/conversations");
const successStoryRoutes = require("./routes/successStories");
const mentorRoutes = require("./routes/mentor");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
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
app.use("/api/mentorships", mentorshipRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/event-registrations", eventRegistrationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/success-stories", successStoryRoutes);
app.use("/api/mentors", mentorRoutes);

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
