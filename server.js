const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const cookieParser = require("cookie-parser");

connectDb();
const app = express();

//middleware

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://chatopia-phi.vercel.app",
    credentials: true,
  })
);
app.use(errorHandler);

//test middle ware
app.use((req, res, next) => {
  // req.requestTime = new Date().toISOString();
  console.log("cookie:", req.cookies);
  next();
});

//routes
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/chats", require("./routes/chatRoute"));
app.use("/api/messages", require("./routes/messageRoute"));
app.use("/api/user", require("./routes/getUserRoute"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server runnung on: ${port}`);
});
