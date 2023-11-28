// const request = require('supertest');
// const app = require('../server');
// const User = require('../models/userModel');
// const mongoose = require('mongoose');
// const AuthUtil = require('../utils/AuthUtil'); 

// const generateBearerToken = async (email, password) => {
//   console.log(email, password)
//   const response = await request(app)
//       .post('/api/user/login')
//       .send({
//         email: email || 'kunaldeepreddy@gmail.com',
//         password: password || "kunaldeepreddy",
//       })
//       .expect(200);
//   console.log(response.body);

//   const token = response?.body?.data?.token;
//   return `Bearer ${token}`;
// };

// afterAll(async () => {
//   await mongoose.connection.close();
// });

// afterAll((done) => {
//   app.close(() => {
//     console.log("Server closed");
//     done();
//   });
// }, 10000);

// // describe('Register User API', () => {
// //   it('should register a new user', async () => {
// //     const userData = {
// //       name: 'Test User',
// //       email: 'test@example.com',
// //       password: 'testpassword',
// //     };

// //     const response = await request(app)
// //       .post('/api/user/register') 
// //       .send(userData)
// //       .expect(200);

// //     expect(response.body).toHaveProperty('_id');
// //     expect(response.body).toHaveProperty('name', userData.name);
// //     expect(response.body).toHaveProperty('email', userData.email);
// //     expect(response.body).toHaveProperty('token');
// //   });

// //   it('should handle validation errors', async () => {
// //     const invalidUserData = {
// //       // Missing required fields
// //     };

// //     const response = await request(app)
// //       .post('/api/user/register') 
// //       .send(invalidUserData)
// //       .expect(400);

// //     expect(response.body).toHaveProperty('error', 'Please Enter all the Fields');
// //   });

// //   it('should handle existing user', async () => {
// //     const existingUser = new User({
// //       name: 'Existing User',
// //       email: 'existing@example.com',
// //       password: 'existingpassword',
// //     });
// //     await existingUser.save();

// //     const duplicateResponse = await request(app)
// //       .post('/api/user/register') 
// //       .send({
// //         name: 'Duplicate User',
// //         email: 'existing@example.com',
// //         password: 'duplicatepassword',
// //       })
// //       .expect(400);
// //     expect(duplicateResponse.body).toHaveProperty('error', 'User already exists');
// //   });
// // });

// describe('Sign Up API', () => {
//   it('should sign up a new user successfully', async () => {
//     const userData = {
//       name: 'Test User',
//       email: 'test@example.com',
//       password: 'testpassword',
//     };

//     const response = await request(app)
//       .post('/api/user/signup')
//       .send(userData)
//       .expect(200);

//     expect(response.body).toHaveProperty('status', true);
//     expect(response.body).toHaveProperty('message', 'registered successfully, we will let the admin know about this.');
//     expect(response.body).toHaveProperty('data');
//     expect(response.body.data).toHaveProperty('_id');
//     expect(response.body.data).toHaveProperty('name', userData.name);
//     expect(response.body.data).toHaveProperty('email', userData.email);
//     expect(response.body.data).toHaveProperty('isAdmin', false);
//     expect(response.body.data).toHaveProperty('isActive', false);
//   });

//   it('should handle validation errors', async () => {
//     const invalidUserData = {
//       // Missing required fields
//     };

//     const response = await request(app)
//       .post('/api/user/signup')
//       .send(invalidUserData)
//       .expect(400);

//     expect(response.body).toHaveProperty('status', false);
//     expect(response.body).toHaveProperty('error', 'Please Enter all the Fields');
//   });

//   it('should handle existing user', async () => {
//     const existingUser = new User({
//       name: 'Existing User',
//       email: 'existing@example.com',
//       password: 'existingpassword',
//     });
//     await existingUser.save();

//     const duplicateResponse = await request(app)
//       .post('/api/user/signup')
//       .send({
//         name: 'Duplicate User',
//         email: 'existing@example.com',
//         password: 'duplicatepassword',
//       })
//       .expect(400);

