const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const User = require("../models/user.model");
const Customer = require("../models/customer.model");
const Employee = require("../models/employee.model");
const { default: mongoose } = require("mongoose");

// Get all users account active
userRouter.get(
  "/",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const users = await User.find({ active: true })
        .populate({ path: "employeeId", model: "Employee" })
        .populate({ path: "customerId", model: "Customer" })
        .lean();

      // Exclude the password field from each user object
      const result = users.map(
        ({ password, ...userWithoutPassword }) => userWithoutPassword
      );

      return res.status(200).json({
        success: true,
        message: "Success",
        data: result,
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

// Add/Create new user account. Only Office & Admin can create new user.
userRouter.post(
  "/create-user",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const { password, employeeId, customerId } = req.body;

      if (!password)
        return res.status(400).json({
          success: false,
          message: "Required details are missing.",
        });

      if ((employeeId && customerId) || (!employeeId && !customerId))
        return res.status(400).json({
          success: false,
          message:
            "You must provide either a employeeId or an customerId, not both or neither.",
        });

      if (
        (employeeId && !mongoose.Types.ObjectId.isValid(employeeId)) ||
        (customerId && !mongoose.Types.ObjectId.isValid(customerId))
      )
        return res.status(400).json({
          success: false,
          message: "Invalid ID provided",
        });

      let userACexistsCheck;
      if (customerId)
        userACexistsCheck = await User.findOne({
          customerId,
        }).lean();
      else if (employeeId)
        userACexistsCheck = await User.findOne({ employeeId }).lean();

      if (userACexistsCheck)
        return res.status(400).json({
          success: false,
          message: `One user account already present against this ${
            employeeId ? "Employee ID" : "Customer ID"
          }.`,
        });

      let determinedUserType;
      let userDetails;
      if (customerId) {
        userDetails = await Customer.findOne({ _id: customerId });

        if (!userDetails)
          return res.status(404).json({
            success: false,
            message: "Customer not found.",
          });

        determinedUserType = "CUSTOMER";
      } else if (employeeId) {
        userDetails = await Employee.findOne({ _id: employeeId });

        if (!userDetails)
          return res.status(404).json({
            success: false,
            message: "Employee not found.",
          });

        determinedUserType = userDetails.employeeType;
      }

      encryptedPass = await bcrypt.hash(password, 10);
      const newUser = new User({
        password: encryptedPass,
        email: userDetails.email,
        mobile: userDetails.mobile,
        displayName: userDetails.name,
        userType: determinedUserType,
        customerId: customerId || undefined,
        employeeId: employeeId || undefined,
        createdBy: req.user?._id,
      });
      await newUser.save();
      if (!newUser)
        return res.status(400).json({
          success: false,
          message: "Something went wrong, unable to create user account",
        });

      await userDetails.updateOne({ userId: newUser._id });

      const data = newUser.toObject();
      delete data.password;

      return res.status(201).json({
        success: true,
        message: "Insertion successful",
        data,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create user",
        error,
      });
    }
  }
);

// Update user details
userRouter.patch(
  "/update-user/:id",
  // authenticateUser,
  // authorizeRoles(["TECHNICIAN", "OFFICE", "CUSTOMER", "ADMIN"]),
  async (req, res) => {
    try {
      let userId = req.params.id;
      const { password, email, mobile, displayName } = req.body;

      if (!password && !email && !mobile && !displayName)
        return res.status(400).json({
          success: false,
          message: "No data to update.",
        });

      if (!userId || !mongoose.Types.ObjectId.isValid(userId))
        return res.status(400).json({
          success: false,
          message: "Invalid user id.",
        });

      // If the user is not an admin, they can only update their own details
      if (["TECHNICIAN", "OFFICE", "CUSTOMER"].includes(req.user?.userType))
        userId = req.user._id;

      // Check if user exists
      const userExistCheck = await User.findOne({
        _id: userId,
      });
      if (!userExistCheck)
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });

      const existingUser = await User.findOne({
        _id: { $ne: userId },
        $or: [{ email }, { mobile }],
      });

      if (existingUser) {
        let field = existingUser.email === email ? "Email" : "Mobile number";

        return res.status(400).json({
          success: false,
          message: `${field} already exists!`,
        });
      }
      if (password) encryptedPass = await bcrypt.hash(password, 10);

      // Update user details
      let updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { email, mobile, password: encryptedPass } },
        { new: true, runValidators: true }
      ).lean();
      if (!updatedUser)
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });
      delete updatedUser.password;

      return res.status(200).json({
        success: true,
        message: "User account updated successfully.",
        data: updatedUser,
      });
    } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  }
);

// Deactive user account
userRouter.delete(
  "/delete-user/:id",
  authenticateUser,
  authorizeRoles(["TECHNICIAN", "OFFICE", "CUSTOMER", "ADMIN"]),
  async (req, res) => {
    try {
      let userId = req.params.id;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId))
        return res.status(400).json({
          success: false,
          message: "Invalid user ID.",
        });

      if (["TECHNICIAN", "CUSTOMER"].includes(req.user?.userType))
        userId = req.user._id;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { active: false },
        { new: true, runValidators: true }
      ).lean();
      if (!updatedUser)
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });

      return res.status(200).json({ success: true, message: "Success" });
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

userRouter.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    console.log(mobile);
    console.log(password);

    if (!mobile || !password)
      return res.status(400).json({
        success: false,
        message: "Required details missing.",
      });

    const userExistCheck = await User.findOne({ mobile })
      .populate({ path: "employeeId", model: "Employee" }) // Assuming Employee is referenced in the schema
      .populate({ path: "customerId", model: "Customer" }) // Assuming Customer is referenced in the schema
      .lean();

    console.log(userExistCheck);
    if (!userExistCheck || !userExistCheck.active)
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });

    const match = await bcrypt.compare(password, userExistCheck.password);
    if (userExistCheck.password === password || match) {
      // Exclude password before sending the user data in the response
      const data = userExistCheck;
      delete data.password;

      var token = jwt.sign(
        { userId: userExistCheck._id, userType: userExistCheck.userType },
        process.env.TOKEN_KEY,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        token,
        data,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Login failed, credential mismatch.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error,
    });
  }
});

module.exports = userRouter;
