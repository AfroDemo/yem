const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("mentee", "mentor", "admin"),
        defaultValue: "mentee",
        allowNull: false,
      },
      profileImage: {
        type: DataTypes.STRING,
      },
      bio: {
        type: DataTypes.STRING,
      },
      skills: {
        type: DataTypes.JSON,
      },
      interests: {
        type: DataTypes.JSON,
      },
      location: {
        type: DataTypes.STRING,
      },
      socialLinks: {
        type: DataTypes.JSON,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      industries: { type: DataTypes.JSON },
      businessStage: { type: DataTypes.STRING },
      preferredBusinessStages: { type: DataTypes.JSON },
      experienceYears: { type: DataTypes.STRING },
      availability: { type: DataTypes.STRING },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );

  User.associate = function (models) {
    User.hasOne(models.MenteeProfile, {
      foreignKey: "userId",
      as: "menteeProfile",
    });
    User.hasOne(models.MentorProfile, {
      foreignKey: "userId",
      as: "mentorProfile",
    });
    User.hasMany(models.Event, { foreignKey: "hostId", as: "hostedEvents" });
    User.hasMany(models.EventRegistration, {
      foreignKey: "userId",
      as: "eventRegistrations",
    });
    User.hasMany(models.Message, {
      foreignKey: "senderId",
      as: "sentMessages",
    });
    User.hasMany(models.Message, {
      foreignKey: "receiverId",
      as: "receivedMessages",
    });
    User.hasMany(models.Resource, {
      foreignKey: "createdById",
      as: "createdResources",
    });
    User.hasMany(models.SuccessStory, {
      foreignKey: "menteeId",
      as: "menteeSuccessStories",
    });
    User.hasMany(models.SuccessStory, {
      foreignKey: "mentorId",
      as: "mentorSuccessStories",
    });
  };

  User.toString=()=>'User'

  return User;
};
