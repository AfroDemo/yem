const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Conversation = sequelize.define(
    "Conversation",
    {
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
        defaultValue: {},
      },
    },
    {
      tableName: "conversations",
      timestamps: true,
    }
  );

  Conversation.associate = (models) => {
    Conversation.hasMany(models.Message, {
      foreignKey: "conversationId",
      as: "messages",
    });
  };

  return Conversation;
};
