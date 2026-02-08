const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

/* Register Route => POST API  */
router.post("/register", authController.registerUser);

  

module.exports = router;
