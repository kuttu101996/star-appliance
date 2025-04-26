const mongoose = require("mongoose");

const ServiceRequestSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    requestDate: {
      type: Date,
      required: true,
      set: (value) => {
        const date = new Date(value);

        // Ensure the date is valid before calling setHours
        if (isNaN(date.getTime())) {
          throw new Error("Invalid Date"); // Optionally throw an error for invalid date
        }
        // Ensure requestDate only contains the date (without time)
        date.setHours(0, 0, 0, 0);

        return date;
      },
    },

    serviceTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceType",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ASSIGNED", "COMPLETED", "CANCELED"],
      required: true,
    },

    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
      validate: {
        validator: function (value) {
          // If status is "ASSIGNED", technicianId must be provided
          if (this.status === "ASSIGNED" && !value) {
            return false;
          }
          return true;
        },
        message: "Technician is required when status is ASSIGNED.",
      },
    },

    cusDescription: String,
    resolutionNotes: String,
    cancelReason: String,

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

ServiceRequestSchema.index(
  { customerId: 1, requestDate: 1, serviceTypeId: 1 },
  { unique: true }
);

const ServiceRequest =
  mongoose.models.ServiceRequest ||
  mongoose.model("ServiceRequest", ServiceRequestSchema);

module.exports = ServiceRequest;