//     expect(duplicateResponse.body).toHaveProperty('status', false);
//     expect(duplicateResponse.body).toHaveProperty('error', 'User already exists');
//   });

//   it('should handle invalid email format', async () => {
//     const invalidEmailData = {
//       name: 'Invalid Email User',
//       email: 'invalidemail', 
//       password: 'invalidpassword',
//     };

//     const response = await request(app)
//       .post('/api/user/signup')
//       .send(invalidEmailData)
//       .expect(200);

//     expect(response.body).toHaveProperty('status', false);
//     expect(response.body).toHaveProperty('error', 'Invalid mailId');
//   });
// });

// describe('Login API', () => {
//   it('should login a user successfully', async () => {
//     const password = 'sirisree';
//     const hashedPassword = AuthUtil.getHashedPassword(password);

//     const existingUser = new User({
//       name: 'siri sree',
//       email: 'sirisree@example.com',
//       password: hashedPassword,
//       isActive: true,
//     });
//     await existingUser.save();

//     const response = await request(app)
//       .post('/api/user/login')
//       .send({
//         email: 'sirisree@example.com',
//         password: 'sirisree',
//       })
//       .expect(200);

//     expect(response.body).toHaveProperty('status', true);
//     expect(response.body).toHaveProperty('message', 'success');
//     expect(response.body).toHaveProperty('data');
//     expect(response.body.data).toHaveProperty('token');
//   });

//   it('should handle incorrect password', async () => {
//     const password = 'siriA';
//     const hashedPassword = AuthUtil.getHashedPassword(password);

//     const existingUser = new User({
//       name: 'siri A',
//       email: 'siriA@example.com',
//       password: hashedPassword,
//       isActive: true,
//     });
//     await existingUser.save();

//     const response = await request(app)
//       .post('/api/user/login')
//       .send({
//         email: 'siriA@example.com',
//         password: 'sirisree',
//       })
//       .expect(400);

//     expect(response.body).toHaveProperty('status', false);
//     expect(response.body).toHaveProperty('message', 'incorrect password');
//   });

//   it('should handle inactive user', async () => {
//     const password = 'testpassword';
//     const hashedPassword = AuthUtil.getHashedPassword(password);

//     const inactiveUser = new User({
//       name: 'Inactive User',
//       email: 'inactive@example.com',
//       password: hashedPassword,
//       isActive: false,
//     });
//     await inactiveUser.save();

//     const response = await request(app)
//       .post('/api/user/login')
//       .send({
//         email: 'inactive@example.com',
//         password: 'testpassword',
//       })
//       .expect(400);

//     expect(response.body).toHaveProperty('status', false);
//     expect(response.body).toHaveProperty('message', 'Account Inactive/Blocked. Please Contact Admin');
//   });

//   it('should handle user not found', async () => {
//     const response = await request(app)
//       .post('/api/user/login')
//       .send({
//         email: 'nonexistent@example.com',
//         password: 'testpassword',
//       })
//       .expect(400);

//     expect(response.body).toHaveProperty('status', false);
//     expect(response.body).toHaveProperty('message', 'Invalid Email or Password');
//   });

//   it('should handle invalid email or password', async () => {
//     const response = await request(app)
//       .post('/api/user/login')
//       .send({
//         email: 'test@example.com',
//         password: 'invalidpassword',
//       })
//       .expect(400);

//     expect(response.body).toHaveProperty('status', false);
//     expect(response.body).toHaveProperty('message', 'Invalid Email or Password');
//   });
// });

// describe('Activate or Deactivate User API', () => {
//   it('should activate a user successfully', async () => {
//     const existingUser = new User({
//       name: 'AD Test User1',
//       email: 'ADtest1@example.com',
//       password: 'ADtestpassword1',
//       isActive: false,
//     });
//     await existingUser.save();

//     const response = await request(app)
//       .post('/api/user/activateOrDeactivateUser')
//       .set('Authorization', await generateBearerToken())
//       .send({
//         email: 'ADtest1@example.com',
//         isActive: true,
//       })
//       .expect(200);

