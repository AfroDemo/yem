"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sessions", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      mentorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      menteeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      startTime: { type: Sequelize.DATE, allowNull: false },
      endTime: { type: Sequelize.DATE, allowNull: false },
      topic: { type: Sequelize.STRING, allowNull: false },
      type: {
        type: Sequelize.ENUM("virtual", "in-person"),
        allowNull: false,
      },
      agenda: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM(
          "upcoming",
          "in-progress",
          "completed",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "upcoming",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("sessions");
  },
};
