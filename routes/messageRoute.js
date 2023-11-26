const express = require("express");
const {
  getMessages,
  createMessage,
} = require("../controllers/messageController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();
router.use(validateToken);

router.route("/").post(createMessage);
router.route("/:chatId").get(getMessages);

module.exports = router;
