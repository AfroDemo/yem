const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mentorship_requests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      mentorId: {
        type: DataTypes.INTEGER,
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
      packageType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "accepted", "rejected", "completed"),
        defaultValue: "pending",
        allowNull: false,
      },
      goals: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      progress: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      background: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      expectations: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      availability: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      timezone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
      },
      endDate: {
        type: Sequelize.DATE,
      },
      meetingFrequency: {
        type: Sequelize.STRING,
      },
      nextMeetingDate: {
        type: DataTypes.DATE,
      },
      feedback: {
        type: DataTypes.JSON,
      },
      notes: {
        type: Sequelize.TEXT,
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

    // Add composite index to prevent duplicate requests
    await queryInterface.addIndex("mentorship_requests", {
      fields: ["mentorId", "menteeId"],
      unique: true,
      where: {
        status: "pending",
      },
      name: "mentorship_requests_mentor_mentee_unique",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("mentorship_requests");
  },
};
