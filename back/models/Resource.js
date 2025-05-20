const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Resource = sequelize.define(
    "Resource",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdById: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fileUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      publishDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      isDraft: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "resources",
      timestamps: true,
    }
  );

  Resource.associate = function (models) {
    Resource.belongsTo(models.User, {
      foreignKey: "createdById",
      as: "creator",
    });
    Resource.belongsToMany(models.User, {
      through: "ResourceShares",
      foreignKey: "resourceId",
      otherKey: "userId",
      as: "sharedWith",
    });
    Resource.belongsToMany(models.Session, {
      through: "session_resources",
      foreignKey: "resourceId",
      otherKey: "sessionId",
    });
  };

  return Resource;
};
