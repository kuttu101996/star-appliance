const transactionRouter = require("express").Router();
const mongoose = require("mongoose");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const {
  Transaction,
  transactionMethods,
  transactionStatus,
  transactionTypes,
} = require("../models/transaction.model");

transactionRouter.get(
  "/all-transaction",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const {
        paidBy,
        recievedBy,
        transactionDate,
        transactionMethod,
        status,
        transactionType,
      } = req.query || {};

      const filterQuery = {};
      if (paidBy && mongoose.Types.ObjectId.isValid(paidBy))
        filterQuery["paidBy"] = paidBy;
      if (recievedBy && mongoose.Types.ObjectId.isValid(recievedBy))
        filterQuery["recievedBy"] = recievedBy;
      if (
        transactionDate &&
        transactionDate !== "undefined" &&
        transactionDate !== "null"
      ) {
        console.log("transactionDate - ", transactionDate);
        const startOfDay = new Date(transactionDate); // "YYYY-MM-DD" to Date at 00:00:00
        const endOfDay = new Date(transactionDate);
        endOfDay.setHours(23, 59, 59, 999); // Set to 23:59:59.999

        filterQuery["transactionDate"] = {
          $gte: startOfDay,
          $lte: endOfDay,
        };
      }
      if (transactionMethod && transactionMethods.includes(transactionMethod))
        filterQuery["transactionMethod"] = transactionMethod;
      if (status && transactionStatus.includes(status))
        filterQuery["status"] = status;
      if (transactionType && transactionTypes.includes(transactionType))
        filterQuery["transactionType"] = transactionType;

      console.log("filterQuery - ", filterQuery);
      const allTransactions = await Transaction.find(filterQuery).lean();

      if (!allTransactions || !allTransactions.length)
        return res.status(400).json({
          success: false,
          message: "No data found!",
        });

      return res.status(200).json({
        success: true,
        message: "All transactions.",
        data: allTransactions,
      });
    } catch (error) {
      console.error(
        "Error occured /transaction/all-transaction: ",
        error.stack
      );
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error.",
      });
    }
  }
);

transactionRouter.get(
  "/all-technician-payment-transaction",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const {
        paidBy,
        recievedBy,
        transactionDate,
        transactionMethod,
        status,
        transactionType,
      } = req.query || {};

      const filterQuery = {};
      if (paidBy && mongoose.Types.ObjectId.isValid(paidBy))
        filterQuery["paidBy"] = paidBy;
      if (recievedBy && mongoose.Types.ObjectId.isValid(recievedBy))
        filterQuery["recievedBy"] = recievedBy;
      if (transactionDate) {
        const startOfDay = new Date(transactionDate); // "YYYY-MM-DD" to Date at 00:00:00
        const endOfDay = new Date(transactionDate);
        endOfDay.setHours(23, 59, 59, 999); // Set to 23:59:59.999

        filterQuery[transactionDate] = {
          $gte: startOfDay,
          $lte: endOfDay,
        };
      }
      if (transactionMethod && transactionMethods.includes(transactionMethod))
        filterQuery["transactionMethod"] = transactionMethod;
      if (status && transactionStatus.includes(status))
        filterQuery["status"] = status;
      if (transactionType && transactionTypes.includes(transactionType))
        filterQuery["transactionType"] = transactionType;

      const allTransactions = await Transaction.find(filterQuery).lean();

      if (!allTransactions || !allTransactions.length)
        return res.status(400).json({
          success: false,
          message: "No data found!",
        });

      return res.status(200).json({
        success: true,
        message: "All transactions.",
        data: allTransactions,
      });
    } catch (error) {
      console.error(
        "Error occured /transaction/all-transaction: ",
        error.stack
      );
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error.",
      });
    }
  }
);

transactionRouter.post(
  "/create-transaction",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const {
        paidBy,
        recievedBy,
        transactionDate,
        amount,
        amountType,
        transactionMethod,
        status,
        transactionType,
      } = req.body || {};

      if (!paidBy || !mongoose.Types.ObjectId.isValid(paidBy))
        return res.status(400).json({
          success: false,
          message: "Missing Paid By fields.",
        });
      if (!recievedBy || !mongoose.Types.ObjectId.isValid(recievedBy)) {
        console.log("recievedBy - ", recievedBy);
        return res.status(400).json({
          success: false,
          message: "Missing Recived By fields.",
          data: recievedBy,
        });
      }
      if (
        !transactionDate ||
        !amount ||
        typeof amount !== "number" ||
        !amountType ||
        !["CREDIT", "DEBIT"].includes(amountType)
      )
        return res.status(400).json({
          success: false,
          message: "Missing Transaction date amount amount type fields.",
        });
      if (!transactionMethod || !transactionMethods.includes(transactionMethod))
        return res.status(400).json({
          success: false,
          message: "Missing transactionMethod fields.",
        });
      if (!status || !transactionStatus.includes(status))
        return res.status(400).json({
          success: false,
          message: "Missing status fields.",
        });
      if (!transactionType || !transactionTypes.includes(transactionType))
        return res.status(400).json({
          success: false,
          message: "Missing transactionType fields.",
        });

      let payloadToSave = {
        ...req.body,
        transactionDate: new Date(transactionDate),
        createdBy: req.user._id,
      };
      const newTransaction = await new Transaction(payloadToSave).save();

      if (!newTransaction)
        return res.status(400).json({
          success: false,
          message: "Unable to initiate the transaction.",
        });

      return res.status(200).json({
        success: true,
        message: "Transaction successfully created.",
        data: newTransaction,
      });
    } catch (error) {
      console.error(
        "Error occured /transaction/all-transaction: ",
        error.stack
      );
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error.",
      });
    }
  }
);

module.exports = transactionRouter;
