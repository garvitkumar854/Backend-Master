const express = require('express');
const authController = require('../controllers/auth.controller');
const authRouter = express.Router();

authRouter.post('/register', authController.registerUser);

authRouter.post('/login', authController.loginUser);

authRouter.get('/logout', authController.logoutUser);

authRouter.get('/logout-all', authController.logoutAll);

authRouter.get('/get-me', authController.getMe);

authRouter.get('/refresh-token', authController.refreshToken);

authRouter.get('/verify-email', authController.verifyEmail);

module.exports = authRouter;
