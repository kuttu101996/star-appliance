const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    password: { type: String, required: true },
    email: { type: String, unique: true },
    mobile: { type: String, required: true, unique: true },
    displayName: String,
    profilePic: String,

    userType: {
      type: String,
      enum: ["CUSTOMER", "TECHNICIAN", "OFFICE", "ADMIN"],
      required: true,
    },
    active: { type: Boolean, required: true, default: true },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
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

UserSchema.pre("validate", function (next) {
  if (!this.customerId && !this.employeeId) {
    return next(new Error("Either customerId or employeeId must be provided."));
  }
  next();
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
module.exports = User;
