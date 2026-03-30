const { Router } = require('express');

const authMiddleware = require('../middlewares/auth.middleware');

const transactionController = require('../controllers/transaction.controller');

const transactionRouter = Router();

/**
 * - Create Transaction Route
 * - POST /api/transactions
 */
transactionRouter.post('/', authMiddleware.authMiddleware, transactionController.createTransaction);

module.exports = transactionRouter;