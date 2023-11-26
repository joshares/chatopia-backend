const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.ObjectId,
      ref: "Chat",
      required: [true, "chat id required"],
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "user id required"],
    },
    text: {
      type: String,
      required: [true, "chats is requiired"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
