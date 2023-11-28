const User = require("../models/userModel");
const AuthUtil = require("../utils/AuthUtil");

//route           POST /api/user/getUsersByPagination
//description     get all users
//access          Public
const getAllUsers = async (req, res) => {
  let query = { isAdmin: false };
  if (req.query.search)
    query = {
      name: { $regex: req.query.search, $options: "i" },
      isAdmin: false,
    };
  let users = await User.find(query, "-password -updatedAt -__v")
    .sort("-createdAt")
    .lean();
  // console.log(users)
  return res.json({
    status: true,
    message: "success",
    users: users,
  });
};

//route           POST /api/user/register
//description     Register new user
//access          Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).send({
      status: false,
      error: "Please Enter all the Fields",
    });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).send({
      status: false,
      error: "User already exists",
    });
  }

  var emailToValidate = req.body.email;
  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (emailRegexp.test(emailToValidate) == false) {
    return res.json({
      status: false,
      error: "Invalid mailId",
    });
  }
  const user = new User({
    email: email,
    password: AuthUtil.getHashedPassword(password),
    name: name,
    isAdmin: req.body.isAdmin || false,
    isActive: true,
  });
  let userResponse = await user.save();
  let user_record = AuthUtil.getObjectReplica(userResponse.toObject(), [
    "__v",
    "password",
  ]);
  user_record.token = AuthUtil.signToken(
    userResponse._id,
    userResponse.name,
    userResponse.email,
    userResponse.isAdmin
  );
  res.status(200).send({
    status: true,
    message: "user added successfully",
    data: user_record,
  });
};

// route           POST /api/user/signUp
// description     user signUp
// access          Public
const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).send({
      status: false,
      error: "Please Enter all the Fields",
    });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).send({
      status: false,
      error: "User already exists",
    });
  }

  var emailToValidate = req.body.email;
  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (emailRegexp.test(emailToValidate) == false) {
    return res.json({
      status: false,
      error: "Invalid mailId",
    });
  }
  const user = new User({
    email: email,
    password: AuthUtil.getHashedPassword(password),
    name: name,
    isAdmin: req.body.isAdmin || false,
    isActive: false,
  });
  let userResponse = await user.save();
  let user_record = AuthUtil.getObjectReplica(userResponse.toObject(), [
    "__v",
    "password",
  ]);
  res.status(200).send({
    status: true,
    message: "registered successfully, we will let the admin know about this.",
    data: user_record,
  });
};

// route           POST /api/user/activateOrDeactivateUser
// description     activate Or Deactivate user
// access          Public
const activateOrDeactivateUser = async (req, res) => {
  const { email: email, isActive } = req.body;
  if (typeof isActive != "boolean") {
    res.status(400).send({
      status: false,
      error: "isActive should be boolean",
    });
  }

  if (!email) {
    res.status(400).send({
      status: false,
      error: "no email Id",
    });
  }

  const user = await User.findOne({ email: email, isAdmin: false });
  console.log(user);
  if (!user) {
    res.status(400).send({
      status: false,
      error: "User not found",
    });
  }

  if (user.isActive == true && isActive == true) {
    res.status(201).send({
      status: false,
      error: "user is activated already",
    });
  }

  if (user.isActive == false && isActive == false) {
    res.status(201).send({
      status: false,
      error: "user is deactivated already",
    });
  }

  let userRes = await User.findByIdAndUpdate(user._id, { isActive: isActive });

  let user_record = AuthUtil.getObjectReplica(userRes.toObject(), [
    "__v",
    "password",
    "isAdmin",
    "isActive",
  ]);
  res.status(200).send({
    status: true,
    message:
      isActive == true
        ? "user activated successfully"
        : "user deactivated successfully",
    data: user_record,
  });
};

//@description     authenticate the user
//@route           POST /api/users/login
//@access          Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("no credentials")
      return res.status(400).json({
        status: false,
        message: "no Email or Password",
      });
    }
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid Email or Password",
      });
    }

    if (!AuthUtil.comparePasswords(password, user.password)) {
      return res.status(400).json({
        status: false,
        message: "incorrect password",
      });
    }

    if (user.isActive == false) {
      return res.status(400).json({
        status: false,
        message: "Account Inactive/Blocked. Please Contact Admin",
      });
    }

    if (user) {
      const user_details = AuthUtil.getObjectReplica(user, [
        "password",
        "is_active",
        "__v",
      ]);
      user_details.token = AuthUtil.signToken(
        user._id,
        user.name,
        user.email,
        user.isAdmin
      );
      return res.status(200).send({
        status: true,
        message: "success",
        data: user_details,
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "Invalid Email or Password",
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
    // return res.status(500).json({
    //   status: false,
    //   message: error,
    // });
  }
};

// route           GET /api/user/searchUsers?search=
// description     Get or Search all users
// access          Protected
const searchUsers = async (req, res) => {
  console.log(req.query);
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};

module.exports = {
  getAllUsers,
  searchUsers,
  registerUser,
  activateOrDeactivateUser,
  login,
  signUp,
};
