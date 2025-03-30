"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM("mentee", "mentor", "admin"),
        allowNull: false,
      },
      profileImage: {
        type: Sequelize.STRING,
      },
      bio: {
        type: Sequelize.STRING,
      },
      skills: {
        type: Sequelize.JSON,
      },
      interests: {
        type: Sequelize.JSON,
      },
      location: {
        type: Sequelize.STRING,
      },
      socialLinks: {
        type: Sequelize.JSON,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.dropTable("users");
  },
};
