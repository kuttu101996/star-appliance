const stockRouter = require("express").Router();
const { default: mongoose } = require("mongoose");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const Stock = require("../models/stock.model");
const StockMovement = require("../models/stockMovement.model");
const {
  TechnicianStockMovement,
} = require("../models/technicianStockMovement.model");
const {
  stockMovementFromLocation,
  stockMovementToLocation,
  stockMovementType,
} = require("./enums/enums");
const Employee = require("../models/employee.model");
const { Transaction } = require("../models/transaction.model");
const Part = require("../models/part.model");
const Return = require("../models/return.model");
const Sell = require("../models/sale.model");

stockRouter.get(
  "/all-stock",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const { partId, location, technicianId } = req.query;
      let result = [];
      if (partId) {
        if (!mongoose.Types.ObjectId.isValid(partId))
          return res.status(400).json({
            success: false,
            message: "Invalid partId.",
          });
        else
          result = await Stock.find({ partId })
            .populate({ path: "partId", model: "Part" })
            .lean();
        // .populate({ path: "technicianId", model: "Employee" })
      } else if (location) {
        if (!["MAIN", "OFFICE", "TECHNICIAN"].includes(location))
          return res.status(400).json({
            success: false,
            message: "Invalid location provided.",
          });
        else
          result = await Stock.find({ location })
            .populate({ path: "partId", model: "Part" })
            .lean();
        // .populate({ path: "technicianId", model: "Employee" })
      } else if (technicianId) {
        if (!mongoose.Types.ObjectId.isValid(technicianId))
          return res.status(400).json({
            success: false,
            message: "Invalid technicianId.",
          });
        else
          result = await Stock.find({ technicianId })
            .populate({ path: "partId", model: "Part" })
            .lean();
        // .populate({ path: "technicianId", model: "Employee" })
      } else {
        result = await Stock.find()
          .populate({ path: "partId", model: "Part" })
          .lean();
        // .populate({ path: "technicianId", model: "Employee" })
      }
      // const updatedResult = result.map(async (item) => {
      //   const getPart = await Part.findById(item.partId).lean();
      //   delete getPart._id;
      //   return { ...item, ...getPart };
      // });
      // await Promise.all(updatedResult);

      // console.log("Stock - ", updatedResult);
      return res.status(200).json({ success: true, message: "", data: result });
    } catch (error) {
      console.log("Error occured in /stock/all-stock", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error,
      });
    }
  }
);

stockRouter.get(
  "/all-office-stock",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      let result = await Stock.find({ location: "OFFICE" })
        .populate({ path: "partId", model: "Part" })
        .lean();

      return res.status(200).json({ success: true, message: "", data: result });
    } catch (error) {
      console.log("Error occured in /stock/all-stock", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error,
      });
    }
  }
);

stockRouter.get(
  "/all-main-stock",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      let result = await Stock.find({ location: "MAIN" })
        .populate({ path: "partId", model: "Part" })
        .lean();

      return res.status(200).json({ success: true, message: "", data: result });
    } catch (error) {
      console.log("Error occured in /stock/all-stock", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error,
      });
    }
  }
);

stockRouter.get(
  "/all-technician-stock",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      let result = await Stock.find({
        location: "TECHNICIAN",
        technicianId: { $ne: null },
      })
        .populate({ path: "partId", model: "Part" })
        // .populate({ path: "technicianId", model: "Employee" })
        .lean();

      return res.status(200).json({ success: true, message: "", data: result });
    } catch (error) {
      console.log("Error occured in /stock/all-stock", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error,
      });
    }
  }
);

