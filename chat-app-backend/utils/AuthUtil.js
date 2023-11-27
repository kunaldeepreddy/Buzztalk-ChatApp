const JSONWebToken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Constants = require("./constants");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

module.exports = {
	signToken: (user_id, name, email, isAdmin) => {
		var token = JSONWebToken.sign(
			{
				user_id: user_id,
				name: name,
				email: email,
				isAdmin: isAdmin,
			},
			process.env.JWT_SECRET_KEY,
			{ expiresIn: process.env.TOKEN_EXPIRY }
		);
		return token;
	},

	 isAuthenticated : asyncHandler(async (req, res, next) => {
		let token;
	  
		if (
		  req.headers.authorization &&
		  req.headers.authorization.startsWith("Bearer")
		) {
		  try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = JSONWebToken.verify(token, process.env.JWT_SECRET_KEY);
	  
			let user = await User.findById(decoded.user_id).select("-password");
			console.log(user);
			if(user.isActive == false) {
				res.status(401).send({
					status: false,
					error: "Account Inactive/Blocked. Please Contact Admin",
					isActive:false
				  });
			}
			else {
			req.user = user;
			next();
			}
		  } catch (error) {
			console.log("error ",error)
			res.status(401).send({
				status: false,
				error: "Not authorized, token has failed",
			  });
		  }
		}
	  
		if (!token) {
		  res.status(401);
		  throw new Error("Not authorized, no token found");
		}
	  }),

	validateAdmin: (req, res, next) => {
		const data = req.user;
		console.log("data ",data, req.user)
		if (data && data.isAdmin == true) next();
		else {
			return res.status(401).send({
				status: false,
				message: "not authorized",
			});
		}
	},

	comparePasswords: (plainPwd, hashedPwd) => {
		return bcrypt.compareSync(plainPwd, hashedPwd);
	},

	getHashedPassword: (pwd) => {
		var salt = bcrypt.genSaltSync(10);
		return bcrypt.hashSync(pwd, salt);
	},

	getObjectReplica: (data, unwanted) => {
		let dt = {};
		let keys = Object.keys(data);
		keys.forEach((key) => {
			if (!unwanted.includes(key)) dt[key] = data[key];
		});
		return dt;
	},
};
