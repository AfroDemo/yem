const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Message = sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "conversations", key: "id" },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "messages",
      timestamps: true,
    }
  );

  Message.associate = function (models) {
    Message.belongsTo(models.User, { foreignKey: "senderId", as: "sender" });
    Message.belongsTo(models.User, {
      foreignKey: "receiverId",
      as: "receiver",
    });
    Message.belongsTo(models.Conversation, {
      foreignKey: "conversationId",
      as: "conversation",
    });
  };

  return Message;
};
