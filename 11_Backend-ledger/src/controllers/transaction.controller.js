const transactionModel = require('../models/transaction.model');
const accountModel = require('../models/account.model');
const ledgerModel = require('../models/ledger.model');
const emailService = require('../services/email.service');
const mongoose = require('mongoose');

/**
 * - Create a new transaction
 * - THE 10-Step Process for Transaction:
    * 1. Validate Request
    * 2. Validate Idempotency Key
    * 3. Check Account Status
    * 4. Derive Sender Balance From Ledger
    * 5. Create Transaction (PENDING)
    * 6. Create DEBIT Ledger Entry
    * 7. Create CREDIT Ledger Entry
    * 8. Mark Transaction as COMPLETED
    * 9. Commit MongoDB Session
    * 10. Send Email Notification
 */
async function createTransaction(req, res) {
    // Validate Request
    const { fromAccount, toAccount, amount, currency } = req.body;

    if (!fromAccount || !toAccount || !amount || !currency) {
        return res.status(400).json({ message: "fromAccount, toAccount, amount, and currency are required" });
    }

    // Check if Both Accounts Exists
    const fromUserAccount = await accountModel.findOne({ _id: fromAccount });
    const toUserAccount = await accountModel.findOne({ _id: toAccount });

    if (!fromUserAccount || !toUserAccount) {
        return res.status(404).json({ message: "One or both accounts not found" });
    }

    // Validate Idempotency Key
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    });

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction Already Completed",
                transaction: isTransactionAlreadyExists
            });
        }
        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is Pending...",
                transaction: isTransactionAlreadyExists
            })
        }
        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(200).json({
                message: "Transaction Failed",
                transaction: isTransactionAlreadyExists
            });
        }
        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(200).json({
                message: "Transaction Reversed, Please Try Again",
                transaction: isTransactionAlreadyExists
            });
        }
        return res.status(409).json({ message: "Transaction with this idempotency key already exists" });
    }

    // Check Account Status
    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({ message: "Both accounts must be ACTIVE to perform a transaction" });
    }

    // Derive Sender Balance From Ledger
    const balance = await fromUserAccount.getBalance();
    if (balance < amount) {
        return res.status(400).json({ message: `Insufficient balance in Sender's Account, Current Balance is ${balance}` });
    }

    // Create Transaction (PENDING)
    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = await transactionModel.create({
        fromAccount, toAccount, amount, currency, status: "PENDING", idempotencyKey
    }, { session });

    const debitLedgerEntry = await ledgerModel.create({
        account: fromAccount,
        amount,
        transaction: transaction._id,
        type: "DEBIT"
    }, { session });

    const creditLedgerEntry = await ledgerModel.create({
        account: toAccount,
        amount,
        transaction: transaction._id,
        type: "CREDIT"
    }, { session });

    // Updtate Transaction Status to COMPLETED
    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Send Email Notification
    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, fromUserAccount.currency, toUserAccount._id);

    return res.status(201).json({
        message: "Transaction Completed Successfully",
        transaction
    });
}

module.exports = { createTransaction };