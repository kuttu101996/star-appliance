const stockMovementRouter = require("express").Router();
const mongoose = require("mongoose");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../middlewares/auth.middleware");
const Part = require("../../models/part.model");
const Stock = require("../../models/stock.model");

stockMovementRouter.get(
  "/",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  }
);
