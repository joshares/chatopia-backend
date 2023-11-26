const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const chatSchema = mongoose.Schema(
  {
    members: {
      type: Array,
      required: [true, "members required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
