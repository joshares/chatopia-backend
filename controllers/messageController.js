const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");

//create message
//post request

const createMessage = asyncHandler(async (req, res) => {
  try {
    const { chat, sender, text } = req.body;
    // if (!req.body.chat) req.body.chat = req.user.id;

    if (!chat || !sender || !text) {
      res.status(400).json("fields required");
      throw new Error("All fields are mandatory");
    }

    const message = await Message.create({
      chat,
      sender,
      text,
    });
    console.log(message);
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//get message
//get request

const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  try {
    const message = await Message.find({ chat: chatId });
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = {
  getMessages,
  createMessage,
};
