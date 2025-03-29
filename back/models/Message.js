const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User'); // Assuming User model exists

const Message = sequelize.define('Message', {
  senderId: {
    type: DataTypes.INTEGER, // Foreign key referencing the User model (sender)
    references: {
      model: 'users', // Assuming 'users' table is used for the User model
      key: 'id',
    },
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.INTEGER, // Foreign key referencing the User model (receiver)
    references: {
      model: 'users', // Assuming 'users' table is used for the User model
      key: 'id',
    },
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'messages',
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Associations: Define the relationships between Message and User models
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

module.exports = Message;
