const mongoose = require("mongoose");

const SalarySchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    paidLeave: { type: Number, required: true },
    lwp: { type: Number, required: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Salary = mongoose.models.Salary || mongoose.model("Salary", SalarySchema);

module.exports = Salary;
