const partsRouter = require("express").Router();
const mongoose = require("mongoose");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const Part = require("../models/part.model");
const Stock = require("../models/stock.model");
const Employee = require("../models/employee.model");

partsRouter.get(
  "/all-parts",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const result = await Part.find({ active: true });
      return res.status(200).json({
        success: true,
        message: "Success",
        data: result,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error.", error });
    }
  }
);

partsRouter.post(
  "/new-part",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const {
        itemName,
        itemCode,
        description,
        costPrice,
        internalSellingPrice,
        externalSellingPrice,
      } = req.body;
      if (
        !itemName ||
        !itemCode ||
        !costPrice ||
        (!internalSellingPrice && !externalSellingPrice)
      )
        return res.status(400).json({
          success: false,
          message: "Required details missing",
        });

      const existCheck = await Part.findOne({
        $or: [{ itemName }, { itemCode }],
      }).lean();

      if (existCheck)
        return res.status(400).json({
          success: false,
          message: "Item name or Item code already exist",
        });

      const newPart = new Part({
        itemName,
        itemCode,
        description,
        costPrice,
        internalSellingPrice,
        externalSellingPrice,
        createdBy: req.user?._id,
      });
      await newPart.save({ session });

      if (!newPart)
        return res.status(400).json({
          success: false,
          message: "Something went wrong, unable to create new part.",
        });

      const technicians = await Employee.find({
        employeeType: "TECHNICIAN",
      }).lean();

      const stockDocs = [];
      technicians.map((technician) => {
        stockDocs.push({
          partId: newPart._id,
          location: "TECHNICIAN",
          technicianId: technician._id,
          quantity: 0,
          createdBy: req.user?._id,
        });
        technician._id;
      });
      stockDocs.push({
        partId: newPart?._id,
        location: "MAIN",
        quantity: 0,
        createdBy: req.user?._id,
      });
      stockDocs.push({
        partId: newPart?._id,
        location: "OFFICE",
        quantity: 0,
        createdBy: req.user?._id,
      });

      await Stock.insertMany(stockDocs, { session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "Part successfully created.",
        data: newPart,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error,
      });
    } finally {
      session.endSession();
    }
  }
);

module.exports = partsRouter;
