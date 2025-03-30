"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("events", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM("workshop", "networking", "webinar", "conference"),
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      location: {
        type: Sequelize.JSON, 
        defaultValue: {},
      },
      host: {
        type: Sequelize.INTEGER, 
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      speakers: {
        type: Sequelize.JSON, 
        defaultValue: [],
      },
      maxAttendees: {
        type: Sequelize.INTEGER,
      },
      currentAttendees: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      registrationLink: {
        type: Sequelize.STRING,
      },
      registrationDeadline: {
        type: Sequelize.DATE,
      },
      registrationFee: {
        type: Sequelize.DECIMAL,
      },
      registrationCurrency: {
        type: Sequelize.STRING,
      },
      thumbnail: {
        type: Sequelize.STRING,
      },
      tags: {
        type: Sequelize.JSON,
        defaultValue: [],
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("events");
  },
};
