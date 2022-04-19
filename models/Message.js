const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  user_id: Number,
  room_id: Number,
  message: String
},{
    timestamps: true
});
const Message = mongoose.model("Message", messageSchema, "messages");

module.exports = Message;
