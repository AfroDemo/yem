const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Report = sequelize.define(
    "Report",
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
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "submitted", "reviewed"),
        allowNull: false,
        defaultValue: "pending",
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "reports",
      timestamps: true,
    }
  );

  Report.associate = function (models) {
    Report.belongsTo(models.User, { foreignKey: "mentorId", as: "mentor" });
    Report.belongsTo(models.User, { foreignKey: "menteeId", as: "mentee" });
  };

  return Report;
};
