"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("conversations", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      participants: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      lastMessage: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
      unreadCount: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
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
    await queryInterface.dropTable("conversations");
  },
};
