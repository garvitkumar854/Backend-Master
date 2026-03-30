const mongoose = require('mongoose');
const ledgerModel = require('./ledger.model');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User reference is required"],
        index: true
    },
    status: {
        type: String,
        required: [true, "Status is required"],
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message: "Status must be either ACTIVE, FROZEN, or CLOSED",
        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [true, "Currency is required"],
        default: "INR",
        uppercase: true,
        trim: true,
        match: [/^[A-Z]{3}$/, "Currency must be a valid 3-letter ISO code"]
    }
}, {
    timestamps: true
})

accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function () {
    const balanceData = await ledgerModel.aggregate([
        { $match: { account: this._id } },
        {
            $group: {
                _id: "$account",
                totalDebit: {
                    $sum: { $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0] }
                },
                totalCredit: {
                    $sum: { $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0] }
                }
            }
        }, {
            $project: {
                _id: 0,
                balance: { $subtract: ["$totalCredit", "$totalDebit"] }
            }
        }
    ])

    if (balanceData.length === 0) {
        return 0;   // No ledger entries means balance is 0
    }
    return balanceData[0].balance;

}

const accountModel = mongoose.model("account", accountSchema);

module.exports = accountModel;