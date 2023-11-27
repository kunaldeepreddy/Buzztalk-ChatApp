const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
