const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema(
  {
    detail: [
      {
        partId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Part",
          required: true,
        },
        quantity: { type: Number, required: true },
        unitCost: Number,
        _id: false,
      },
    ],

    billNo: { type: String, required: true, unique: true },
    purchaseDate: { type: Date, required: true, default: new Date() },
    totalCost: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["DUE", "PAID"],
      required: true,
      default: "DUE",
    },
    transactionIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

PurchaseSchema.index({ billNo: 1 }, { unique: true });

const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", PurchaseSchema);

module.exports = Purchase;
