const { Router } = require('express');
const authMiddleware = require('../middlewares/auth.middleware');

const transactionRoutes = Router();

/**
 * - Create Transaction Route
 * - POST /api/transactions
 */
transactionRoutes.post('/', authMiddleware.authMiddleware, createTransaction);

module.exports = transactionRoutes;