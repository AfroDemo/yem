const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

module.exports = (sequelize) => {
  const MenteeProfile = sequelize.define(
    "MenteeProfile",
    {
      userId: {
        type: DataTypes.INTEGER, // Foreign key reference to users table
        allowNull: false,
        references: {
          model: "users", // Assuming the users table has the name 'users'
          key: "id",
        },
      },
      entrepreneurshipStage: {
        type: DataTypes.ENUM("idea", "startup", "growth"),
        allowNull: false,
      },
      businessIdea: {
        type: DataTypes.STRING,
      },
      goals: {
        type: DataTypes.JSON, // Store array of goals
      },
      challenges: {
        type: DataTypes.JSON, // Store array of challenges
      },
      preferredMentorExpertise: {
        type: DataTypes.JSON, // Store array of preferred mentor expertise
      },
      educationBackground: {
        type: DataTypes.STRING,
      },
      workExperience: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "mentee_profiles",
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );
  MenteeProfile.associate = (models) => {
    MenteeProfile.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };
  return MenteeProfile;
};
