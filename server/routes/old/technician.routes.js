const technicianRouter = require("express").Router();
const {
  authenticateUser,
  authorizeRoles,
} = require("../../middlewares/auth.middleware");
const {
  TechnicianStockMovement,
  technicianStockMovementTypes,
} = require("../../models/technicianStockMovement.model");

// Get latest stock payment
technicianRouter.get(
  "/:partId/payment/:technician_id",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN", "TECHNICIAN"]),
  async (req, res) => {
    try {
      const { technician_id, partId } = req.params;

      const findLatestPayment = await TechnicianStockMovement.findOne({
        technicianId: technician_id,
        movementType: "PAID",
        partId,
      })
        .sort({ transactionDate: -1 })
        .populate({ path: "transactionId", model: "Transaction" })
        .lean();

      return res.status(200).json({
        success: true,
        message: "Success",
        data: movements,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error,
      });
    }
  }
);

// Sell stock by technician to customer
technicianRouter.post(
  "/sell-stock",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN", "TECHNICIAN"]),
  async (req, res) => {}
);

// Return stock by technician to office
technicianRouter.post(
  "/return-stock",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {}
);

// Get all service requests for a technician
technicianRouter.get(
  "/pending-request/:employeeId",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN", "TECHNICIAN"]),
  async (req, res) => {}
);

// Get all service records for a technician
technicianRouter.get(
  "/service-records/:employeeId",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN", "TECHNICIAN"]),
  async (req, res) => {}
);

module.exports = technicianRouter;
