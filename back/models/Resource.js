const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User"); // Assuming User model exists

const Resource = sequelize.define(
  "Resource",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("article", "video", "template", "book"),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
    },
    fileUrl: {
      type: DataTypes.STRING,
    },
    externalUrl: {
      type: DataTypes.STRING,
    },
    thumbnail: {
      type: DataTypes.STRING,
    },
    author: {
      type: DataTypes.STRING,
    },
    tags: {
      type: DataTypes.JSON, // Storing an array of strings in JSON format
    },
    visibility: {
      type: DataTypes.ENUM("public", "mentors", "mentees", "private"),
      allowNull: false,
      defaultValue: "public",
    },
    createdBy: {
      type: DataTypes.INTEGER, // Foreign key referencing the User model
      references: {
        model: "users", // Assuming 'users' table for the User model
        key: "id",
      },
    },
  },
  {
    tableName: "resources",
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Association: Define the relationship between Resource and User
Resource.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

module.exports = Resource;
