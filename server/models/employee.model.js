const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: Number, required: true, unique: true },
    email: { type: String, unique: true },
    address: String,
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
    dob: Date,
    pincode: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    startingSalary: String,
    baseSalary: String,
    inHandSalary: String,
    currentCTC: String,
    employeeType: {
      type: String,
      enum: ["ADMIN", "OFFICE", "TECHNICIAN"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
