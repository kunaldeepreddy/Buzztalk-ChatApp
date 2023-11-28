
# BuzzTalk

A MERN stack and socket IO based chat app that allows users to communicate in real time.

## Run Locally

Clone the project

```bash
  git clone https://github.com/kunaldeepreddy/ChatApp.git
```
go to the project directory

### Back-end

```bash
  cd chat-app-backend
  npm install 
  npm start
```

### Front-end

```bash
  cd chat-app-frontend
  npm install (if command fails, then retry with `--force` or `--legacy-peer-deps`)
  npm start
```
<br>
<br>

## Environment Variables

create .env file in chat-app-backend directory and add these variables as listed below .

`PORT=<Backend_PORT>`

`MONGO_URI = <mongo_db_url>`

`JWT_SECRET_KEY=<XXXXXXXXXXXX>`

`TOKEN_EXPIRY = "365d"`

<br>

## API Reference

The backend of the application is built with node js, express js, mongodb and socket io. These technologies are used to create APIs for different functionalities. The application has three main modules: users, messages and chats. Each module has its own controller, model and router.

<br>

### User module

The User Module handles the user data in the system. It can create, activate, deactivate, authenticate, and authorize user accounts. It can also get the users list and search for users. It provides these APIs for user data operations:

#### User Sign Up

```http
  POST /api/user/signUp
```
This API is used for signing up a new user in the application. It stores the user details in the database and notifies the app admin. The admin can then view the new user in the users list page and activate their account.

#### Account Activation / Deactivation

```http
  POST /api/user/activateOrDeactivateUser
```
This API is designed for app admin only. It allows them to enable or disable the accounts of any other users who are not admin.

#### Login

```http
  POST /api/user/login
```
This API is a login service that returns a user token ID for the application. The user token ID is required for making secure API requests later.

#### Search Users

```http
  GET /api/user/searchUsers?search=${search}
```
This API is designed to query users in the application and it returns a list of users excluding the one who is querying.

#### Get Users

```http
  GET /api/user/getAllUsers
```
This API is designed to retrieve all the non-app-admin users in the application. only app admins have access to this API.

<br>

### Chat module

This module provides backend APIs for various chat functionalities. You can use these APIs to create and manage one-to-one or group chats, as well as to fetch the chat list of a user. You can also rename a group, add or remove members from a group using these APIs.

#### Create/Fetch Chat

```http
  POST /api/chat/accessChat
```
This API allows you to either initiate a new one-to-one chat with a user or retrieve an existing one-to-one chat with a user.

#### Fetch chats

```http
  GET /api/chat/fetchChats
```
This API returns all the chats of a particular user in an array list of objects.

#### Create a chat group

```http
  POST /api/chat/createGroupChat
```
This API is used to create a chat group with at least 3 users. The API takes a list of user IDs and group name as input and returns a group ID as output.

#### Rename a chat group

```http
  PUT /api/chat/renameGroup
```

This API allows you to change the name of an existing chat group. The name can only be modified by the group admin.

#### Remove user from a chat group

```http
  PUT /api/chat/removeFromGroup
```

This API is used to remove a user from the group. The user can be removed only by the group admin. This action will revoke the user's access to the group resources.

#### Add a user to a chat group.

```http
  PUT /api/chat/addToGroup
```
This API is used to add a user to a chat group. only the group admin can add users to the group.

<br>

### Message Module

This Module contains backend APIs for various messaging features. You can use them to send messages to one-to-one or group chats, and to add emoji reactions to messages.

#### Send Message

```http
  POST /api/Message/sendMessage
```
This API is used to send messages to one-to-one or group chats.

#### Fetch chat messages

```http
  GET /api/allMessages/:chatId
```
This API is used to fetch messages from one-to-one or group chats.

#### React to Message

```http
  POST /api/Message/reactToMessage
```
This API is used to store details of all reactions to messages in one-to-one and group chat.

<br>
<br>

## UI Screenshots

<br>

This is SignUp/Login Page of BuzzTalk app where users can signup or login to chat.

<br>

![image](https://github.com/kunaldeepreddy/ChatApp/assets/41263792/a2c8ccd7-72b1-4814-b28d-21e6be11bb80)

<br>
<br>

This page displays all non-app-admin(regular) users in a list. App admin can enable/disbale account of users who have signed up to the chat app.

<br>

![image](https://github.com/kunaldeepreddy/ChatApp/assets/41263792/d1976952-9791-4cb5-b6ff-b13334bf3832)

<br>
<br>

The app admin must activate the account of the user who signed up recently. After that, the user can access the chat app by entering their credentials on the login page.

<br>

![image](https://github.com/kunaldeepreddy/ChatApp/assets/41263792/b29b64c1-a237-4999-bdbf-391ede4b60b3)

<br>
<br>

This is tha chat app home page which users see when they log into the application. 

<br>

![image](https://github.com/kunaldeepreddy/ChatApp/assets/41263792/f0796fa2-5cd9-4350-bcbc-747db889ec4e)

<br>
<br>

The UI has a search bar on the left side that allows users to find other users. The search operation is optimized using debouncing method to reduce the number of API calls and avoid unnecessary costs.

<br>

![image](https://github.com/kunaldeepreddy/ChatApp/assets/41263792/5b9c3ae0-eeb1-4b1b-86e6-ba5b3abed47d)

<br>
<br>

Once we find a user we want to chat with, we can click on their name or profile picture. This will open a chat window where we can send and receive messages with them.

<br>

![image](https://github.com/kunaldeepreddy/ChatApp/assets/41263792/2e0a4366-0c45-4616-95e4-a09a85697172)

<br>
<br>

Users can create chat groups using the "New Chat Group +" button and add any active/enabled users in to the group.

<br>

![image](https://github.com/kunaldeepreddy/ChatApp/assets/41263792/23feb408-c0b5-4846-9fba-4a1ec5d3fefc)

<br>
<br>

The group chat page lets users talk to all group members at once. It is easy to use and shows the messages in order.

<br>

![image](https://github.com/kunaldeepreddy/ChatApp/assets/41263792/5b73a68f-c4a3-46e4-9684-fbe5bfad8924)

<br>
<br>

Group admins can edit group name and add/remove users from the group anytime by clicking on the three drops symbol on chat box.

<br>

![image](https://github.com/kunaldeepreddy/ChatApp/assets/41263792/de6f2d5f-102a-451a-a32e-989fd220112e)

<br>
<br>

The chat app shows a typing animation when someone is typing a message on the chat. It appears on the top of the message box. It makes the chat more interactive.

<br>

![image](https://github.com/kunaldeepreddy/ChatApp/assets/41263792/0e48dc62-30c9-4d1f-87f2-b1590a8159d2)

<br>
<br>

user can also pick emojis by clicking on the emoji picker provided beside the message text box.

<br>

![image](https://github.com/kunaldeepreddy/ChatApp/assets/41263792/29efb0c6-1c5b-4f31-b99e-da58d29fdb9b)

<br>
<br>

Users can also react to any message in the chat box using emojis.

<br>

![image](https://github.com/kunaldeepreddy/ChatApp/assets/41263792/ac6b7e15-7388-466c-8b37-568c687a27bb)

<br>
<br>

All the reactions to a message can be seen by clicking on it.

<br>

![image](https://github.com/kunaldeepreddy/ChatApp/assets/41263792/8736bfbd-ae9f-4787-b600-d0ae40bd96b7)

<br>
<br>

## Running Tests

To run Jest & Supertest unit tests, run the following command.

```bash
  cd chat-app-backend
  npm install (ignore if already installed)
  npm jest
```
