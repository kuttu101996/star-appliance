const purchaseRouter = require("express").Router();
const mongoose = require("mongoose");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const Part = require("../models/part.model");
const Purchase = require("../models/purchase.model");
const Stock = require("../models/stock.model");
const StockMovement = require("../models/stockMovement.model");
const Employee = require("../models/employee.model");

purchaseRouter.get("/all-purchase-entries", async (req, res) => {
  try {
    const allPurchaseEntries = await Purchase.find();

    return res
      .status(200)
      .json({ success: true, message: "Success", data: allPurchaseEntries });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
});

purchaseRouter.get("/all-purchase-entries/:partId", async (req, res) => {
  try {
    const { partId } = req.params;
    if (!partId || !mongoose.Types.ObjectId.isValid(partId))
      return res.status(400).json({
        success: false,
        message: "Invalid partId.",
      });

    const allPurchaseEntries = await Purchase.find({
      "detail.partId": partId,
    })
      .populate("createdBy", ["name", "email"]) // both are write
      .populate("detail.partId", "itemName itemCode"); // both are write

    return res
      .status(200)
      .json({ success: true, message: "Success", data: allPurchaseEntries });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
});

purchaseRouter.post(
  "/new-purchase",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        detail,
        billNo,
        purchaseDate,
        totalCost,
        transactionId,
        paymentStatus,
        movementRemarks,
      } = req.body;

      if (!billNo || !purchaseDate || !totalCost)
        return res.status(400).json({
          success: false,
          message: "Required details missing.",
        });

      // /^[01]$/.test(paymentStatus)
      if (!paymentStatus || !["DUE", "PAID"].includes(paymentStatus))
        return res.status(400).json({
          success: false,
          message: "Invalid payment status passed.",
        });

      if (!detail || !Array.isArray(detail) || detail.length === 0)
        return res.status(400).json({
          success: false,
          message: "Purchase detail is missing",
        });

      if (transactionId && !mongoose.Types.ObjectId.isValid(transactionId))
        return res.status(400).json({
          success: false,
          message: "Incvalid transaction ID provided.",
        });

      let billTotal = 0;
      for (let i = 0; i < detail.length; i++) {
        const item = detail[i];

        if (!item.partId || !mongoose.Types.ObjectId.isValid(item.partId))
          return res.status(400).json({
            success: false,
            message: "Invalid partId, at index - " + i,
          });

        const itemPresentCheck = await Part.findById(item.partId)
          .lean()
          .session(session);
        if (!itemPresentCheck)
          return res.status(400).json({
            success: false,
            message: `Selected parts does not exist, at index - ${i}`,
          });

        if (isNaN(Number(item.quantity)) || isNaN(Number(item.unitCost)))
          return res.status(400).json({
            success: false,
            message:
              "Required details missing, inside details Array, at index - " + i,
          });

        billTotal += Number(item.quantity) * Number(item.unitCost);
      }

      if (Number(totalCost) !== billTotal)
        return res.status(400).json({
          success: false,
          message: "Bill total amount mismatch, at index - " + i,
        });

      const purchaseEntryCheck = await Purchase.exists({ billNo })
        .lean()
        .session(session);
      if (purchaseEntryCheck)
        return res.status(409).json({
          success: false,
          message:
            "Purchase entry already exists againts this bill number, serch it using bill number.",
        });

      const newPurchase = new Purchase({
        detail,
        billNo,
        purchaseDate,
        totalCost,
        paymentStatus,
        transactionIds: transactionId ? [transactionId] : [],
        createdBy: req.user?._id,
      });
      await newPurchase.save({ session });

      for (let i = 0; i < detail.length; i++) {
        const item = detail[i];
        const ttt = await Stock.findOneAndUpdate(
          { partId: item.partId, location: "MAIN" },
          { $inc: { quantity: item.quantity } },
          { new: true, session }
        ).lean();
        console.log("Stoc update - ", ttt);

        const newMovement = await new StockMovement({
          partId: item.partId,
          fromLocation: "PURCHASE",
          toLocation: "MAIN",
          movementType: "PURCHASE",

          quantity: item.quantity,
          movementDate: purchaseDate,
          remarks: movementRemarks,
          createdBy: req.user?._id,
        }).save({ session });
        console.log("Stoc movement - ", newMovement);
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        success: true,
        message: "Purchase entry done.",
        data: { newPurchase },
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    } finally {
      session.endSession();
    }
  }
);

purchaseRouter.get(
  "/purchase-details",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const { page, limit, date, billNo, status } = req.query;
      let pageNumber = page ? Number(page) : 1;
      let limitNumber = limit ? Number(limit) : 10;

      if (
        status &&
        (typeof status !== "string" || !/^[01]$/.test(paymentStatus))
      )
        return res.status(400).json({ success: false, message: "Invalid" });

      let result;
      if (date)
        result = await Purchase.find({
          purchaseDate: new Date(date),
        })
          .skip(pageNumber)
          .limit(limitNumber)
          .lean();
      else if (billNo)
        result = await Purchase.findOne({
          billNo,
        })
          .skip(pageNumber)
          .limit(limitNumber)
          .lean();
      else if (status)
        result = await Purchase.findOne({
          paymentStatus: status,
        })
          .skip(pageNumber)
          .limit(limitNumber)
          .lean();
      else
        result = await Purchase.find()
          .skip(pageNumber)
          .limit(limitNumber)
          .lean();

      if (!result)
        return res
          .status(400)
          .json({ success: false, message: "No record found" });

      return res
        .status(200)
        .json({ success: true, data: billNo ? [result] : result });
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

module.exports = purchaseRouter;
