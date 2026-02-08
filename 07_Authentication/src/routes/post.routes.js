const express = require("express");
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token verification
const userModel = require("../models/user.model");

const router = express.Router();

router.post("/create", async (req, res) => {
  const token = req.cookies.token; // Access the token from cookies

  // Deny if token is not present
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key

    const user = await userModel.findOne({
      _id: decoded.id,
    });

    console.log(user);
  } catch (err) {
    return res.status(401).json({
      message: "Token is Invalid !",
    });
  }

  res.send("Post created successfully");
});

module.exports = router;
