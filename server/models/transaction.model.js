const mongoose = require("mongoose");
require("dotenv").config();

const transactionTypes = [
  "PURCHASE",
  "SALARY",
  "EXPENSE",
  "AMC",
  "AMC_RETURN",
  "SALE",
  "RETURN",
  "TECHNICIAN_PAID",
];

const transactionMethods = ["CASH", "CARD", "UPI"];
const transactionStatus = ["PENDING", "SUCCESS", "FAILED"];

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

// Reciver & Initiator can be anyone but confirmed by must be an employee of type - Office
const TransactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, unique: true },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recievedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      // required: [true, "confirmedBy is missing, it's a required field."],
    },
    transactionDate: {
      type: Date,
      required: [true, "transactionDate is missing, it's a required field."],
      default: new Date(),
    },
    amount: {
      type: Number,
      required: [true, "amount is missing, it's a required field."],
    },
    amountType: {
      type: String,
      enum: {
        values: ["CREDIT", "DEBIT"],
        message: "amountType is missing, it's a required field.",
      },
      required: true,
    },
    transactionMethod: {
      type: String,
      enum: {
        values: ["CASH", "CARD", "UPI"],
        message: "transactionMethod is missing, it's a required field.",
      },
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "SUCCESS", "FAILED"],
        message: "status is missing, it's a required field.",
      },
      required: true,
    },
    transactionType: {
      type: String,
      enum: [
        "PURCHASE",
        "SALARY",
        "EXPENSE",
        "AMC",
        "AMC_RETURN",
        "SALE",
        "RETURN",
        "TECHNICIAN_PAID",
      ],
      // enum: {
      //   values: transactionTypes,
      //   message:
      //     "Invalid transactionType. Allowed values: " +
      //     transactionTypes.join(", "),
      // },
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

TransactionSchema.pre("save", async function (next) {
  const doc = this;

  // Only generate if it's a new doc and transactionId is not set
  if (doc.isNew && !doc.transactionId) {
    const counter = await Counter.findOneAndUpdate(
      { name: "stockAssignment" },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );

    const paddedNumber = String(counter.seq).padStart(6, "0"); // e.g., 000001
    doc.transactionId = `SA${paddedNumber}`;
  }

  next();
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);

module.exports = {
  Transaction,
  transactionMethods,
  transactionStatus,
  transactionTypes,
};
