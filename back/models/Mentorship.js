const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User"); // Assuming User model exists

module.exports = (sequelize) => {
  const Mentorship = sequelize.define(
    "Mentorship",
    {
      mentorId: {
        type: DataTypes.INTEGER, // Foreign key referencing the User model (mentor)
        references: {
          model: "users", // Assuming 'users' table is used for the User model
          key: "id",
        },
        allowNull: false,
      },
      menteeId: {
        type: DataTypes.INTEGER, // Foreign key referencing the User model (mentee)
        references: {
          model: "users", // Assuming 'users' table is used for the User model
          key: "id",
        },
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "active", "completed", "rejected"),
        defaultValue: "pending",
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
      },
      endDate: {
        type: DataTypes.DATE,
      },
      goals: {
        type: DataTypes.JSON, // Storing goals as a JSON array
      },
      progress: {
        type: DataTypes.JSON, // Storing progress as a JSON array
      },
      meetingFrequency: {
        type: DataTypes.STRING,
      },
      nextMeetingDate: {
        type: DataTypes.DATE,
      },
      feedback: {
        type: DataTypes.JSON, // Storing feedback as a JSON object
      },
    },
    {
      tableName: "mentorships",
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );
  Mentorship.associate = (models) => {
    Mentorship.belongsTo(models.User, {
      foreignKey: "mentorId",
      as: "mentor",
    });
    Mentorship.belongsTo(models.User, {
      foreignKey: "menteeId",
      as: "mentee",
    });
  };
  return Mentorship;
};
