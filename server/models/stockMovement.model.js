const mongoose = require("mongoose");

const StockMovementSchema = new mongoose.Schema(
  {
    partId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Part",
      required: true,
    },

    fromLocation: {
      type: String,
      enum: ["PURCHASE", "MAIN", "OFFICE", "TECHNICIAN", "SALE_RETURN"],
      required: true,
    },

    toLocation: {
      type: String,
      enum: ["PURCHASE_RETURN", "MAIN", "OFFICE", "TECHNICIAN", "SALE"],
      required: true,
    },

    movementType: {
      type: String,
      enum: [
        "PURCHASE",
        "PURCHASE_RETURN",
        "ASSIGN",
        "ASSIGN_RETUEN",
        "TRANSFER",
        "SALE",
        "SALE_RETURN",
      ],
      required: true,
    },

    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    }, // Only required for movements from technicians

    quantity: { type: Number, required: true },
    movementDate: {
      type: Date,
      required: true,
      default: new Date(),
    },
    // movedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Employee",
    //   required: true,
    // },
    remarks: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

StockMovementSchema.pre("validate", function (next) {
  if (
    (this.toLocation === "TECHNICIAN" || this.fromLocation === "TECHNICIAN") &&
    !this.technicianId
  )
    return next(
      new Error("Technician ID is required when location is TECHNICIAN")
    );
  next();
});

const StockMovement =
  mongoose.models.StockMovement ||
  mongoose.model("StockMovement", StockMovementSchema);

module.exports = StockMovement;
