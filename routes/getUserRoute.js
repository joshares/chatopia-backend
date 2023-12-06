const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.route("/").get(validateToken, (req, res) => {
  // Access user information from req.user
  const user = req.user;

  // Respond with user information
  res.status(200).json({ user });
  console.log("User:", user);
});

module.exports = router;
