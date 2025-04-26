const serviceRouterNew = require("express").Router();
const { default: mongoose } = require("mongoose");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const Customer = require("../models/customer.model");
const ServiceRecord = require("../models/serviceRecord.model");
const ServiceRequest = require("../models/serviceRequest.model");
const ServiceType = require("../models/serviceType.model");
const Employee = require("../models/employee.model");

serviceRouterNew.get(
  "/all-customers-service-due-this-month",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
        0,
        0,
        0,
        0
      );
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      const customers = await Customer.find({
        nextServiceDate: { $gte: startOfMonth, $lte: endOfMonth },
      });

      res.status(200).json({
        success: true,
        message: "Success",
        data: customers,
      });
    } catch (error) {
      console.error(
        "Error fetching customers with service due this month:",
        error
      );
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error.",
      });
    }
  }
);

// Get due services between parsed start & end date.
serviceRouterNew.get(
  "/all-customers-service-due-between",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate)
        return res.status(400).json({
          success: false,
          message: "Both startDate and endDate are required.",
        });

      // Ensure startDate and endDate are valid dates
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Validate the dates
      if (isNaN(start.getTime()) || isNaN(end.getTime()))
        return res.status(400).json({
          success: false,
          message: "Invalid date format. Use YYYY-MM-DD.",
        });

      if (start >= end)
        return res.status(400).json({
          success: false,
          message: "startDate must be before endDate.",
        });

      const customers = await Customer.find({
        nextServiceDate: { $gte: start, $lte: end },
      });

      return res.status(200).json({
        success: true,
        message: "Success",
        data: customers,
      });
    } catch (error) {
      console.error(
        "Error fetching customers with service due between dates:",
        error
      );
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error.",
      });
    }
  }
);

