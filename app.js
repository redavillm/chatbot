require("dotenv").config();

require("./models/db");

const User = require("./models/User");

const Room = require("./models/Room");

const express = require("express");

const { bot } = require("./bot");

const { getMessages, getChats } = require("./lib/messages");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.get("/users", async (req, res) => {
  const count = await User.countDocuments();
  const users = await User.find();
  res.json({ count, items: users });
});

app.post("/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ item: user });
});

app.get("/rooms", async (req, res) => {
  const count = await Room.countDocuments();
  const rooms = await Room.find();
  res.json({ count, items: rooms });
});

app.post("/rooms", async (req, res) => {
  const room = new Room(req.body);
  await room.save();
  res.json({ item: room });
});

app.post("/chats/:chatId/send", (req, res) => {
  console.log(req.body);
  bot.sendMessage(req.params.chatId, req.body.message);
  res.send("OK");
});

app.get("/chats/", (req, res) => {
  res.json(getChats());
});

app.get("/chats/:id/messages", (req, res) => {
  res.json(getMessages(req.params.id));
});

app.get("/about", (req, res) => {
  res.send("about this site");
});

app.listen(3000, () => {
  console.log("server started on http://localhost:3000");
});

// http://localhost:3000/chat/423330500/messages   get
