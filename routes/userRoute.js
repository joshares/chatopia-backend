const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  updateUser,
  deleteUser,
  getUsers,
  getUser,
  logoutUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.route("/").get(getUsers);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(validateToken, logoutUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
