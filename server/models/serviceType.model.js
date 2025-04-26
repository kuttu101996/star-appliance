const mongoose = require("mongoose");

const ServiceTypeSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
      unique: true,
    },
    rate: { type: Number, required: true, default: 0 },
    rateType: { type: String, enum: ["FIXED", "PERCENTAGE"], required: true },
    active: { type: Boolean, requried: true, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ServiceType =
  mongoose.models.ServiceType ||
  mongoose.model("ServiceType", ServiceTypeSchema);

module.exports = ServiceType;
