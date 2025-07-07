// routes/home.js
const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

// Get homepage data
router.get("/", homeController.getHomePageData);

module.exports = router;