const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");
// const sendEmail = require("../utils/email");
const crypto = require("crypto");
const { error } = require("console");
// const { match } = require("assert");
// const { start } = require("repl");
// const APIFeatures = require("../utils/apiFeatures");
// const { reset } = require("nodemon");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const createSendToken = (user, statusCode, res) => {
  console.log("yes");
  const token = jwt.sign(
    {
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m" }
  );

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
  };

  // if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  console.log(token);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

//desc Get all Users
//@route Post /api/contacts
//@access public

const getUsers = asyncHandler(async (req, res) => {
  let filter = {};
  try {
    filter = req.query;
    console.log(filter);
    const users = await User.find(filter);
    res.status(201).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//desc single Users
//@route Post /api/contacts
//@access public
const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "user not found" });
      throw new Error("user not found");
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//desc Register Users
//@route Post /api/contacts
//@access public

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json("fields required");
      throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({ email });
    const usernameAvailbale = await User.findOne({ username });

    if (userAvailable) {
      res.status(400);
      throw new Error("user already exist");
    }
    if (usernameAvailbale) {
      res.status(400).json("user already exist");
      throw new Error("username exist");
    }
    if (!validator.isEmail(email)) {
      res.status(400);
      throw new Error("email must be a valid email...");
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hash password:", hashedPassword);

    // const user = "fuck";

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      createSendToken(user, 201, res);
    } else {
      res.status(400);
      throw new Error("user data is not valid");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
    throw new Error(error);
  }
});

//desc login Users
//@route Post /api/contacts
//@access public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ mesage: "all fields required" });
    throw new Error("All fields are mandatory");
  }
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json("invalid email or password");
  //compare password
  console.log("works1", user.password);

  if (user && (await bcrypt.compare(password, user.password))) {
    createSendToken(user, 200, res);
  } else {
    res.status(401).json("password not valid");
    throw new Error(" password not valid");
  }
});

//desc current Users
//@route get /api/contacts
//@access private

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
  console.log(req);
});

const updateUser = asyncHandler(async (req, res, next) => {
  //create error if user Posts password data
  if (req.body.password) {
    res.status(400);
    throw new Error(
      "This route is not for password updates. please use /updateMyPassword"
    );
  }

  //filtered out names that are not to be updated
  const filteredBody = filterObj(req.body, "username", "email");

  //update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updateUser,
    },
  });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
const logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("jwt");

  res.status(200).json({ message: "Logout successful" });
});

module.exports = {
  getUsers,
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateUser,
  deleteUser,
  getUser,
};
