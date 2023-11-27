const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
module.exports = Object.freeze({
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  PORT: process.env.PORT,
  MONGOOSE_OPTIONS: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
});
