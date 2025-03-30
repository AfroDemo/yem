"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("conversations", {
      participants: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      lastMessage: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
      },
      unreadCount: {
        type: Sequelize.JSON,
        defaultValue: {},
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("conversations");
  },
};
