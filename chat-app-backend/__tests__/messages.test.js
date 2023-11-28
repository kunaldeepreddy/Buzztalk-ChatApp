const request = require("supertest");
const app = require("../server");
const Message = require("../models/messageModel");
const mongoose = require("mongoose");
const AuthUtil = require("../utils/AuthUtil");

afterAll(async () => {
  await mongoose.connection.close();
  await new Promise((resolve) => {
    app.close(() => {
      console.log("Server closed");
      resolve();
    });
  });
});

const createTestChat = () => {
  return { _id: "6565e32c8696525c686c81da" };
};

const generateBearerToken = async (email, password) => {
  console.log(email, password);
  const response = await request(app)
    .post("/api/user/login")
    .send({
      email: email || "kunaldeepreddy@gmail.com",
      password: password || "kunaldeepreddy",
    })
    .expect(200);
  console.log(response.body);

  const token = response?.body?.data?.token;
  return `Bearer ${token}`;
};

describe("Send Message API", () => {
  let userToken, chat;

  beforeAll(async () => {
    userToken = await generateBearerToken();
    chat = await createTestChat();
  });

  it("should send a message successfully", async () => {
    const response = await request(app)
      .post("/api/message/sendMessage")
      .set("Authorization", userToken)
      .send({
        content: "Test message",
        chatId: chat._id,
      })
      .expect(200);

    expect(response.body).toHaveProperty("content", "Test message");
    expect(response.body).toHaveProperty("messageSender");
    expect(response.body).toHaveProperty("chat");
    expect(response.body.chat).toHaveProperty("_id", chat._id.toString());
  });

  it("should handle missing content in the request", async () => {
    const response = await request(app)
      .post("/api/message/sendMessage")
      .set("Authorization", userToken)
      .send({
        chatId: chat._id,
      })
      .expect(400);

    expect(response.body).toHaveProperty("status", false);
    expect(response.body).toHaveProperty(
      "error",
      "Invalid data passed into request"
    );
  });

  it("should handle missing chatId in the request", async () => {
    const response = await request(app)
      .post("/api/message/sendMessage")
      .set("Authorization", userToken)
      .send({
        content: "Test message",
      })
      .expect(400);

    expect(response.body).toHaveProperty("status", false);
    expect(response.body).toHaveProperty(
      "error",
      "Invalid data passed into request"
    );
  });

  it("should handle non-existent chatId in the request", async () => {
    const response = await request(app)
      .post("/api/message/sendMessage")
      .set("Authorization", userToken)
      .send({
        content: "Test message",
        chatId: "6565e5cf3b6383dcfe875077",
      })
      .expect(400);

    expect(response.body).toHaveProperty("status", false);
    expect(response.body).toHaveProperty(
      "error",
      "Invalid data passed into request"
    );
  });
});

describe("React to Message API", () => {
  it("should react to a message successfully", async () => {
    const testMessage = new Message({
      content: "Test message content",
    });
    const savedMessage = await testMessage.save();

    const reactionData = {
      emoji: "👍",
      messageId: "656380d1fc86ef06fc533805",
    };

    const response = await request(app)
      .post("/api/message/reactToMessage")
      .set("Authorization", await generateBearerToken())
      .send(reactionData)
      .expect(200);

    expect(response.body).toHaveProperty("reactions");
    expect(response.body.reactions).toHaveLength(1);
    expect(response.body.reactions[0]).toHaveProperty(
      "emoji",
      reactionData.emoji
    );
    expect(response.body.reactions[0].count).toBeGreaterThan(1);
  });

  it("should handle invalid data in the request", async () => {
    const invalidReactionData = {
      // Missing required fields
    };

    const response = await request(app)
      .post("/api/message/reactToMessage")
      .set("Authorization", await generateBearerToken())
      .send(invalidReactionData)
      .expect(400);

    expect(response.body).toHaveProperty("status", false);
    expect(response.body).toHaveProperty(
      "error",
      "Invalid data passed into request"
    );
  });

  it("should handle a non-existent message", async () => {
    const nonExistentMessageReactionData = {
      emoji: "😢",
      messageId: "6565e5cf3b6383dcfe875077",
    };

    const response = await request(app)
      .post("/api/message/reactToMessage")
      .set("Authorization", await generateBearerToken())
      .send(nonExistentMessageReactionData)
      .expect(400);

    expect(response.body).toHaveProperty("status", false);
    expect(response.body).toHaveProperty("error", "no such message found");
  });
});

describe("All Messages API", () => {
  let userToken, chat;

  beforeAll(async () => {
    userToken = await generateBearerToken();
    chat = await createTestChat();
  });
  it("should retrieve all messages for a chat successfully", async () => {
    const testMessage1 = new Message({
      content: "Test message 1",
      chat: chat._id,
    });
    const testMessage2 = new Message({
      content: "Test message 2",
      chat: chat._id,
    });
    await testMessage1.save();
    await testMessage2.save();

    const response = await request(app)
      .get(`/api/message/allMessages/${chat._id}`)
      .set("Authorization", userToken)
      .expect(200);

    expect(response.body.length).toBeGreaterThanOrEqual(2);
    expect(response.body[response.body.length-2]).toHaveProperty("content", "Test message 1");
    expect(response.body[response.body.length-1]).toHaveProperty("content", "Test message 2");
  });

  it("should handle errors when retrieving messages", async () => {
    const invalidChatId = "invalidchatid";

    const response = await request(app)
      .get(`/api/message/allMessages/${invalidChatId}`)
      .set("Authorization", userToken)
      .expect(400);

    expect(response.body).toHaveProperty("status", false);
    expect(response.body).toHaveProperty("error");
  });
});
