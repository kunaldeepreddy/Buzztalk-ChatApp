const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//route           POST /api/Message/sendMessage
//description     Create New Message
//access          Protected
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(400).send({
      status: false,
      error: "Invalid data passed into request",
    });
  }

  let chatRes = await Chat.findById(req.body.chatId);
  if(!chatRes) {
    return res.status(400).send({
      status: false,
      error: "Invalid data passed into request",
    });
  }

  var newMessage = {
    messageSender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message
      .populate("messageSender", "name")
      .execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { lastMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400).send({
      status: false,
      error: error.message,
    });
  }
};

//route           POST /api/Message/reactToMessage
//description     Create New Message
//access          Protected
const reactToMessage = async (req, res) => {
  try {
    const { emoji, messageId } = req.body;

    if (!emoji || !messageId) {
      console.log("Invalid data passed into request");
      return res.status(400).send({
        status: false,
        error: "Invalid data passed into request",
      });
    }

    const messageRes = await Message.findById(messageId);
    console.log(messageRes);
    if (!messageRes) {
      return res.status(400).send({
        status: false,
        error: "no such message found",
      });
    }
    let newReactions = [];
    if (!messageRes.reactions || messageRes?.reactions?.length == 0) {
      newReactions = [
        {
          emoji: emoji,
          count: 1,
        },
      ];
    } else {
      newReactions = messageRes.reactions;
      let emojiIndex = newReactions.findIndex((item) => {
        return item.emoji == emoji;
      });
      console.log(emojiIndex);
      if (emojiIndex != -1) {
        newReactions[emojiIndex].count += 1;
      } else {
        let ob = {
          emoji: emoji,
          count: 1,
        };
        newReactions.push(ob);
      }
    }
    console.log(newReactions);

    let updatedMessage = await Message.findByIdAndUpdate(
      req.body.messageId,
      { reactions: newReactions },
      { new: true }
    )
      .populate("messageSender", "name email")
      .populate("chat");
      updatedMessage = await User.populate(updatedMessage, {
        path: "chat.users",
        select: "name email",
      });
    console.log(updatedMessage);
    if (!updatedMessage) {
      res.status(400).send({
        status: false,
        error: "message update failed",
      });
    } else {
      res.json(updatedMessage);
    }
  } catch (error) {
    res.status(400).send({
      status: false,
      error: error.message,
    });
  }
};

//route           GET /api/allMessages/:chatId
//description     Get all Messages
//access          Protected
const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("messageSender", "name email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400).send({
      status: false,
      error: error.message,
    });
  }
};

module.exports = { allMessages, sendMessage, reactToMessage };
