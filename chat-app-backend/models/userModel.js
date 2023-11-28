const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive:{
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true , versionKey: false}
);

const User = mongoose.model("User", userSchema);

module.exports = User;
