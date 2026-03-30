const express = require('express');

// Routers Required
const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');
const transactionRouter = require('./routes/transaction.routes');

const app = express();

const cookieParser = require('cookie-parser');

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Use Routes
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);

module.exports = app;