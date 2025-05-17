"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mentorships", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mentorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      menteeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      packageType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected", "completed"),
        allowNull: false,
        defaultValue: "pending",
      },
      goals: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      progress: {
        type: DataTypes.JSON,
        allowNull: true,
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("mentorships");
  },
};
