const mongoose = require("mongoose");

const technicianStockMovementTypes = ["ASSIGN", "PAID", "RETURN"];

const TechnicianStockMovementSchema = new mongoose.Schema(
  {
    partId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Part",
      required: true,
    },
    quantity: { type: Number, required: true, default: 1 },

    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    movementType: {
      type: String,
      enum: ["ASSIGN", "PAID", "RETURN"],
      default: "ASSIGN",
      required: true,
    },
    recievedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    movementDate: {
      type: Date,
      required: true,
      default: new Date(),
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

TechnicianStockMovementSchema.pre("validate", function (next) {
  if (
    this.movementType === "PAID" &&
    (!this.transactionId || !this.recievedBy)
  ) {
    return next(
      new Error(
        "Transaction ID & Received User detail is required when movementType is PAID"
      )
    );
  } else if (this.movementType === "RETURN" && !this.recievedBy) {
    return next(
      new Error("Received User detail is required when movementType is RETURN.")
    );
  }
  next();
});

const TechnicianStockMovement =
  mongoose.models.TechnicianStockMovement ||
  mongoose.model("TechnicianStockMovement", TechnicianStockMovementSchema);

module.exports = { TechnicianStockMovement, technicianStockMovementTypes };
