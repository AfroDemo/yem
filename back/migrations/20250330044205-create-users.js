"use strict";

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("mentee", "mentor", "admin"),
        allowNull: false,
      },
      profileImage: {
        type: DataTypes.STRING,
      },
      bio: {
        type: DataTypes.STRING,
      },
      skills: {
        type: DataTypes.JSON,
      },
      interests: {
        type: DataTypes.JSON,
      },
      location: {
        type: DataTypes.STRING,
      },
      socialLinks: {
        type: DataTypes.JSON,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      industries: {
        type: DataTypes.JSON,
        allowNull:true
      },
      businessStage:{
        type: DataTypes.JSON,
        allowNull:true
      },
      preferredBusinessStages: {
        type: DataTypes.JSON,
        allowNull: true
      },
      experienceYears: {
        type: DataTypes.STRING,
        allowNull: true
      },
      availability: {
        type: DataTypes.STRING,
        allowNull: true
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
    await queryInterface.dropTable("users");
  },
};
