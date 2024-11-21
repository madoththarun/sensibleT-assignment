const express = require("express");
const Transaction = require("../models/Transaction");

const router = express.Router();

// Create a Transaction (POST /api/transactions)
router.post("/transactions", async (req, res) => {
  try {
    const { amount, transaction_type, user } = req.body;

    const transaction = new Transaction({ amount, transaction_type, user });
    await transaction.save();

    res.status(201).json({
      transaction_id: transaction._id,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      status: transaction.status,
      user: transaction.user,
      timestamp: transaction.timestamp,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve Transactions by User (GET /api/transactions)
router.get("/transactions", async (req, res) => {
  const { user_id } = req.query;
  try {
    const transactions = await Transaction.find({ user: user_id });

    res.status(200).json({
      transactions: transactions.map((transaction) => ({
        transaction_id: transaction._id,
        amount: transaction.amount,
        transaction_type: transaction.transaction_type,
        status: transaction.status,
        timestamp: transaction.timestamp,
      })),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Transaction Status (PUT /api/transactions/:id)
router.put("/transactions/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["COMPLETED", "FAILED"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({
      transaction_id: transaction._id,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      status: transaction.status,
      timestamp: transaction.timestamp,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve Transaction by ID (GET /api/transactions/:id)
router.get("/transactions/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({
      transaction_id: transaction._id,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      status: transaction.status,
      timestamp: transaction.timestamp,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
