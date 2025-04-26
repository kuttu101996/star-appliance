const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema(
  {
    partId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Part",
      required: true,
    },
    location: {
      type: String,
      enum: ["MAIN", "OFFICE", "TECHNICIAN"],
      required: true,
    },

    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    }, // Only required for movements from technicians
    quantity: { type: Number, required: true, default: 0, min: 0 },
    active: { type: Boolean, requried: true, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

StockSchema.pre("validate", function (next) {
  if (this.location === "TECHNICIAN" && !this.technicianId)
    return next(
      new Error("Technician ID is required when location is TECHNICIAN")
    );
  next();
});

// Compound index to ensure unique combination of technicianId and partId when location is Technician
StockSchema.index(
  { partId: 1, location: 1, technicianId: 1 },
  { unique: true }
);

const Stock = mongoose.models.Stock || mongoose.model("Stock", StockSchema);
module.exports = Stock;
