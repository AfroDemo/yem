module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("session_resources", {
      sessionId: {
        type: Sequelize.INTEGER,
        references: { model: "sessions", key: "id" },
        primaryKey: true,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      resourceId: {
        type: Sequelize.INTEGER,
        references: { model: "resources", key: "id" },
        primaryKey: true,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("session_resources");
  },
};
