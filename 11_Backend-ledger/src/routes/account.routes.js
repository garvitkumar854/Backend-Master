const express = require('express');
const router = express.Router();

// Auth Middleware
const authMiddleware = require('../middlewares/auth.middleware');

const accountController = require('../controllers/account.controller');

/**
 * - POST /api/accounts/create
 * - Create a new account for the authenticated user
 */
router.post("/create", authMiddleware.authMiddleware, accountController.createAccountController);

module.exports = router;