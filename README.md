
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

## Environment Variables

create .env file to back-end root directory and add these variables as listed below .

`PORT=<Backend_PORT>`

`MONGO_URI = <mongo_db_url>`

`JWT_SECRET_KEY=<XXXXXXXXXXXX>`

`TOKEN_EXPIRY = "365d"`


## API Reference

The backend of the application is built with node js, express js, mongodb and socket io. These technologies are used to create APIs for different functionalities. The application has three main modules: users, messages and chats. Each module has its own controller, model and router.

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

This API is used to remove a user from the group. The user can be removed only by the group admin. This action is irreversible and will revoke the user's access to the group resources.

#### Add a user to a chat group.

```http
  PUT /api/chat/addToGroup
```
This API is used to add a user to a chat group. only the group admin can add users to the group.


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


## Running Tests

To run Jest & Supertest unit tests, run the following command.

```bash
  cd chat-app-backend
  npm install (not needed if already installed)
  npm jest
```
