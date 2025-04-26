const mongoose = require("mongoose");

// This will contain documents all the AMC's whether
const AmcSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    amount: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    firstAmc: { type: Boolean, required: true, default: false },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
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

const AMC = mongoose.models.AMC || mongoose.model("AMC", AmcSchema);
module.exports = AMC;