//     expect(response.body).toHaveProperty('status', true);
//     expect(response.body).toHaveProperty('message', 'user activated successfully');
//     expect(response.body).toHaveProperty('data');
//     expect(response.body.data).toHaveProperty('_id');
//   });

//   it('should deactivate a user successfully', async () => {
//     const existingUser = new User({
//       name: 'AD Test User2',
//       email: 'ADtest2@example.com',
//       password: 'ADtestpassword2',
//       isActive: true,
//     });
//     await existingUser.save();

//     const response = await request(app)
//       .post('/api/user/activateOrDeactivateUser')
//       .set('Authorization', await generateBearerToken())
//       .send({
//         email: 'ADtest1@example.com',
//         isActive: false,
//       })
//       .expect(200);

//     expect(response.body).toHaveProperty('status', true);
//     expect(response.body).toHaveProperty('message', 'user deactivated successfully');
//     expect(response.body).toHaveProperty('data');
//     expect(response.body.data).toHaveProperty('_id');
//   });

//   it('should handle invalid isActive value', async () => {
//     const response = await request(app)
//       .post('/api/user/activateOrDeactivateUser')
//       .set('Authorization', await generateBearerToken())
//       .send({
//         email: 'ADtest1@example.com',
//         isActive: 'invalid-value',
//       })
//       .expect(400);

//     expect(response.body).toHaveProperty('status', false);
//     expect(response.body).toHaveProperty('error', 'isActive should be boolean');
//   });

//   it('should handle missing email', async () => {
//     const response = await request(app)
//       .post('/api/user/activateOrDeactivateUser')
//       .set('Authorization', await generateBearerToken())
//       .send({
//         isActive: true,
//       })
//       .expect(400);

//     expect(response.body).toHaveProperty('status', false);
//     expect(response.body).toHaveProperty('error', 'no email Id');
//   });

//   it('should handle user not found', async () => {
//     const response = await request(app)
//       .post('/api/user/activateOrDeactivateUser')
//       .set('Authorization', await generateBearerToken())
//       .send({
//         email: 'nonexistent@example.com',
//         isActive: true,
//       })
//       .expect(400);

//     expect(response.body).toHaveProperty('status', false);
//     expect(response.body).toHaveProperty('error', 'User not found');
//   });

//   it('should handle user already activated', async () => {
//     const existingUser = new User({
//       name: 'AD Test User',
//       email: 'ADtest@example.com',
//       password: 'ADtestpassword',
//       isActive: true,
//     });
//     await existingUser.save();

//     const response = await request(app)
//       .post('/api/user/activateOrDeactivateUser')
//       .set('Authorization', await generateBearerToken())
//       .send({
//         email: 'ADtest@example.com',
//         isActive: true,
//       })
//       .expect(201);

//     expect(response.body).toHaveProperty('status', false);
//     expect(response.body).toHaveProperty('error', 'user is activated already');
//   });

//   it('should handle user already deactivated', async () => {
//     const existingUser = new User({
//       name: 'Test User',
//       email: 'ADtestfalse@example.com',
//       password: 'ADtestfalse',
//       isActive: false,
//     });
//     await existingUser.save();

//     const response = await request(app)
//       .post('/api/user/activateOrDeactivateUser')
//       .set('Authorization', await generateBearerToken())
//       .send({
//         email: 'ADtestfalse@example.com',
//         isActive: false,
//       })
//       .expect(201);

//     expect(response.body).toHaveProperty('status', false);
//     expect(response.body).toHaveProperty('error', 'user is deactivated already');
//   });
// });

// describe('Search Users API', () => {
//   let userToken;

//   beforeAll(async () => {
//     userToken = await generateBearerToken();
//   });

//   it('should return users matching the search keyword', async () => {
//     const user1 = new User({
//       name: 'John Doe',
//       email: 'john@example.com',
//       password: 'johnpassword',
//     });
//     await user1.save();

//     const user2 = new User({
//       name: 'Jane Doe',
//       email: 'jane@example.com',
//       password: 'janepassword',
//     });
//     await user2.save();

//     const response = await request(app)
//       .get('/api/user/searchUsers')
//       .set('Authorization', userToken)
//       .query({ search: 'John' })
//       .expect(200);

