const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  transaction_type: {
    type: String,
    enum: ["DEPOSIT", "WITHDRAWAL"],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Optional: Replace with your User model or MongoDB user implementation
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "FAILED"],
    default: "PENDING",
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