// Get all service requests
serviceRouterNew.get(
  "/all-requests",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      // { $in: ["PENDING", "ASSIGNED"] },
      // const serviceRequests = await ServiceRequest.find({ status })
      const serviceRequests = await ServiceRequest.find({
        status: { $in: ["PENDING", "ASSIGNED"] },
      })
        .populate({ path: "customerId", model: "Customer" })
        .populate({ path: "serviceTypeId", model: "ServiceType" })
        .populate({ path: "technicianId", model: "Employee" })
        .populate({ path: "createdBy", model: "User" })
        .populate({ path: "updatedBy", model: "User" })
        .lean();

      return res.status(200).json({
        success: true,
        message: `All service requests.`,
        data: serviceRequests,
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

// Create or update a service request
serviceRouterNew.post(
  "/new-service-request",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN", "CUSTOMER"]),
  async (req, res) => {
    try {
      let {
        customerId,
        requestDate,
        serviceTypeId,
        status, // ["PENDING", "ASSIGNED", "COMPLETED", "CANCELED"],
        technicianId,
        cusDescription,
        resolutionNotes,
      } = req.body;
      const payload = structuredClone(req.body);

      // If the user is a CUSTOMER, ensure they can only create requests for themselves
      if (req.user?.userType === "CUSTOMER") customerId = req.user?._id;

      // Basic validation
      if (!customerId || !mongoose.Types.ObjectId.isValid(customerId._id))
        return res.status(400).json({
          success: false,
          message: "Customer ID is required & must be a valid ID.",
        });

      if (!requestDate || !new Date(requestDate))
        return res.status(400).json({
          success: false,
          message: "Request Date is required and must be a valid date.",
        });

      if (serviceTypeId && !mongoose.Types.ObjectId.isValid(serviceTypeId._id))
        return res.status(400).json({
          success: false,
          message: "Service Type ID is required & must be a valid ID.",
        });

      if (!["PENDING", "ASSIGNED", "COMPLETED", "CANCELED"].includes(status))
        return res.status(400).json({
          success: false,
          message:
            "Invalid status. Allowed values are: PENDING, ASSIGNED, COMPLETED, CANCELED.",
        });

      if (
        status === "ASSIGNED" &&
        (!technicianId || !mongoose.Types.ObjectId.isValid(technicianId._id))
      )
        return res.status(400).json({
          success: false,
          message: "Technician ID is required & must be a valid ID.",
        });

      const startOfDay = new Date(new Date(requestDate).setHours(0, 0, 0, 0)); // Midnight
      const endOfDay = new Date(
        new Date(requestDate).setHours(23, 59, 59, 999)
      );

      // Check if a service request already exists for the given employeeId and request_date
      const existingServiceRequest = await ServiceRequest.findOne({
        customerId: customerId._id,
        requestDate: { $gte: startOfDay, $lt: endOfDay },
        serviceTypeId: serviceTypeId._id,
      });

      if (existingServiceRequest)
        return res.status(400).json({
          success: false,
          message:
            "A service request already exists for this customer on this date.",
          data: existingServiceRequest,
        });

      const newServiceRequest = new ServiceRequest({
        customerId: customerId._id,
        requestDate: startOfDay,
        serviceTypeId: serviceTypeId._id,
        status,
        technicianId: technicianId._id || null,
        cusDescription,
        resolutionNotes,
        createdBy: req.user?._id,
        updatedBy: req.user?._id,
      });
      await newServiceRequest.save();
      payload._id = newServiceRequest._id;

      return res.status(201).json({
        success: true,
        message: "New service request created successfully.",
        data: payload,
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

// Create a new service record when a job is completed
serviceRouterNew.patch(
  "/service-request/:id/complete",
  authenticateUser,
  authorizeRoles(["OFFICE", "TECHNICIAN", "ADMIN"]),
  async (req, res) => {
    try {
      const serviceRequestId = req.params.id;
      let {
        actualServiceDate,
        serviceDescription,
        partsUsed,
        totalCos,
        serviceDoneBy,
      } = req.body;

      if (req.user?.userType === "TECHNICIAN") serviceDoneBy = req.user?._id;

      // Basic validation
      if (
        !serviceRequestId ||
        !mongoose.Types.ObjectId.isValid(serviceRequestId)
      )
        return res.status(400).json({
          success: false,
          message: "Service Request ID is required & must be a valid ID.",
        });

      const serviceRequestExists = await ServiceRequest.findById(
        serviceRequestId
      ).lean();
      if (!serviceRequestExists)
        return res.status(404).json({
          success: false,
          message: "No service request found, against this ID.",
        });

      if (serviceDoneBy && !mongoose.Types.ObjectId.isValid(serviceDoneBy._id))
        return res.status(400).json({
          success: false,
          message: "Invalid ID provided on service done by.",
        });

      if (
        (!serviceDoneBy || !serviceDoneBy._id) &&
        !serviceRequestExists.technicianId
      )
        return res.status(400).json({
          success: false,
          message:
            "Service request was not assigned & service done by both can not be empty.",
        });

      if (!actualServiceDate || !new Date(actualServiceDate))
        return res.status(400).json({
          success: false,
          message: "Actual Service Date is required and must be a valid date.",
        });

      if (!totalCos || typeof totalCos !== "number")
        return res.status(400).json({
          success: false,
          message: "Total cost is required and must be valid data type.",
        });

      if (Array.isArray(partsUsed) && partsUsed.length > 0) {
        for (let item of partsUsed) {
          if (typeof item !== "object")
            return res.status(400).json({
              success: false,
              message: "Invalid item inside parts used array.",
            });

          if (!item.partId || !mongoose.Types.ObjectId.isValid(item.partId._id))
            return res.status(400).json({
              success: false,
              message: "Invalid part id passed inside partsUsed array.",
            });

          if (item.price && typeof item.price !== "number")
            return res.status(400).json({
              success: false,
              message: "Invalid price passed inside partsUsed array.",
            });
        }
      }

      // Create a new service record
      const newServiceRecord = new ServiceRecord({
        serviceRequestId,
        serviceDueDate: serviceRequestExists.requestDate,
        actualServiceDate,
        serviceDescription,
        partsUsed,
        totalCos,
        serviceDoneBy: serviceDoneBy._id || serviceRequestExists.technicianId,
        createdBy: req.user?._id,
        updatedBy: req.user?._id,
      });
      await newServiceRecord.save();
      if (!newServiceRecord)
        return res.status(400).json({
          success: false,
          message: "Something went wrong, unable to create service record",
        });

      // Update the service request status to 'COMPLETED'
      let updatedServiceReq;
      if (serviceDoneBy) {
        updatedServiceReq = await ServiceRequest.findByIdAndUpdate(
          serviceRequestId,
          {
            status: "COMPLETED",
            technicianId: serviceDoneBy._id,
            updatedBy: req.user?._id,
          },
          { new: true }
        )
          .populate({ path: "customerId", model: "Customer" })
          .populate({ path: "serviceTypeId", model: "ServiceType" })
          .populate({ path: "technicianId", model: "Employee" })
          .populate({ path: "createdBy", model: "User" })
          .populate({ path: "updatedBy", model: "User" })
          .lean();
      } else {
        updatedServiceReq = await ServiceRequest.findByIdAndUpdate(
          serviceRequestId,
          { status: "COMPLETED", updatedBy: req.user?._id },
          { new: true }
        )
          .populate({ path: "customerId", model: "Customer" })
          .populate({ path: "serviceTypeId", model: "ServiceType" })
          .populate({ path: "technicianId", model: "Employee" })
          .populate({ path: "createdBy", model: "User" })
          .populate({ path: "updatedBy", model: "User" })
          .lean();
      }
      if (!updatedServiceReq)
        return res.status(404).json({
          success: false,
          message: "Service request not found.",
        });

      return res.status(201).json({
        success: true,
        message:
          "Service record created and service request updated successfully.",
        data: { newServiceRecord, updatedServiceReq },
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

// Assign a service request to a technician
serviceRouterNew.patch(
  "/service-request/:id/assign",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const serviceRequestId = req.params.id;
      let { technicianId } = req.body;

      // Basic validation
      if (
        !serviceRequestId ||
        !mongoose.Types.ObjectId.isValid(serviceRequestId)
      )
        return res.status(400).json({
          success: false,
          message: "Service Request ID is required & must be a valid ID.",
        });
      if (!technicianId || !mongoose.Types.ObjectId.isValid(technicianId))
        return res.status(400).json({
          success: false,
          message: "Technician ID is required & must be a valid ID.",
        });

      // Check if the service request exists
      const existingServiceRequest = await ServiceRequest.findById(
        serviceRequestId
      ).lean();
      if (!existingServiceRequest)
        return res.status(404).json({
          success: false,
          message: "Service request not found.",
        });

      // Prevent reassigning completed or canceled requests
      if (["COMPLETED", "CANCELED"].includes(existingServiceRequest.status))
        return res.status(400).json({
          success: false,
          message: `Cannot assign a technician to a ${existingServiceRequest.status.toLowerCase()} request.`,
        });

      const technicianExist = await Employee.findOne({
        _id: technicianId,
        employeeType: "TECHNICIAN",
      }).lean();
      if (!technicianExist)
        return res.status(400).json({
          success: false,
          message: "Invalid Technician ID provided",
        });

      const updatedServiceRequest = await ServiceRequest.findByIdAndUpdate(
        serviceRequestId,
        {
          $set: { status: "ASSIGNED", technicianId, updatedBy: req.user?._id },
        },
        { new: true }
      )
        .populate({ path: "customerId", model: "Customer" })
        .populate({ path: "serviceTypeId", model: "ServiceType" })
        .populate({ path: "technicianId", model: "Employee" })
        .populate({ path: "createdBy", model: "User" })
        .populate({ path: "updatedBy", model: "User" })
        .lean();

      if (!updatedServiceRequest)
        return res.status(404).json({
          success: false,
          message: "Service request not found.",
        });

      return res.status(200).json({
        success: true,
        message:
          "Service request has been successfully assigned to the technician.",
        data: updatedServiceRequest,
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

// Update service request details
serviceRouterNew.patch(
  "/service-request/:id/update",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN", "CUSTOMER"]),
  async (req, res) => {
    try {
      const serviceRequestId = req.params.id;
      let {
        status,
        requestDate,
        serviceTypeId,
        cusDescription,
        resolutionNotes,
      } = req.body;

      if (
        !status &&
        !requestDate &&
        !serviceTypeId &&
        !cusDescription &&
        !resolutionNotes
      )
        return res.status(400).json({
          success: false,
          message: "No data to update",
        });

      if (
        !serviceRequestId ||
        !mongoose.Types.ObjectId.isValid(serviceRequestId)
      )
        return res.status(400).json({
          success: false,
          message: "Service Request ID is required & must be a valid ID.",
        });

      // Check if the service request exists
      const serviceRequestExists = await ServiceRequest.findById(
        serviceRequestId
      ).lean();
      if (!serviceRequestExists)
        return res.status(404).json({
          success: false,
          message: "Service request not found.",
        });
      if (serviceRequestExists.status === "CANCELED")
        return res.status(404).json({
          success: false,
          message: "Canceled status can't be updated.",
        });

      if (serviceRequestExists.status === "COMPLETED" && status !== "COMPLETED")
        return res.status(404).json({
          success: false,
          message: "Completed status can't be updated.",
        });

      if (requestDate && !new Date(requestDate))
        return res.status(400).json({
          success: false,
          message: "Invalid request date passed.",
        });

      if (serviceTypeId && !mongoose.Types.ObjectId.isValid(serviceTypeId._id))
        return res.status(400).json({
          success: false,
          message: "Service Type ID, must be a valid ID.",
        });

      const updates = {};
      if (status) updates.status = status;
      if (status === "PENDING" && serviceRequestExists.status === "ASSIGNED")
        updates.technicianId = null;
      if (requestDate) updates.requestDate = requestDate;
      if (cusDescription) updates.cusDescription = cusDescription;
      if (resolutionNotes) updates.resolutionNotes = resolutionNotes;
      if (serviceTypeId) updates.serviceTypeId = serviceTypeId._id;
      // Update the service request
      const updatedServiceRequest = await ServiceRequest.findByIdAndUpdate(
        serviceRequestId,
        {
          $set: {
            ...updates,
            updatedBy: req.user?._id,
          },
        },
        { new: true, runValidators: true }
      )
        .populate({ path: "customerId", model: "Customer" })
        .populate({ path: "serviceTypeId", model: "ServiceType" })
        .populate({ path: "technicianId", model: "Employee" })
        .populate({ path: "createdBy", model: "User" })
        .populate({ path: "updatedBy", model: "User" })
        .lean();

      if (!updatedServiceRequest)
        return res.status(400).json({
          success: false,
          message: "Something went wrong, unable to update service request",
        });

      return res.status(200).json({
        success: true,
        message: "Service request updated successfully.",
        data: updatedServiceRequest,
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

// Delete a service request
serviceRouterNew.delete(
  "/service-request/:id/delete",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN", "CUSTOMER"]),
  async (req, res) => {
    try {
      const serviceRequestId = req.params.id;
      if (
        !serviceRequestId ||
        !mongoose.Types.ObjectId.isValid(serviceRequestId)
      )
        return res.status(400).json({
          success: false,
          message: "Service Request ID is required & must be a valid ID.",
        });

      // Check if the service request exists
      const serviceRequest = await ServiceRequest.findById(
        serviceRequestId
      ).lean();
      if (!serviceRequest)
        return res.status(404).json({
          success: false,
          message: "Service request not found.",
        });
      if (serviceRequest.status === "COMPLETED")
        return res.status(400).json({
          success: false,
          message: "Service request deleted, once completed.",
        });

      if (req.user?.userType === "TECHNICIAN")
        return res.status(403).json({
          success: false,
          message: "Access denied. You can not delete service request.",
        });
      if (
        req.user?.userType === "CUSTOMER" &&
        serviceRequest.customerId !== req.user?._id
      )
        return res.status(403).json({
          success: false,
          message:
            "Access denied. You can only delete your own service requests.",
        });

      await ServiceRecord.deleteMany({ serviceRequestId });
      // Delete the service request
      const deleteServiceRequest = await ServiceRequest.findByIdAndDelete(
        serviceRequestId
      );

      return res.status(200).json({
        success: true,
        message: "Service request deleted successfully.",
        data: deleteServiceRequest,
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

// Cancel a service request
serviceRouterNew.post(
  "/service-request/:id/cancel",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN", "CUSTOMER"]),
  async (req, res) => {
    try {
      const serviceRequestId = req.params.id;
      const { cancelRsn } = req.body;
      if (
        !serviceRequestId ||
        !mongoose.Types.ObjectId.isValid(serviceRequestId)
      )
        return res.status(400).json({
          success: false,
          message: "Service Request ID is required & must be a valid ID.",
        });

      // Check if the service request exists
      const serviceRequest = await ServiceRequest.findById(
        serviceRequestId
      ).lean();
      if (!serviceRequest)
        return res.status(404).json({
          success: false,
          message: "Service request not found.",
        });
      if (serviceRequest.status === "COMPLETED")
        return res.status(400).json({
          success: false,
          message: "Service request deleted, once completed.",
        });

      if (req.user?.userType === "TECHNICIAN")
        return res.status(403).json({
          success: false,
          message: "Access denied. You can not delete service request.",
        });
      if (
        req.user?.userType === "CUSTOMER" &&
        serviceRequest.customerId !== req.user?._id
      )
        return res.status(403).json({
          success: false,
          message:
            "Access denied. You can only delete your own service requests.",
        });

      const updatedServiceReq = await ServiceRequest.findByIdAndUpdate(
        serviceRequestId,
        {
          $set: {
            status: "CANCELED",
            cancelReason: cancelRsn,
            technicianId: null,
          },
        },
        { new: true }
      )
        .populate({ path: "customerId", model: "Customer" })
        .lean();

      return res.status(200).json({
        success: true,
        message: "Service request deleted successfully.",
        data: updatedServiceReq,
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

serviceRouterNew.get(
  "/all-records",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const serviceRequests = await ServiceRecord.find()
        .populate({
          path: "serviceRequestId",
          model: "ServiceRequest",
          populate: [
            { path: "customerId", model: "Customer" },
            { path: "serviceTypeId", model: "ServiceType" },
            { path: "technicianId", model: "Employee" },
            { path: "createdBy", model: "User" },
            { path: "updatedBy", model: "User" },
          ],
        })
        .populate({ path: "partsUsed.partId", model: "Part" })
        .populate({ path: "serviceDoneBy", model: "Employee" })
        .populate({ path: "createdBy", model: "User" })
        .populate({ path: "updatedBy", model: "User" })
        .lean();

      const allServiceRequests = serviceRequests.map((item) => ({
        ...item,
        serviceReq: item.serviceRequestId,
        serviceDoneTechnician: item.serviceDoneBy,
        createdUser: item.createdBy,
      }));

      return res.status(200).json({
        success: true,
        message: "All records.",
        data: allServiceRequests,
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

// Get all service records for a specific service request
serviceRouterNew.get(
  "/service-request/:id/all-records",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN", "TECHNICIAN"]),
  async (req, res) => {
    try {
      const serviceRequestId = req.params.id;

      if (
        !serviceRequestId ||
        !mongoose.Types.ObjectId.isValid(serviceRequestId)
      )
        return res.status(400).json({
          success: false,
          message: "Service Request ID is required & must be a valid ID.",
        });

      const serviceRecords = await ServiceRecord.find({
        serviceRequestId,
      })
        .populate("serviceRequestId") // First populate ServiceRequest
        .populate({
          path: "serviceRequestId",
          populate: [
            { path: "customerId", model: "Customer" },
            { path: "serviceTypeId", model: "ServiceType" },
            { path: "technicianId", model: "Employee" },
            { path: "createdBy", model: "User" },
            { path: "updatedBy", model: "User" },
          ],
        })
        .populate({ path: "partsUsed.partId", model: "Part" })
        .populate({ path: "serviceDoneBy", model: "Employee" })
        .populate({ path: "createdBy", model: "User" })
        .populate({ path: "updatedBy", model: "User" })
        .lean();

      if (serviceRecords.length === 0)
        return res.status(404).json({
          success: false,
          message: "No service records found against this request ID.",
        });

      return res.status(200).json({
        success: true,
        message: "Success",
        data: serviceRecords,
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

serviceRouterNew.get(
  "/service-type/getAll",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const allServiceTypes = await ServiceType.find({ active: true }).lean();
      if (allServiceTypes <= 0)
        return res.status(400).json({
          success: false,
          message: "No data found!",
        });

      return res.status(200).json({
        success: true,
        message: "",
        data: allServiceTypes,
      });
    } catch (error) {
      console.log("Error occured in /service-type/add-new", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error,
      });
    }
  }
);

serviceRouterNew.get(
  "/service-type/:id/get",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const serviceTypeId = req.params.id;
      const getServiceType = await ServiceType.findById(serviceTypeId).lean();
      if (!getServiceType)
        return res.status(404).json({
          success: false,
          message: "No data found!",
        });

      return res.status(200).json({
        success: true,
        message: "",
        data: getServiceType,
      });
    } catch (error) {
      console.log("Error occured in /service-type/add-new", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error,
      });
    }
  }
);

serviceRouterNew.post(
  "/service-type/add-new",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const { serviceName, rate, rateType } = req.body;
      if (!serviceName || typeof serviceName !== "string")
        return res.status(400).json({
          success: false,
          message: "Invalid service name",
        });

      const existServiceName = await ServiceType.findOne({
        serviceName,
        rate,
        rateType,
      });
      if (existServiceName)
        return res.status(400).json({
          success: false,
          message: "Service name already exist.",
        });

      if (!rate || typeof rate !== "number")
        return res.status(400).json({
          success: false,
          message: "Invalid data type of rate.",
        });

      if (
        !rateType ||
        typeof rateType !== "string" ||
        !["FIXED", "PERCENTAGE"].includes(rateType)
      )
        return res.status(400).json({
          success: false,
          message: "Invalid data provided in field rateType.",
        });

      const newServiceType = new ServiceType({
        serviceName,
        rate,
        rateType,
        createdBy: req.user?._id,
      });
      await newServiceType.save();

      if (!newServiceType)
        return res.status(400).json({
          success: false,
          message: "Something went wrong, unable to create new Service Type.",
        });

      return res.status(200).json({
        success: true,
        message: "",
        data: newServiceType,
      });
    } catch (error) {
      console.log("Error occured in /service-type/add-new", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error,
      });
    }
  }
);

serviceRouterNew.patch(
  "/service-type/:id/update",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const serviceTypeId = req.params.id;
      if (!serviceTypeId || !mongoose.Types.ObjectId.isValid(serviceTypeId))
        return res.status(400).json({
          success: false,
          message: "Service Type ID is required & must be a valid ID.",
        });

      const { serviceName, rate, rateType } = req.body;
      const updates = {};

      if (serviceName && typeof serviceName !== "string")
        return res.status(400).json({
          success: false,
          message: "Invalid service name",
        });
      const existServiceName = await ServiceType.findOne({
        serviceName,
      });
      if (existServiceName)
        return res.status(400).json({
          success: false,
          message: "Service name already exist.",
        });
      updates.serviceName = serviceName;

      if (rate && typeof rate !== "number")
        return res.status(400).json({
          success: false,
          message: "Invalid data type of rate.",
        });
      updates.rate = rate;

      if (
        rateType &&
        (typeof rateType !== "string" ||
          !["FIXED", "PERCENTAGE"].includes(rateType))
      )
        return res.status(400).json({
          success: false,
          message: "Invalid data provided in field rateType.",
        });
      updates.rateType = rateType;

      const updatedServiceType = await ServiceType.findByIdAndUpdate(
        serviceTypeId,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!updatedServiceType)
        return res.status(400).json({
          success: false,
          message: "Something went wrong, unable to update Service Type.",
        });

      return res.status(200).json({
        success: true,
        message: "",
        data: updatedServiceType,
      });
    } catch (error) {
      console.log("Error occured in /service-type/add-new", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error,
      });
    }
  }
);

serviceRouterNew.delete(
  "/service-type/:id/delete",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN"]),
  async (req, res) => {
    try {
      const serviceTypeId = req.params.id;
      if (!serviceTypeId || !mongoose.Types.ObjectId.isValid(serviceTypeId))
        return res.status(400).json({
          success: false,
          message: "Service Type ID is required & must be a valid ID.",
        });

      const updatedServiceType = await ServiceType.findByIdAndUpdate(
        serviceTypeId,
        { avtive: false },
        { new: true, runValidators: true }
      );

      if (!updatedServiceType)
        return res.status(400).json({
          success: false,
          message: "Something went wrong, unable to update Service Type.",
        });

      return res.status(200).json({
        success: true,
        message: "",
        data: updatedServiceType,
      });
    } catch (error) {
      console.log("Error occured in /service-type/add-new", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error,
      });
    }
  }
);

// Get all pending service requests for a technician
serviceRouterNew.get(
  "/technician/:id/all-requests",
  authenticateUser,
  authorizeRoles(["OFFICE", "ADMIN", "TECHNICIAN"]),
  async (req, res) => {
    try {
      let technicianId = req.params.id;
      if (req.user?.userType === "TECHNICIAN") technicianId = req.user?._id;
      if (!technicianId || !mongoose.Types.ObjectId.isValid(technicianId))
        return res.status(400).json({
          success: false,
          message: "Technician ID is required & must be a valid ID.",
        });

      // Fetch all pending service requests assigned to the technician
      const pendingRequests = await ServiceRequest.find({
        technicianId,
      })
        .populate({ path: "customerId", model: "Customer" })
        .populate({ path: "serviceTypeId", model: "ServiceType" })
        .populate({ path: "createdBy", model: "User" })
        .populate({ path: "updatedBy", model: "User" })
        .lean();

      if (pendingRequests.length === 0)
        return res.status(404).json({
          success: false,
          message: "No pending service request found",
        });

      return res.status(200).json({
        success: true,
        message: "All service requests fetched successfully.",
        data: pendingRequests,
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

module.exports = serviceRouterNew;
