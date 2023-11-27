const Constants = require('../utils/constants')
const mongoose = require('mongoose');
const Path = require('path')
const dotenv = require('dotenv');
dotenv.config({ path: Path.join(__dirname, '../.env') });
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(Constants.MONGO_URI, Constants.MONGOOSE_OPTIONS);
  
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1); // Exit with a non-zero status code to indicate an error
    }
  };
  connectDB();