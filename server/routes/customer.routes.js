const customerRouter = require("express").Router();
const mongoose = require("mongoose");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const AMC = require("../models/amc.model");
const Customer = require("../models/customer.model");
const Transaction = require("../models/transaction.model");

// Get all users account active
customerRouter.get(
  "/",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    console.log(new Date());
    try {
      const result = await Customer.find({ active: true })
        .populate({ path: "userId", model: "User", seledt: "_id" })
        .lean();
      // console.log(result);
      return res.status(200).json({ success: true, data: result });
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

// Add new Customer
customerRouter.post(
  "/add-customer",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      let {
        name,
        mobile,
        address,
        pincode,
        model,
        serialNo,
        installationDate,
        customerType,

        email,
        gender,
        dob,
        lastServiceDate,
        totalAmcTaken,
        nextServiceDate,
        remarks,
      } = req.body;

      // Validate required fields
      if (
        !name ||
        !mobile ||
        !address ||
        !pincode ||
        !model ||
        !serialNo ||
        !installationDate ||
        !customerType
      )
        return res.status(400).json({
          success: false,
          message: "Missing required fields.",
        });

      const customerACexistCheck = await Customer.findOne({
        $or: [{ mobile }, { serialNo }],
      }).lean();
      if (customerACexistCheck)
        return res.status(409).json({
          success: false,
          message: `Customer already exist with the provided mobile number.`,
        });

      if (nextServiceDate) nextServiceDate = new Date(nextServiceDate);
      else {
        nextServiceDate = new Date(installationDate);
        nextServiceDate.setMonth(nextServiceDate.getMonth() + 4);
      }

      lastServiceDate = lastServiceDate ? new Date(lastServiceDate) : null;

      const newCustomer = new Customer({
        name,
        mobile,
        email,
        address,
        gender,
        dob,
        pincode,
        model,
        serialNo,
        installationDate: new Date(installationDate),
        nextServiceDate,
        lastServiceDate,
        totalAmcTaken,
        remarks,
        customerType,
        createdBy: req.user?._id,
      });
      await newCustomer.save();
      if (!newCustomer)
        return res.status(400).json({
          success: false,
          message: "Something went wrong, unable to create customer.",
        });

      return res.status(201).json({
        success: true,
        message: "New Customer added successfully.",
        data: newCustomer,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error.",
      });
    }
  }
);

customerRouter.patch(
  "/:id/update-customer",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const customerId = req.params.id;
      if (!customerId || !mongoose.Types.ObjectId.isValid(customerId))
        return res.status(400).json({
          success: false,
          message: "Invalid customer id.",
        });

      const {
        name,
        mobile,
        address,
        pincode,
        model,
        serialNo,
        installationDate,
        customerType,

        email,
        gender,
        dob,
        lastServiceDate,
        totalAmcTaken,
        nextServiceDate,
        remarks,
        userId,
        active,
      } = req.body;

      console.log("customerId - ", customerId);
      const accountExistCheck = await Customer.findOne({
        _id: customerId,
      }).lean();
      if (!accountExistCheck)
        return res.status(404).json({
          success: false,
          message: "Account not found.",
        });

      const updates = {};
      if (name) updates.name = name;
      if (mobile && accountExistCheck.mobile !== mobile) {
        const mobileExistCheck = await Customer.findOne({
          mobile,
          _id: { $ne: customerId },
        });
        if (mobileExistCheck)
          return res.status(400).json({
            success: false,
            message: `Mobile number already in use for account holder - ${mobileExistCheck.name}.`,
          });

        updates.mobile = mobile;
      }
      if (email && accountExistCheck.email !== email) {
        const emailExistCheck = await Customer.findOne({
          email,
          _id: { $ne: customerId },
        });
        if (emailExistCheck)
          return res.status(400).json({
            success: false,
            message: `Email ID already in use for account holder - ${emailExistCheck.name}.`,
          });

        updates.email = email;
      }
      if (address) updates.address = address;
      if (gender) updates.gender = gender;
      if (dob) updates.dob = dob;
      if (pincode) updates.pincode = pincode;
      if (model) updates.model = model;
      if (serialNo) {
        const serialNoExistCheck = await Customer.findOne({
          serialNo,
          _id: { $ne: customerId },
        });
        if (serialNoExistCheck)
          return res.status(400).json({
            success: false,
            message: `Serial Number already attached for account holder - ${serialNoExistCheck.name}.`,
          });

        updates.serialNo = serialNo;
      }
      if (installationDate) updates.installationDate = installationDate;
      if (nextServiceDate) updates.nextServiceDate = nextServiceDate;
      if (remarks) updates.remarks = remarks;
      if (customerType) updates.customerType = customerType;
      if (lastServiceDate) updates.lastServiceDate = lastServiceDate;
      if (totalAmcTaken) updates.totalAmcTaken = totalAmcTaken;

      if (userId && mongoose.Types.ObjectId.isValid(userId))
        updates.userId = userId;
      if (active) updates.active = active;

      const updatedCustomer = await Customer.findByIdAndUpdate(
        customerId,
        { $set: { ...updates } },
        { new: true, runValidators: true }
      );

      if (!updatedCustomer)
        return res.status(400).json({
          success: false,
          message: "Something went wrong, unable to update customer details",
        });

      return res.status(200).json({
        success: true,
        message: "Customer details updated successfully",
        data: updatedCustomer,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Internal server error.",
      });
    }
  }
);

