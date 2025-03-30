"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mentor_profiles", {
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      expertise: {
        type: Sequelize.JSON, // For storing an array of strings (expertise)
        allowNull: false,
      },
      experience: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      company: {
        type: Sequelize.STRING,
      },
      position: {
        type: Sequelize.STRING,
      },
      availability: {
        type: Sequelize.JSON, // For storing hoursPerWeek, preferredDays, preferredTimes
      },
      mentorshipStyle: {
        type: Sequelize.STRING,
      },
      acceptingMentees: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      maxMentees: {
        type: Sequelize.INTEGER,
      },
      currentMentees: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      reviewCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("mentor_profiles");
  },
};
