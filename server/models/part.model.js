const mongoose = require("mongoose");

const PartSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true, unique: true },
    itemCode: { type: String, required: true, unique: true },
    description: String,
    costPrice: { type: Number, required: true },
    internalSellingPrice: { type: Number, required: true },
    externalSellingPrice: { type: Number, required: true },
    active: { type: Boolean, required: true, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Part = mongoose.models.Part || mongoose.model("Part", PartSchema);

module.exports = Part;
