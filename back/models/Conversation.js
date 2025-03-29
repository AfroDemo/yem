const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Conversation = sequelize.define(
  "Conversation",
  {
    // Participants: Assuming the 'users' table contains user data
    participants: {
      type: DataTypes.JSON, // Store an array of user IDs for participants
      allowNull: false,
    },
    lastMessage: {
      type: DataTypes.JSON, // Store message details as a JSON object (content, senderId, timestamp)
      allowNull: true, // Can be null if no message
      defaultValue: {}, // Default to an empty object if no message is set
    },
    unreadCount: {
      type: DataTypes.JSON, // Store unread counts as a JSON object, with user IDs as keys and counts as values
      defaultValue: {},
    },
  },
  {
    tableName: "conversations", // Table name for conversations
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = Conversation;
