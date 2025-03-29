const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Event = require('./Event'); // Assuming Event model exists
const User = require('./User');   // Assuming User model exists

const EventRegistration = sequelize.define('EventRegistration', {
  eventId: {
    type: DataTypes.INTEGER, // Foreign key referencing the Event model
    references: {
      model: 'events', // Assuming 'events' table is used for the Event model
      key: 'id',
    },
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER, // Foreign key referencing the User model
    references: {
      model: 'users', // Assuming 'users' table is used for the User model
      key: 'id',
    },
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('registered', 'attended', 'cancelled'),
    defaultValue: 'registered',
    allowNull: false,
  },
  registrationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Default to the current date and time
  },
  feedback: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'event_registrations',
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Associations: Define the relationships between EventRegistration, Event, and User models
EventRegistration.belongsTo(Event, { foreignKey: 'eventId' });
EventRegistration.belongsTo(User, { foreignKey: 'userId' });

module.exports = EventRegistration;
