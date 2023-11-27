const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//route           POST /api/chat/accessChat
//description     Create/ fetch One to One Chat
//access          Protected
const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.status(400).send({
      status: false,
      error: "UserId param not sent with request"
    });
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("lastMessage");

  isChat = await User.populate(isChat, {
    path: "lastMessage.messageSender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "messageSender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const chat = new Chat(chatData);
      const createdChat = await chat.save();
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400).send({
        status: false,
        error: error.message,
      });
    }
  }
}

//route           GET /api/chat/fetchChats
//description     Fetch all chats for user
//access          Protected
const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "lastMessage.messageSender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400).send({
      status: false,
      error: error.message,
    });
  }
}

//route           POST /api/chat/createGroupChat
//description     Create New Group Chat
//access          Protected
const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).send({
      status: false,
      error: error.message,
    });
  }
}

// route   PUT /api/chat/renameGroup
// description Rename Group
// access  Protected
const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).send({
      status: false,
      error: "Chat Not Found",
    });
  } else {
    res.json(updatedChat);
  }
}

// route   PUT /api/chat/removeFromGroup
// description    Remove user from the Group
// access  Protected
const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404).send({
      status: false,
      error: "Chat Not Found",
    });
  } else {
    res.json(removed);
  }
}

// route   PUT /api/chat/addToGroup
// description    Add user to Group / Leave
// access  Protected
const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404).send({
      status: false,
      error: "Chat Not Found",
    });
  } else {
    res.json(added);
  }
}

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
