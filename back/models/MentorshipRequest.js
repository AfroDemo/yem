const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MentorshipRequest = sequelize.define(
    "MentorshipRequest",
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
          isIn: [["starter", "growth"]], // matches your frontend package types
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
      notes: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "mentorship_requests",
      timestamps: true,
    }
  );

  MentorshipRequest.associate = (models) => {
    MentorshipRequest.belongsTo(models.User, {
      foreignKey: "mentorId",
      as: "mentor",
    });
    MentorshipRequest.belongsTo(models.User, {
      foreignKey: "menteeId",
      as: "mentee",
    });
  };

  return MentorshipRequest;
};
