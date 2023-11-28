const request = require("supertest");
const app = require("../server");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
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


const generateBearerToken = async (emailId, userPassword) => {
  try {
    console.log(emailId, userPassword);
    let email = emailId ? `${emailId}` : "kunaldeepreddy@gmail.com";
    let password = userPassword ? `${userPassword}` : "kunaldeepreddy";
    const response = await request(app)
      .post("/api/user/login")
      .send({
        email,
        password,
      })
    console.log("response.body ", response.body);

    const token = response?.body?.data?.token;
    return `Bearer ${token}`;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};

describe("Fetch Chats API", () => {
    it("should fetch user chats successfully", async () => {
      const userToken = await generateBearerToken();
      const testChat = {
        chatName: "messageSender",
        isGroupChat: false,
        users: [mongoose.Types.ObjectId("656352d4ab2a380ff0fd536a")],
      };
      //   console.log(userToken)
      //   const res1 = await request(app)
      //     .post('/api/chat/createChat')
      //     .set('Authorization', userToken)
      //     .send(testChat)
      //     .expect(200);
      //   console.log("res1 ",res1.body)
  
      const response = await request(app)
        .get("/api/chat/fetchChats")
        .set("Authorization", userToken)
        .expect(200);
  
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

describe("Access Chat API", () => {
  it("should access an existing chat successfully", async () => {
    const user1 = new User({
      name: "User 1",
      email: "user1@example.com",
      password: "password1",
      isActive: true,
    });
    const user2 = new User({
      name: "User 2",
      email: "user2@example.com",
      password: "password2",
      isActive: true,
    });
    await user1.save();
    await user2.save();

    const chatData = {
      chatName: "messageSender",
      isGroupChat: false,
      users: [user1._id, user2._id],
    };
    const chat = new Chat(chatData);
    await chat.save();
    const user1Token = await generateBearerToken(
      "user1@example.com",
      "password1"
    );
    console.log("user1Token ", user1Token);

    const response = await request(app)
      .post("/api/chat/accessChat")
      .set("Authorization", user1Token)
      .send({
        userId: user2._id,
      })
      .expect(200);

    expect(response.body).toHaveProperty("isGroupChat", false);
    expect(response.body.users).toHaveLength(2);
    expect(response.body.users[0]).toHaveProperty("name", "User 1");
    expect(response.body.users[1]).toHaveProperty("name", "User 2");
  });

  it("should create a new chat when no existing chat is found", async () => {
    const user1 = new User({
      name: "User 11",
      email: "user11@example.com",
      password: "password1",
      isActive: true,
    });
    await user1.save();

    const user1Token = await generateBearerToken(
      "user11@example.com",
      "password1"
    );
    const response = await request(app)
      .post("/api/chat/accessChat")
      .set("Authorization", user1Token)
      .send({
        userId: mongoose.Types.ObjectId(),
      })
      .expect(200);

    expect(response.body).toHaveProperty("isGroupChat", false);
    expect(response.body.users).toHaveLength(2);
    expect(response.body.users[0]).toHaveProperty("name", "User 1");
  });

  it("should handle errors when accessing chat", async () => {
    const userToken = await generateBearerToken();
    const response = await request(app)
      .post("/api/chat/accessChat")
      .set("Authorization", userToken)
      .expect(400);

    expect(response.body).toHaveProperty("status", false);
    expect(response.body).toHaveProperty(
      "error",
      "UserId param not sent with request"
    );
  });
});

describe('Create Group Chat API', () => {
    it('should create a group chat successfully', async () => {
      const testUser1 = {
        name: 'Test User 13',
        email: 'testuser13@example.com',
        password: 'testpassword1',
        isActive: true,
      };
  
      const testUser2 = {
        name: 'Test User 23',
        email: 'testuser23@example.com',
        password: 'testpassword2',
        isActive: true,
      };
  
      const user1Response = await request(app)
        .post('/api/user/signup')
        .send(testUser1)
        .expect(200);
  
      const user2Response = await request(app)
        .post('/api/user/signup')
        .send(testUser2)
        .expect(200);
  
      const user1Token = await generateBearerToken(testUser1.email, testUser1.password);
      const user2Token = await generateBearerToken(testUser2.email, testUser2.password);
  
      const response = await request(app)
        .post('/api/chat/createGroupChat')
        .set('Authorization', user1Token)
        .field('name', 'Test Group Chat')
        .field('users', JSON.stringify([user2Response.body.data._id]))
        .expect(200);
  
      expect(response.body).toHaveProperty('isGroupChat', true);
      expect(response.body.users).toHaveLength(2);
    });
  });

  describe('Rename Group API', () => {
    it('should rename a group chat successfully', async () => {

      const testUser = {
        name: 'Test User55',
        email: 'testuser55@example.com',
        password: 'testpassword',
        isActive: true,
      };
  
      const userResponse = await request(app)
        .post('/api/user/signup')
        .send(testUser)
        .expect(200);
  
      const userToken = await generateBearerToken(testUser.email, testUser.password);
      const createGroupResponse = await request(app)
        .post('/api/chat/createGroupChat')
        .set('Authorization', userToken)
        .field('name', 'Test Group Chat')
        .field('users', JSON.stringify([userResponse.body.data._id]))
        .expect(200);
  
      const chatId = createGroupResponse.body._id;
      const renameResponse = await request(app)
        .post('/api/chat/renameGroup')
        .set('Authorization', userToken)
        .send({
          chatId,
          chatName: 'Renamed Group Chat',
        })
        .expect(200);
      expect(renameResponse.body).toHaveProperty('chatName', 'Renamed Group Chat');
    });
  });

  describe('Remove From Group API', () => {
    it('should remove a user from a group chat successfully', async () => {
      const testUser = {
        name: 'Test User88',
        email: 'testuser88@example.com',
        password: 'testpassword',
        isActive: true,
      };
  
      const userResponse = await request(app)
        .post('/api/user/signup')
        .send(testUser)
        .expect(200);
  
      const userToken = await generateBearerToken(testUser.email, testUser.password);
  
      const createGroupResponse = await request(app)
        .post('/api/chat/createGroupChat')
        .set('Authorization', userToken)
        .field('name', 'Test Group Chat')
        .field('users', JSON.stringify([userResponse.body.data._id]))
        .expect(200);
  
      const chatId = createGroupResponse.body._id;
      const userToRemove = {
        name: 'User to Remove',
        email: 'user2@example.com',
        password: 'user2password',
        isActive: true,
      };
  
      const userToRemoveResponse = await request(app)
        .post('/api/user/signup')
        .send(userToRemove)
        .expect(200);
      await request(app)
        .post('/api/chat/addToGroup')
        .set('Authorization', userToken)
        .send({
          chatId,
          userId: userToRemoveResponse.body.data._id,
        })
        .expect(200);
      const removeResponse = await request(app)
        .post('/api/chat/removeFromGroup')
        .set('Authorization', userToken)
        .send({
          chatId,
          userId: userToRemoveResponse.body.data._id,
        })
        .expect(200);
      expect(removeResponse.body).toHaveProperty('users');
    });
  });

  describe('Add To Group API', () => {
    it('should add a user to a group successfully', async () => {

      const testUser = {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'testpassword',
        isActive: true,
      };
  
      const testChat = {
        chatName: 'Test Group',
        users: [], 
        isGroupChat: true,
        groupAdmin: null, 
      };

      const userResponse = await request(app)
        .post('/api/user/register')
        .send(testUser)
        .expect(201);
  
      const chatResponse = await request(app)
        .post('/api/chat/createGroupChat')
        .set('Authorization', await generateBearerToken(testUser.email, testUser.password))
        .send(testChat)
        .expect(200);
  
      const userIdToAdd = mongoose.Types.ObjectId();
      const chatId = chatResponse.body._id;
  
      const response = await request(app)
        .post('/api/chat/addToGroup')
        .set('Authorization', await generateBearerToken(testUser.email, testUser.password))
        .send({ chatId, userId: userIdToAdd })
        .expect(200);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('chatName', 'Test Group');
      expect(response.body.users).toContainEqual(userIdToAdd);
    });
  });