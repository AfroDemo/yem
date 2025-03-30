"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mentorships", {
      mentorId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      menteeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "active", "completed", "rejected"),
        defaultValue: "pending",
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
      },
      endDate: {
        type: Sequelize.DATE,
      },
      goals: {
        type: Sequelize.JSON, // Store array of goals
      },
      progress: {
        type: Sequelize.JSON, // Store array of challenges
      },
      meetingFrequency: {
        type: Sequelize.STRING,
      },
      nextMeetingDate: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("mentorships");
  },
};