//     expect(response.body).toHaveLength(1);
//     expect(response.body[0]).toHaveProperty('name', 'John Doe');
//     expect(response.body[0]).toHaveProperty('email', 'john@example.com');
//   });

//   it('should return an empty array for non-matching search keyword', async () => {
//     const response = await request(app)
//       .get('/api/user/searchUsers')
//       .set('Authorization', userToken)
//       .query({ search: 'Nonexistent' })
//       .expect(200);

//     expect(response.body).toHaveLength(0);
//   });

//   it('should handle missing search keyword', async () => {
//     const response = await request(app)
//       .get('/api/user/searchUsers')
//       .set('Authorization', userToken)
//       .expect(200);
//     expect(response.body.length).toBeGreaterThan(0);
//   });

//   it('should exclude the authenticated user from the search results', async () => {
//     // let name = 'Authenticated User';
//     // let email = 'auth@example.com';
//     // let password = 'authpassword';
//     // const authenticatedUser = new User({
//     //   name: name,
//     //   email: email,
//     //   password: password,
//     //   isActive: true
//     // });
//     // await authenticatedUser.save();

//     const response = await request(app)
//       .get(`/api/user/searchUsers`)
//       .set('Authorization', await generateBearerToken())
//       .query({ search: 'kunaldeep reddy' })
//       .expect(200);

//     expect(response.body).toHaveLength(0);
//   });
// });

// describe('Get All Users API', () => {
//   let adminToken, regularUserToken;

//   beforeAll(async () => {
//     adminToken = await generateBearerToken();
//     regularUserToken = await generateBearerToken("siri@gmail.com", "siri");
//   });

//   it('should return all regular users when no search keyword is provided', async () => {
//     const regularUser1 = new User({
//       name: 'Regular User 1',
//       email: 'regular1@example.com',
//       password: 'regularpassword1',
//     });
//     await regularUser1.save();

//     const regularUser2 = new User({
//       name: 'Regular User 2',
//       email: 'regular2@example.com',
//       password: 'regularpassword2',
//     });
//     await regularUser2.save();

//     const response = await request(app)
//       .get('/api/user/getAllUsers')
//       .set('Authorization', adminToken)
//       .expect(200);

//     expect(response.body).toHaveProperty('status', true);
//     expect(response.body).toHaveProperty('message', 'success');
//     expect(response.body).toHaveProperty('users');
//     expect(response.body.users.length).toBeGreaterThan(2);
//   });

//   it('should return users matching the search keyword', async () => {
//     const regularUser3 = new User({
//       name: 'User with Keyword',
//       email: 'userwithkeyword@example.com',
//       password: 'userwithkeywordpassword',
//     });
//     await regularUser3.save();

//     const response = await request(app)
//       .get('/api/user/getAllUsers')
//       .set('Authorization', adminToken)
//       .query({ search: 'Keyword' })
//       .expect(200);

//     expect(response.body).toHaveProperty('status', true);
//     expect(response.body).toHaveProperty('message', 'success');
//     expect(response.body).toHaveProperty('users');
//     expect(response.body.users).toHaveLength(1);
//     expect(response.body.users[0]).toHaveProperty('name', 'User with Keyword');
//   });

//   it('should return an empty array for non-matching search keyword', async () => {
//     const response = await request(app)
//       .get('/api/user/getAllUsers')
//       .set('Authorization', adminToken)
//       .query({ search: 'Nonexistent' })
//       .expect(200);

//     expect(response.body).toHaveProperty('status', true);
//     expect(response.body).toHaveProperty('message', 'success');
//     expect(response.body).toHaveProperty('users');
//     expect(response.body.users).toHaveLength(0);
//   });

//   it('should handle regular user accessing the API', async () => {
//     const response = await request(app)
//       .get('/api/user/getAllUsers')
//       .set('Authorization', regularUserToken)
//       .expect(401);

//     expect(response.body).toHaveProperty('status', false);
//     expect(response.body).toHaveProperty('message', 'not authorized');
//   });
// });


