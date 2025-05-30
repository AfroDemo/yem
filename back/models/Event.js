const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Event = sequelize.define(
    "Event",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("workshop", "networking", "webinar", "conference"),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.JSON, // Store location as a JSON object
        defaultValue: {},
      },
      host: {
        type: DataTypes.INTEGER, // Foreign key referencing the User model
        references: {
          model: "users", // Assuming 'users' table is used for User model
          key: "id",
        },
      },
      speakers: {
        type: DataTypes.JSON, // Store speaker details as a JSON object
        defaultValue: [],
      },
      maxAttendees: {
        type: DataTypes.INTEGER,
      },
      currentAttendees: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      registrationDeadline: {
        type: DataTypes.DATE,
      },
      thumbnail: {
        type: DataTypes.STRING,
      },
      tags: {
        type: DataTypes.JSON, // Store tags as a JSON array
        defaultValue: [],
      },
    },
    {
      tableName: "events",
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );

  Event.associate = (models) => {
    Event.belongsTo(models.User, {
      foreignKey: "host",
      onDelete: "CASCADE",
    });
  };

  return Event;
};
