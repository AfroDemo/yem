const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('mentee', 'mentor', 'admin'),
      allowNull: false,
    },
    profileImage: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.STRING,
    },
    skills: {
      type: DataTypes.JSON,
    },
    interests: {
      type: DataTypes.JSON,
    },
    location: {
      type: DataTypes.STRING,
    },
    socialLinks: {
      type: DataTypes.JSON,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;