customerRouter.delete("/:id/delete-customer", (req, res) => {});

// Add new AMC customer / Update existing AMC customer
customerRouter.post(
  "/:id/add-amc",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const customerId = req.params.id;
      const {
        amount,
        startDate,
        endDate,
        firstAmc,
        transactionId,

        paidBy, // userId
        recivedBy, // userId
        confirmedBy, // employeeId required
        transactionDate, // default now required
        transactionMethod, // ["CASH", "CARD", "UPI"], required
        status, // ["PENDING", "PAID", "FAILED"] required
        amountType, // ["CREDIT", "DEBIT"] },
        transactionType, // ["SALARY", "EXPENSE", "AMC" "AMC_RETURN", "SALE", "RETURN"] required
      } = req.body;

      if (!customerId || !mongoose.Types.ObjectId.isValid(customerId))
        throw new Error("Missing valid customer ID.");

      if (!amount || !startDate || !endDate)
        throw new Error("Required details missing.");

      if (
        !transactionId &&
        (!paidBy ||
          !recivedBy ||
          !confirmedBy ||
          !transactionDate ||
          !transactionMethod ||
          !status ||
          !amountType ||
          !transactionType)
      )
        throw new Error("Required details missing.");

      const validMethods = ["CASH", "CARD", "UPI"];
      const validStatus = ["PENDING", "PAID", "FAILED"];
      const validAmountTypes = ["CREDIT", "DEBIT"];
      const validTransactionTypes = ["SALARY", "EXPENSE", "SALE", "RETURN"];

      if (!validMethods.includes(transactionMethod))
        throw new Error("Invalid transaction method.");

      if (!validStatus.includes(status)) throw new Error("Invalid status.");

      if (!validAmountTypes.includes(amountType))
        throw new Error("Invalid amount type.");

      if (!validTransactionTypes.includes(transactionType))
        throw new Error("Invalid transaction type.");

      let newTransaction;
      if (!transactionId) {
        convertedTransactionDate = new Date(transactionDate) || new Date();

        newTransaction = new Transaction({
          paidBy,
          recivedBy,
          confirmedBy,
          transactionDate: convertedTransactionDate,
          amount,
          transactionMethod,
          status,
          amountType,
          transactionType,
        });
        await newTransaction.save({ session });

        if (!newTransaction)
          throw new Error(
            "Something went wrong, unable to create Transaction."
          );
      }

      const newAmc = new AMC({
        customerId,
        amount,
        startDate,
        endDate,
        firstAmc,
        transactionId:
          transactionId || (newTransaction ? newTransaction._id : null),
        createdBy: req.user?._id,
      });
      await newAmc.save({ session });
      if (!newAmc)
        throw new Error("Something went wrong, unable to create AMC.");

      const existingCustomer = await Customer.findByIdAndUpdate(
        customerId,
        { customerType: "AMC" },
        { new: true, session }
      );
      if (!existingCustomer)
        throw new Error("No customer found with the given ID.");

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        success: true,
        message: "AMC created successfully.",
        data: newAmc,
      });
    } catch (error) {
      console.error("Error occured /add-amc: ", error.stack);
      await session.abortTransaction();
      session.endSession();

      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error.",
      });
    }
  }
);

module.exports = customerRouter;
