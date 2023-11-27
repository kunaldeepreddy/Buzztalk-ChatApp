const express = require("express");
const asyncHandler = require("express-async-handler");
const {
  getAllUsers,
  registerUser,
  activateOrDeactivateUser,
  signUp,
  login,
  searchUsers,
} = require("../controllers/userControllers");
const { isAuthenticated, validateAdmin } = require("../utils/AuthUtil");

const router = express.Router();

router.get("/searchUsers", isAuthenticated, asyncHandler(searchUsers));
router.post("/register", asyncHandler(registerUser));
router.post("/activateOrDeactivateUser", isAuthenticated, validateAdmin, asyncHandler(activateOrDeactivateUser));
router.get("/getAllUsers", isAuthenticated, validateAdmin, asyncHandler(getAllUsers));
router.post("/signUp", asyncHandler(signUp));
router.post("/login", asyncHandler(login));


module.exports = router;
