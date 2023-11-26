const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Chat = require("../models/chatModel");
const chatModel = require("../models/chatModel");

//create chat
//post request
const createChat = asyncHandler(async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    const chat = await Chat.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) return res.status(200).json(chat);
    const newChat = await Chat.create({
      members: [firstId, secondId],
    });
    res.status(200).json(newChat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//get chats
//get request

const getChats = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  // const userId = req.user.id
  try {
    const chats = await Chat.find({
      members: { $in: [userId] },
    });
    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//get chat
//get request
const getChat = asyncHandler(async (req, res) => {
  // if (!req.body.user) req.body.user = req.user.id;
  // const userId = req.params.userId;
  const { firstId, secondId } = req.params;
  try {
    const chat = await Chat.findOne({
      members: { $all: [firstId, secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = {
  getChat,
  getChats,
  createChat,
};
