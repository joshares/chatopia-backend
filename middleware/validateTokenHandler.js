const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  console.log("starting");
  let token;
  let authHeader = req.headers.cookie || req.headers.Cookie;
  console.log("oko:", authHeader, req.headers);
  if (authHeader && authHeader.startsWith("jwt")) {
    console.log("continue");
    token = authHeader.split("=")[1];
    console.log("yes worked", token);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        res.status(401);
        throw new Error("user is not authorised");
      }
      console.log("fine");
      req.user = decoded.user;
      console.log(req.user);
      next();
    });
    if (!token) {
      res.status(401);
      throw new Error("User is not authorized or token is missing");
    }
  } else if (!authHeader) {
    console.log("mistake");
    res.status(401);
    throw new Error("User is not authorized or token is missing");
  }
});

module.exports = validateToken;
