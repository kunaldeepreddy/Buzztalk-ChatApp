const express = require("express");
const {
  allMessages,
  sendMessage,
  reactToMessage
} = require("../controllers/messageControllers");
const { isAuthenticated } = require("../utils/AuthUtil");
const asyncHandler = require("express-async-handler");

const router = express.Router();

router.get("/allMessages/:chatId", isAuthenticated, asyncHandler(allMessages));
router.post("/sendMessage", isAuthenticated, asyncHandler(sendMessage));
router.post("/reactToMessage", isAuthenticated, asyncHandler(reactToMessage));

module.exports = router;
