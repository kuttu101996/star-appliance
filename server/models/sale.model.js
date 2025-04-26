const mongoose = require("mongoose");

const SellSchema = new mongoose.Schema(
  {
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
    soldTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    sellDate: { type: Date, required: true, default: new Date() },
    sellOrigin: {
      type: String,
      enum: ["OFFICE", "TECHNICIAN"],
      required: true,
    },
    sellAmount: { type: Number, required: true },
    sellPaymentStatus: {
      type: String,
      enum: ["DUE", "PAID"],
      required: true,
      default: "DUE",
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

SellSchema.pre("validate", function (next) {
  if (this.salePaymentStatus === "PAID" && !this.transactionId)
    return next(
      new Error(
        "Technician ID is required when payment status against a sale is PAID."
      )
    );
  next();
});

const Sell = mongoose.models.Sell || mongoose.model("Sell", SellSchema);

module.exports = Sell;
