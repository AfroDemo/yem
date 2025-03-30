const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User"); // Assuming User model exists

module.exports = (sequelize) => {
  const SuccessStory = sequelize.define(
    "SuccessStory",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      menteeId: {
        type: DataTypes.INTEGER, // Foreign key referencing the User model
        references: {
          model: "users", // Assuming 'users' table for the User model
          key: "id",
        },
      },
      mentorId: {
        type: DataTypes.INTEGER, // Foreign key referencing the User model
        references: {
          model: "users", // Assuming 'users' table for the User model
          key: "id",
        },
      },
      businessName: {
        type: DataTypes.STRING,
      },
      businessDescription: {
        type: DataTypes.STRING,
      },
      achievements: {
        type: DataTypes.JSON, // Storing an array of strings in JSON format
      },
      images: {
        type: DataTypes.JSON, // Storing an array of strings for image URLs
      },
      featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "success_stories",
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );
  SuccessStory.associate = (models) => {
    SuccessStory.belongsTo(models.User, {
      foreignKey: "menteeId",
      as: "mentee",
    });
    SuccessStory.belongsTo(models.User, {
      foreignKey: "mentorId",
      as: "mentor",
    });
  };
  return SuccessStory;
};
