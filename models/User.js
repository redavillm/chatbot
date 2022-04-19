const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    chat_id: Number,
  name: "string",
  age: "number"
});
const User = mongoose.model("User", userSchema, "users");

module.exports = User;
