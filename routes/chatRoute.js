const express = require("express");
const {
  getChat,
  getChats,
  createChat,
} = require("../controllers/chatController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.use(validateToken);

router.route("/").post(createChat);
router.route("/:userId").get(getChats);
router.route("/:firstId/:secondId").get(getChat);

module.exports = router;
