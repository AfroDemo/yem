const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Mentorship = sequelize.define(
    "Mentorship",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mentorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      menteeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      packageType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["starter", "growth"]],
        },
      },
      status: {
        type: DataTypes.ENUM("pending", "active", "rejected", "completed"),
        defaultValue: "pending",
        allowNull: false,
      },
      goals: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      progress: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 100 },
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
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      meetingFrequency: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nextMeetingDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      feedback: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "mentorships",
      timestamps: true,
    }
  );

  Mentorship.associate = function (models) {
    Mentorship.belongsTo(models.User, { foreignKey: "mentorId", as: "mentor" });
    Mentorship.belongsTo(models.User, { foreignKey: "menteeId", as: "mentee" });
  };

  return Mentorship;
};
