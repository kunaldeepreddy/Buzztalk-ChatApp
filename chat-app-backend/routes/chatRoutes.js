const express = require("express");
const {
  addToGroup,
  renameGroup,
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
} = require("../controllers/chatControllers");
const asyncHandler = require("express-async-handler");
const { isAuthenticated } = require("../utils/AuthUtil");

const router = express.Router();

router.put("/addToGroup", isAuthenticated, asyncHandler(addToGroup));
router.put("/removeFromGroup", isAuthenticated, asyncHandler(removeFromGroup));
router.post("/accessChat", isAuthenticated, asyncHandler(accessChat));
router.get("/fetchChats", isAuthenticated, asyncHandler(fetchChats));
router.post("/createGroupChat", isAuthenticated, asyncHandler(createGroupChat));
router.put("/rename", isAuthenticated, asyncHandler(renameGroup));



module.exports = router;
