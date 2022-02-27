const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  verified: Boolean,
  picture: String,
});

module.exports = mongoose.model("user", UserSchema);
