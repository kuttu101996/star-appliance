const mongoose = require("mongoose");

const ServiceRecordSchema = new mongoose.Schema(
  {
    serviceRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },

    serviceDueDate: { type: Date, required: true },
    actualServiceDate: { type: Date, required: true, default: new Date() },
    serviceDescription: String,

    partsUsed: [
      {
        partId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Part",
        },
        price: Number,
        _id: false,
      },
    ], // Inventory[]
    totalCos: { type: Number, required: true },
    serviceDoneBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ServiceRecord =
  mongoose.models.ServiceRecord ||
  mongoose.model("ServiceRecord", ServiceRecordSchema);

module.exports = ServiceRecord;
