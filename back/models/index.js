"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Load all models automatically
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file)); // Just require it, no need to invoke
    if (model instanceof Sequelize.Model) {
      db[model.name] = model; // Save the model to db object
    }
  });

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Manual associations for models that need special handling
db.User.hasOne(db.MenteeProfile, { foreignKey: "userId", as: "menteeProfile" });
db.User.hasOne(db.MentorProfile, { foreignKey: "userId", as: "mentorProfile" });
db.Event.belongsTo(db.User, { foreignKey: "hostId", as: "eventHost" });
db.User.hasMany(db.EventRegistration, {
  foreignKey: "userId",
  as: "eventRegistrations",
});
db.User.hasMany(db.Message, { foreignKey: "senderId", as: "sentMessages" });
db.User.hasMany(db.Message, {
  foreignKey: "receiverId",
  as: "receivedMessages",
});
db.User.hasMany(db.Resource, {
  foreignKey: "createdById",
  as: "createdResources",
});
db.User.hasMany(db.SuccessStory, {
  foreignKey: "menteeId",
  as: "menteeSuccessStories",
});
db.User.hasMany(db.SuccessStory, {
  foreignKey: "mentorId",
  as: "mentorSuccessStories",
});

db.Event.hasMany(db.EventRegistration, {
  foreignKey: "eventId",
  as: "registrations",
});
db.Event.belongsTo(db.User, { foreignKey: "hostId", as: "host" });

db.Mentorship.belongsTo(db.User, { foreignKey: "mentorId", as: "mentor" });
db.Mentorship.belongsTo(db.User, { foreignKey: "menteeId", as: "mentee" });
db.Mentorship.hasMany(db.MentorshipProgress, {
  foreignKey: "mentorshipId",
  as: "progressNotes",
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
