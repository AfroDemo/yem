const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth"); // Fixed: Use destructuring import
const { body } = require("express-validator");

// Correct way to import controller methods
const conversationController = require("../controllers/conversationController");

// Validation middleware
const createConversationValidation = [
  body("participantId").isInt().withMessage("Valid participant ID is required"),
];

const sendMessageValidation = [
  body("conversationId")
    .isInt()
    .withMessage("Valid conversation ID is required"),
  body("content").trim().notEmpty().withMessage("Message content is required"),
];

router.post(
  "/",
  auth,
  createConversationValidation,
  conversationController.getOrCreateConversation
);

router.post(
  "/message",
  auth,
  sendMessageValidation,
  conversationController.sendMessage
);

router.get("/", auth, conversationController.getConversations);

router.get(
  "/:conversationId/messages",
  auth,
  conversationController.getMessages
);

router.delete(
  "/:conversationId",
  auth,
  conversationController.deleteConversation
);

module.exports = router;
