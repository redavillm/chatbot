const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema({
  id: Number,
  subject: {type:String, required:true},
  users: [Number],
  logs: [{
      name:String,
      message:String
  }],
});
const Room = mongoose.model("Room", roomSchema, "rooms");

module.exports = Room;
