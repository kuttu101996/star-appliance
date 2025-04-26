const mongoose = require("mongoose");

const ReturnSchema = new mongoose.Schema(
  {
    partId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Part",
      required: true,
    },
    quantity: { type: Number, required: true },
    returnBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    returnDate: { type: Date, required: true, default: new Date() },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },

    returnDestination: {
      type: String,
      enum: ["OFFICE", "MAIN"],
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

const Return = mongoose.models.Return || mongoose.model("Return", ReturnSchema);

module.exports = Return;