stockRouter.patch(
  "/:partId/move-stock-internal",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    // 67ba12286ece132a68885e62

    try {
      const partId = req.params.partId;
      const { fromLocation, toLocation, quantity } = req.body;

      if (!partId || !mongoose.Types.ObjectId.isValid(partId))
        return res.status(400).json({
          success: false,
          message: "Invalid partId.",
        });

      if (
        !fromLocation ||
        !toLocation ||
        !["MAIN", "OFFICE"].includes(fromLocation) ||
        !["MAIN", "OFFICE"].includes(toLocation) ||
        fromLocation === toLocation
      )
        return res.status(400).json({
          success: false,
          message: "Invalid location provided.",
        });

      const fromStock = await Stock.findOne({
        partId: new mongoose.Types.ObjectId(partId),
        location: fromLocation,
      }).lean();
      if (!fromStock || fromStock.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: "Not enough stock available at the source location.",
        });
      }

      const moveFromStock = await Stock.findOneAndUpdate(
        { partId, location: fromLocation, quantity: { $gte: quantity } },
        { $inc: { quantity: -quantity } },
        { new: true }
      ).lean();
      const moveToStock = await Stock.findOneAndUpdate(
        { partId, location: toLocation },
        {
          $inc: { quantity: quantity },
          $setOnInsert: { createdBy: req.user?._id },
        },
        { new: true, upsert: true }
      ).lean();
      const newStockMovement = await new StockMovement({
        partId,
        fromLocation,
        toLocation,
        movementType: "TRANSFER",
        quantity,
        movementDate: new Date(),
        createdBy: req.user?._id,
      }).save();

      if (!moveFromStock || !moveToStock || !newStockMovement)
        return res.status(400).json({
          success: false,
          message: "Something went wrong, stock update failed.",
        });

      return res.status(200).json({
        success: true,
        message: "",
        data: { moveFromStock, moveToStock, newStockMovement },
      });
    } catch (error) {
      console.log("Error occured in /stock/all-stock", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error,
      });
    }
  }
);

stockRouter.patch(
  "/:partId/assign-stock-technician",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const partId = req.params.partId;
      const { technicianId, quantity, fromLocation, movementDate, remarks } =
        req.body;

      if (!partId || !mongoose.Types.ObjectId.isValid(partId))
        throw new Error("Invalid partId.");
      if (!technicianId || !mongoose.Types.ObjectId.isValid(technicianId))
        throw new Error("Invalid technicianId.");
      if (!quantity || typeof quantity !== "number")
        throw new Error("Invalid data type in quantity.");
      if (!fromLocation || !["MAIN", "OFFICE"].includes(fromLocation))
        throw new Error("Invalid fromLocation provided.");

      let date = new Date(movementDate);
      if (movementDate) {
        if (isNaN(date.getTime()))
          throw new Error("Invalid movementDate format.");
      }

      const existingStockQty = await Stock.findOne({
        partId,
        location: fromLocation,
      }).lean();

      if (!existingStockQty || existingStockQty.quantity < quantity) {
        throw new Error("Insufficiant quantity");
      }

      // 1. Decrease quantity from origin
      const updatedExistingStockQty = await Stock.findOneAndUpdate(
        {
          partId,
          location: fromLocation,
          // quantity: { $gte: quantity },
        },
        { $set: { quantity: existingStockQty.quantity - quantity } },
        { new: true, session }
      ).lean();

      if (!updatedExistingStockQty)
        throw new Error("Unable to update quantity from existing stock.");

      // 2. Add to technician stock (catch validation or logic errors)
      let updatedTechnicianStock;
      try {
        updatedTechnicianStock = await Stock.findOneAndUpdate(
          { partId, technicianId, location: "TECHNICIAN" },
          {
            $inc: { quantity: quantity },
            $setOnInsert: {
              partId,
              technicianId,
              location: "TECHNICIAN",
              createdBy: req.user?._id,
            },
          },
          { new: true, upsert: true, runValidators: true, session }
        );
      } catch (err) {
        console.error("Error updating technician stock:", err);
        throw new Error("Technician stock update failed.");
      }

      if (!updatedTechnicianStock)
        throw new Error("Technician stock update failed..");

      // 3. Save movements
      const newStockMovement = await new StockMovement({
        partId,
        fromLocation,
        toLocation: "TECHNICIAN",
        movementType: "ASSIGN",
        technicianId,
        quantity,
        movementDate: date,
        remarks,
        createdBy: req.user?._id,
      }).save({ session });

      const newTechnicianStockMovement = await new TechnicianStockMovement({
        partId,
        quantity,
        movementType: "ASSIGN",
        technicianId,
        movementDate: date,
        createdBy: req.user?._id,
      }).save({ session });

      if (!newStockMovement || !newTechnicianStockMovement)
        throw new Error("Failed to save stock movements.");

      await session.commitTransaction();

      return res.status(200).json({
        success: true,
        message: "",
        data: {
          updatedExistingStockQty,
          updatedTechnicianStock,
          newStockMovement,
          newTechnicianStockMovement,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      console.log("Error occured in /stock/assign-stock-technician", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error.",
        error,
      });
    } finally {
      session.endSession();
    }
  }
);

