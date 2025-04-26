const employeeRouter = require("express").Router();
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const Employee = require("../models/employee.model");

// Only Office & Admin employees can see all active accounts
employeeRouter.get(
  "/",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      let result;

      if (req.user.userType === "OFFICE") {
        result = await Employee.find({
          employeeType: { $in: ["OFFICE", "TECHNICIAN"] },
          active: true,
        })
          .populate({ path: "userId", model: "User" })
          .lean();
      } else {
        result = await Employee.find({
          active: true,
        })
          .populate({ path: "userId", model: "User" })
          .lean();
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      // console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error.",
      });
    }
  }
);

employeeRouter.get(
  "/technician",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      let result = await Employee.find({
        employeeType: "TECHNICIAN",
        active: true,
      })
        .populate({ path: "userId", model: "User" })
        .lean();
      console.log("result", result);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error.",
      });
    }
  }
);

// Technicians can see their profiles only. Office employee & Admins can see all employee profiles.
employeeRouter.get(
  "/:id/get",
  authenticateUser,
  authorizeRoles(["OFFICE", "TECHNICIAN", "ADMIN"]),
  async (req, res) => {
    try {
      let employeeId = req.params.id;
      if (req.user.userType === "TECHNICIAN") {
        id = req.user.id;
      }

      const result = await Employee.findById(employeeId);

      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "No record found." });
      }

      return res.status(200).json({ success: true, result });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error.", error });
    }
  }
);

// Update employee details. Technicians can update their profiles only.
employeeRouter.patch(
  "/:id/update",
  // authenticateUser,
  // authorizeRoles(["OFFICE", "TECHNICIAN", "ADMIN"]),
  async (req, res) => {
    try {
      let employeeId = req.params.id;
      if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId))
        return res.status(400).json({
          success: false,
          message: "Invalid customer id.",
        });
      if (
        (req.user?.userType === "TECHNICIAN" ||
          req.user?.userType === "OFFICE") &&
        employeeId !== req.user._id
      )
        return res.status(400).json({
          success: false,
          message: "You are not authorized to update others profile",
        });
      // id = req.user.id;

      const {
        name,
        mobile,
        address,
        pincode,
        joiningDate,
        inHandSalary,
        employeeType,
        email,
        gender,
        dob,
        startingSalary,
        baseSalary,
        currentCTC,
        userId,
        active,
      } = req.body;

      // Check if the employee record exists
      const accountExistCheck = await Employee.findOne({
        _id: employeeId,
      }).lean();
      if (!accountExistCheck)
        return res.status(404).json({
          success: false,
          message: "Account not found.",
        });

      // Prepare the update data
      const updateData = {};

      if (name) updateData.name = name;
      if (mobile && accountExistCheck.mobile !== mobile) {
        const mobileExistCheck = await Employee.findOne({
          mobile,
          _id: { $ne: employeeId },
        });
        if (mobileExistCheck)
          return res.status(400).json({
            success: false,
            message: `Mobile number already in use for account holder - ${mobileExistCheck.name}.`,
          });

        updateData.mobile = mobile;
      }
      if (address) updateData.address = address;
      if (pincode) updateData.pincode = pincode;
      if (inHandSalary) updateData.inHandSalary = inHandSalary;
      if (email) updateData.email = email;
      if (gender) updateData.gender = gender;
      if (dob) updateData.dob = dob;

      if (req.user.userType === "ADMIN") {
        if (startingSalary) updateData.startingSalary = startingSalary;
        if (baseSalary) updateData.baseSalary = baseSalary;
        if (currentCTC) updateData.currentCTC = currentCTC;
        if (joiningDate) updateData.joiningDate = new Date(joiningDate);
        if (employeeType) updateData.employeeType = employeeType;
        if (userId) updateData.userId = userId;
        if (active) updateData.active = active;
      }

      // Update the employee record
      const updatedEmployee = await Employee.findByIdAndUpdate(
        employeeId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedEmployee)
        return res.status(404).json({
          success: false,
          message: "Employee not found.",
        });

      return res.status(200).json({
        success: true,
        message: "Employee updated successfully.",
        data: updatedEmployee,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error,
      });
    }
  }
);

employeeRouter.post(
  "/add-employee",
  authenticateUser,
  // authorizeRoles(["ADMIN"]),
  async (req, res) => {
    try {
      const {
        name,
        mobile,
        address,
        pincode,
        joiningDate,
        inHandSalary,
        employeeType,
        email,
        gender,
        dob,
        startingSalary,
        baseSalary,
        currentCTC,
      } = req.body;

      console.log(req.user);
      if (
        !req.user ||
        (req.user.userType !== "OFFICE" && req.user.userType !== "ADMIN")
      )
        return res.status(400).json({
          success: false,
          message: "Not authorized",
        });

      if (
        !name ||
        !mobile ||
        !joiningDate ||
        !address ||
        !gender ||
        !pincode ||
        // !inHandSalary ||
        !employeeType
      )
        // Validate required fields
        return res.status(400).json({
          success: false,
          message: "All required fields must be provided.",
        });

      const employeeACexistCheck = await Employee.findOne({ mobile });
      if (employeeACexistCheck)
        return res.status(400).json({
          success: false,
          message: `One employee already exist with the provided mobile number.`,
        });

      // Create a new employee
      const newEmployee = new Employee({
        name,
        mobile,
        address,
        pincode,
        joiningDate: new Date(joiningDate) || new Date(),
        inHandSalary,
        employeeType,
        email,
        gender,
        dob,
        startingSalary,
        baseSalary,
        currentCTC,
        createdBy: req.user?._id,
      });
      await newEmployee.save();
      if (!newEmployee)
        return res.status(400).json({
          success: false,
          message: "Unable to create employee.",
        });

      return res.status(201).json({
        success: true,
        message: "New Employee added successfully.",
        data: newEmployee,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to create employee",
        error,
      });
    }
  }
);

module.exports = employeeRouter;
