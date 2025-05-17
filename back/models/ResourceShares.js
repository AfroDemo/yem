const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ResourceShares = sequelize.define(
    "ResourceShares",
    {
      resourceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: "Resources", key: "id" },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: "Users", key: "id" },
      },
    },
    {
      tableName: "resourceshares",
      timestamps: true,
    }
  );

  return ResourceShares;
};
