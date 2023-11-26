const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      minLength: 3,
      maxLength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: [true, " email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: 3,
      maxLength: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Enable virtuals using the toJSON option
// userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