stockRouter.patch(
  "/:partId/technician-stock-return",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const partId = req.params.partId;
      const {
        technicianId,
        quantity,
        recievedBy,
        movementDate,
        transactionId,
        remarks,
      } = req.body;

      if (!partId || !mongoose.Types.ObjectId.isValid(partId))
        throw new Error("Invalid partId.");
      if (!technicianId || !mongoose.Types.ObjectId.isValid(technicianId))
        throw new Error("Invalid technicianId.");
      if (!recievedBy || !mongoose.Types.ObjectId.isValid(recievedBy))
        throw new Error("Invalid recievedBy.");
      if (!quantity || typeof quantity !== "number")
        return res.status(400).json({
          success: false,
          message: "Invalid data type in quantity.",
        });
      let date = new Date(movementDate);
      if (movementDate) {
        if (isNaN(date.getTime()))
          return res.status(400).json({
            success: false,
            message: "Invalid movementDate format.",
          });
      }
      if (transactionId) {
        const validTransactionId = await Transaction.findOne({
          transactionId,
        }).lean();
        if (!validTransactionId) throw new Error("Invalid transaction Id.");
      }

      const updateTechnicianStock = await Stock.findOneAndUpdate(
        {
          $and: [
            { partId },
            { technicianId },
            { location: "TECHNICIAN" },
            { quantity: { $gte: quantity } },
          ],
        },
        { $inc: { quantity: -quantity } },
        { new: true, session }
      ).lean();
      if (!updateTechnicianStock)
        throw new Error("Technician stock update failed..");

      const updateExistingStockQty = await Stock.findOneAndUpdate(
        { $and: [{ partId }, { location: "OFFICE" }] },
        { $inc: { quantity } },
        { new: true, runValidators: true, session }
      );
      if (!updateExistingStockQty)
        throw new Error(
          "Something went wrong, unable to update quantity from existing stock quantity."
        );

      const newStockMovement = new StockMovement({
        partId,
        fromLocation: "TECHNICIAN",
        toLocation: "OFFICE",
        movementType: "ASSIGN_RETUEN",
        technicianId,
        transactionId,
        quantity,
        movementDate: date,
        remarks,
        createdBy: req.user?._id,
      });
      await newStockMovement.save({ session });

      const newTechnicianStockMovement = new TechnicianStockMovement({
        partId,
        quantity,
        technicianId,
        movementType: "RETURN",
        recievedBy,
        transactionId,
        movementDate: date,
        createdBy: req.user?._id,
      });
      await newTechnicianStockMovement.save({ session });

      await new Return({
        partId,
        quantity,
        returnBy: technicianId,
        collectedBy: recievedBy,
        returnDate: date,
        transactionId: transactionId,
        returnDestination: "OFFICE",
        createdBy: req.user._id,
      }).save({ session });

      if (!newStockMovement || !newTechnicianStockMovement)
        throw new Error(
          "Something went wrong, unable to create stock movement"
        );

      await session.commitTransaction();

      return res.status(200).json({
        success: true,
        message: "",
        data: {
          updateExistingStockQty,
          updateTechnicianStock,
          newStockMovement,
          newTechnicianStockMovement,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      console.log("Error occured in /stock/all-movements", error);

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

stockRouter.patch(
  "/:partId/technician-stock-payment",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const partId = req.params.partId;
      const {
        soldTo,
        technicianId,
        recievedBy,
        quantity,

        transactionDetails,
      } = req.body;

      if (soldTo && !mongoose.Types.ObjectId.isValid(soldTo)) {
        console.log("soldTo - ", soldTo);
        throw new Error("Invalid soldTo.");
      }
      if (!partId || !mongoose.Types.ObjectId.isValid(partId)) {
        console.log("partId - ", partId);
        throw new Error("Invalid partId.");
      }
      if (!technicianId || !mongoose.Types.ObjectId.isValid(technicianId))
        throw new Error("Invalid technicianId.");
      if (recievedBy && !mongoose.Types.ObjectId.isValid(recievedBy))
        throw new Error("Invalid user ID at payment recievedBy field.");
      if (!quantity || typeof quantity !== "number")
        return res.status(400).json({
          success: false,
          message: "Invalid data type in quantity.",
        });
      if (
        !transactionDetails.amount ||
        typeof transactionDetails.amount !== "number"
      )
        return res.status(400).json({
          success: false,
          message: "Invalid transactionDetails.amount provided.",
        });
      if (
        !transactionDetails.transactionType ||
        !["SALE", "TECHNICIAN_PAID"].includes(
          transactionDetails.transactionType
        )
      )
        return res.status(400).json({
          success: false,
          message: "Invalid transactionDetails.transactionType provided.",
        });
      if (
        !transactionDetails.amountType ||
        !["CREDIT", "DEBIT"].includes(transactionDetails.amountType)
      )
        return res.status(400).json({
          success: false,
          message: "Invalid transactionDetails.amountType provided.",
        });
      if (
        !transactionDetails.transactionMethod ||
        !["CASH", "CARD", "UPI"].includes(transactionDetails.transactionMethod)
      )
        return res.status(400).json({
          success: false,
          message: "Invalid transactionDetails.transactionMethod provided.",
        });
      if (
        !transactionDetails.status ||
        !["PENDING", "SUCCESS", "FAILED"].includes(transactionDetails.status)
      )
        return res.status(400).json({
          success: false,
          message: "Invalid transactionDetails.status provided.",
        });
      let date = new Date(transactionDetails.transactionDate);
      if (!transactionDetails.transactionDate || isNaN(date.getTime()))
        return res.status(400).json({
          success: false,
          message: "Invalid transactionDetails.transactionDate format.",
        });

      const existTechnician = await Employee.findById(technicianId).lean();
      if (!existTechnician)
        return res.status(404).json({
          success: false,
          message: "No technician details found.",
        });

      const newTransaction = await new Transaction({
        paidBy: technicianId,
        recievedBy,
        transactionDate: date,
        amount: transactionDetails.amount,
        amountType: transactionDetails.amountType,
        transactionMethod: transactionDetails.transactionMethod,
        status: transactionDetails.status,
        transactionType: transactionDetails.transactionType,
        createdBy: req.user?._id,
      }).save({ session });

      if (!newTransaction)
        return res.status(400).json({
          success: false,
          message: "Failed to create transaction.",
        });

      const updateTechnicianStock = await Stock.findOneAndUpdate(
        {
          $and: [
            { partId },
            { technicianId },
            { location: "TECHNICIAN" },
            { quantity: { $gte: quantity } },
          ],
        },
        { $inc: { quantity: -quantity } },
        { new: true, runValidators: true, session }
      );
      if (!updateTechnicianStock)
        throw new Error("Technician stock update failed..");

      await new Sell({
        stockId: updateTechnicianStock._id,
        soldTo,
        soldBy: technicianId,
        sellDate: date,
        sellOrigin: "TECHNICIAN",
        sellAmount: transactionDetails.amount,
        sellPaymentStatus: "PAID",
        transactionId: newTransaction._id,
        createdBy: req.user?._id,
      }).save({ session });

      const newTechnicianStockMovement = new TechnicianStockMovement({
        partId,
        quantity,
        technicianId,
        movementType: "PAID",
        recievedBy,
        movementDate: date,
        transactionId: newTransaction._id,
        createdBy: req.user?._id,
      });
      await newTechnicianStockMovement.save({ session });

      if (!newTechnicianStockMovement)
        throw new Error(
          "Something went wrong, unable to create stock movement"
        );

      await session.commitTransaction();

      return res.status(200).json({
        success: true,
        message: "",
        data: {
          newTransaction,
          updateTechnicianStock,
          newTechnicianStockMovement,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      console.log("Error occured in /stock/all-movements", error);

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

stockRouter.get(
  "/all-movements",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const {
        partId,
        fromLocation,
        toLocation,
        movementType,
        technicianId,
        movementDate,
        createdBy,
      } = req.query;

      const date = new Date(movementDate);
      if (isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid movementDate format.",
        });
      }

      let result;
      if (partId) {
        if (!mongoose.Types.ObjectId.isValid(partId))
          return res.status(400).json({
            success: false,
            message: "Invalid partId.",
          });
        result = await StockMovement.find({ partId }).lean();
      } else if (toLocation && fromLocation) {
        if (
          !stockMovementFromLocation.includes(fromLocation) &&
          !stockMovementToLocation.includes(toLocation)
        )
          return res.status(400).json({
            success: false,
            message: "Invalid location provided.",
          });

        result = await StockMovement.find({
          $and: [{ fromLocation }, { toLocation }],
        }).lean();
      } else if (fromLocation) {
        if (!stockMovementFromLocation.includes(fromLocation))
          return res.status(400).json({
            success: false,
            message: "Invalid location provided.",
          });

        result = await StockMovement.find({
          fromLocation,
        }).lean();
      } else if (toLocation) {
        if (!stockMovementToLocation.includes(toLocation))
          return res.status(400).json({
            success: false,
            message: "Invalid location provided.",
          });

        result = await StockMovement.find({
          toLocation,
        }).lean();
      } else if (movementType) {
        if (!stockMovementType.includes(movementType))
          return res.status(400).json({
            success: false,
            message: "Invalid movement type provided.",
          });

        result = await StockMovement.find({
          movementType,
        }).lean();
      } else if (technicianId) {
        if (!mongoose.Types.ObjectId.isValid(technicianId))
          return res.status(400).json({
            success: false,
            message: "Invalid technicianId.",
          });
        result = await StockMovement.find({ technicianId }).lean();
      } else if (movementDate)
        result = await StockMovement.find({
          movementDate: date,
        }).lean();
      else if (createdBy) {
        if (!mongoose.Types.ObjectId.isValid(createdBy))
          return res.status(400).json({
            success: false,
            message: "Invalid ID provided in createdBy field.",
          });
        result = await StockMovement.find({ createdBy }).lean();
      } else result = await StockMovement.find().lean();

      return res.status(200).json({ success: true, message: "", data: result });
    } catch (error) {
      console.log("Error occured in /stock/all-movements", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error,
      });
    }
  }
);

stockRouter.post(
  "/:partId/technician-movement",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const partId = req.params.partId;
      const {
        technicianId,
        quantity,
        movementType,
        recievedBy,
        movementDate,
        transactionId,
        remarks,
      } = req.body;

      if (!partId || !mongoose.Types.ObjectId.isValid(partId))
        throw new Error("Invalid partId.");
      if (!technicianId || !mongoose.Types.ObjectId.isValid(technicianId))
        throw new Error("Invalid technicianId.");
      if (!recievedBy || !mongoose.Types.ObjectId.isValid(recievedBy))
        throw new Error("Invalid revceived by user details.");
      if (!quantity || typeof quantity !== "number")
        throw new Error("Invalid data type in quantity.");
      if (!movementType || !["RETURN", "PAID"].includes(movementType))
        throw new Error("Invalid movementType provided.");
      if (
        movementType === "PAID" &&
        (!transactionId || !mongoose.Types.ObjectId.isValid(transactionId))
      )
        throw new Error("Transaction details required against paid movement.");

      let date = new Date(movementDate);
      if (movementDate) {
        if (isNaN(date.getTime()))
          throw new Error("Invalid movementDate format.");
      }

      const updateExistingStockQty = await Stock.findOneAndUpdate(
        { $and: [{ partId }, { location: "OFFICE" }] },
        { $inc: { quantity } },
        { new: true, session }
      ).lean();
      if (!updateExistingStockQty)
        throw new Error(
          "Something went wrong, unable to update quantity from existing stock quantity."
        );
      const updateTechnicianStock = await Stock.findOneAndUpdate(
        { $and: [{ partId }, { technicianId }, { location: "TECHNICIAN" }] },
        { $inc: { quantity: -quantity } },
        { new: true, session } // ✅ Returns updated doc, creates new if not found
      );
      if (!updateTechnicianStock)
        throw new Error("Technician stock update failed..");

      const newStockMovement = new StockMovement({
        partId,
        fromLocation: "TECHNICIAN",
        toLocation: "OFFICE",
        movementType: "ASSIGN_RETUEN",
        technicianId,
        quantity,
        movementDate: date,
        remarks,
        createdBy: req.user?._id,
      });
      await newStockMovement.save({ session });

      const newTechnicianStockMovement = new TechnicianStockMovement({
        partId,
        quantity,
        movementType,
        recievedBy,
        movementDate: date,
        technicianId,
        transactionId,
        createdBy: req.user?._id,
      });
      await newTechnicianStockMovement.save({ session });

      if (!newStockMovement || !newTechnicianStockMovement)
        throw new Error(
          "Something went wrong, unable to create stock movement"
        );

      await session.commitTransaction();

      return res.status(200).json({
        success: true,
        message: "",
        data: {
          updateExistingStockQty,
          updateTechnicianStock,
          newStockMovement,
          newTechnicianStockMovement,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      console.log("Error occured in /stock/all-movements", error);

      return res.status(500).json({
        success: false,
        message: "Something went wrong, internal server error.",
        error,
      });
    } finally {
      session.endSession();
    }
  }
);

module.exports = stockRouter;
