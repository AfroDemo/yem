"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("resources", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.STRING,
      },
      fileUrl: {
        type: Sequelize.STRING,
      },
      externalUrl: {
        type: Sequelize.STRING,
      },
      thumbnail: {
        type: Sequelize.STRING,
      },
      author: {
        type: Sequelize.STRING,
      },
      tags: {
        type: Sequelize.JSON,
      },
      visibility: {
        type: Sequelize.ENUM("public", "mentors", "mentees", "private"),
        defaultValue: "public",
        allowNull: false,
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
    await queryInterface.dropTable("resources");
  },
};
