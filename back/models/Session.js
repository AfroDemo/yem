const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Session = sequelize.define(
    "Session",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
      startTime: { type: DataTypes.DATE, allowNull: false },
      endTime: { type: DataTypes.DATE, allowNull: false },
      topic: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.ENUM("virtual", "in-person"), allowNull: false },
      agenda: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.ENUM(
          "upcoming",
          "in-progress",
          "completed",
          "cancelled"
        ),
        defaultValue: "upcoming",
        allowNull: false,
      },
    },
    { tableName: "sessions", timestamps: true }
  );

  Session.associate = function (models) {
    Session.belongsTo(models.User, { foreignKey: "mentorId", as: "mentor" });
    Session.belongsTo(models.User, { foreignKey: "menteeId", as: "mentee" });
  };

  return Session;
};
