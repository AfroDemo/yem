const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MentorProfile = sequelize.define('MentorProfile', {
  userId: {
    type: DataTypes.INTEGER, // Use DataTypes.INTEGER for foreign key reference
    allowNull: false,
    references: {
      model: 'users', // Assuming the 'users' table
      key: 'id',
    },
  },
  expertise: {
    type: DataTypes.JSON, // For storing an array of strings (expertise)
    allowNull: false,
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
  },
  position: {
    type: DataTypes.STRING,
  },
  availability: {
    type: DataTypes.JSON, // For storing hoursPerWeek, preferredDays, preferredTimes
  },
  mentorshipStyle: {
    type: DataTypes.STRING,
  },
  acceptingMentees: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  maxMentees: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
  },
  currentMenteeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rating: {
    type: DataTypes.FLOAT,
  },
  reviewCount: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'mentor_profiles',
  timestamps: true,
});

module.exports = MentorProfile;
