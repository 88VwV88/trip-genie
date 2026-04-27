const mongoose = require("mongoose");
const env = require("./env");

async function connectDB() {
  await mongoose.connect(env.MONGODB_URI);
  // Keep logs explicit for quick deployment debugging.
  console.log("MongoDB connected");
}

module.exports = connectDB;
