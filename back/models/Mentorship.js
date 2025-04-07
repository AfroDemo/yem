const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User"); // Assuming User model exists

module.exports = (sequelize) => {
  const Mentorship = sequelize.define(
    "Mentorship",
    {
      mentorId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      menteeId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      packageType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["starter", "growth"]],
        },
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected", "completed"),
        defaultValue: "pending",
        allowNull: false,
      },
      goals: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      progress: {
        type: DataTypes.JSON, // Storing progress as a JSON array
      },
      background: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      expectations: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      availability: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["weekdays", "evenings", "weekends", "flexible"]],
        },
      },
      timezone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
      },
      endDate: {
        type: DataTypes.DATE,
      },
      meetingFrequency: {
        type: DataTypes.STRING,
      },
      nextMeetingDate: {
        type: DataTypes.DATE,
      },
      feedback: {
        type: DataTypes.JSON,
      },
      notes: {
        type: DataTypes.TEXT,
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
