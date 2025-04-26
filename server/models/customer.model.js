const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, unique: true, default: null },
    address: { type: String, required: true },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
    dob: Date,
    pincode: { type: String, required: true },
    model: { type: String, required: true },
    serialNo: { type: String, required: true, unique: true },
    installationDate: { type: Date, required: true },
    lastServiceDate: { type: Date, default: null },
    nextServiceDate: { type: Date, required: true },

    totalAmcTaken: { type: Number, required: true, default: 0 },
    remarks: String,

    customerType: {
      type: String,
      enum: ["IN_WARRANTY", "AMC", "OUT_OF_WARRANTY", "EXTENDED_WARRANTY"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    active: { type: Boolean, required: true, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Customer =
  mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
