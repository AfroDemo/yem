'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("mentee_profiles", {
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    entrepreneurshipStage: {
      type: Sequelize.ENUM("idea", "startup", "growth"),
      allowNull: false,
    },
    businessIdea: {
      type: Sequelize.STRING,
    },
    goals: {
      type: Sequelize.JSON, // Store array of goals
    },
    challenges: {
      type: Sequelize.JSON, // Store array of challenges
    },
    preferredMentorExpertise: {
      type: Sequelize.JSON, // Store array of preferred mentor expertise
    },
    educationBackground: {
      type: Sequelize.STRING,
    },
    workExperience: {
      type: Sequelize.JSON, // Store array of work experience
    },
    skills: {
      type: Sequelize.JSON, // Store array of skills
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("mentee_profiles");
  }
};
