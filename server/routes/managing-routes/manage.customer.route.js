const manageCustomerRouter = require("express").Router();

// Add new Customer
manageCustomerRouter.post("/add-customer", async (req, res) => {
  try {
    const {
      customer_name,
      address,
      pin_code,
      mobile,
      model,
      serial_no,
      installation_date,
      remarks,
      customer_type,
    } = req.body;

    // Validate required fields
    if (
      !customer_name ||
      !mobile ||
      !address ||
      !pin_code ||
      !serial_no ||
      !installation_date ||
      !customer_type
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    const timestamp = installation_date.length
      ? new Date(installation_date)
      : new Date();

    const customerACexistCheck = await prisma.customer.findUnique({
      where: { mobile },
    });
    if (customerACexistCheck) {
      return res.status(409).json({
        success: false,
        message: `Customer already exist with the provided mobile number.`,
      });
    }

    const newCustomer = await prisma.customer.create({
      data: {
        customer_name,
        address,
        pin_code,
        mobile,
        model,
        serial_no,
        installation_date: timestamp,
        remarks,
        customer_type,
        created_by: req.user?.id || 1,
      },
    });

    res.status(201).json({ success: true, data: newCustomer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error,
    });
  }
});

// Get customers with a service date in the current month
manageCustomerRouter.get("/service-due", async (req, res) => {
  try {
    const customers = await prisma.$queryRaw`
      SELECT
        id,
        customer_name,
        installation_date,
        ADDDATE(installation_date, INTERVAL (FLOOR(DATEDIFF(CURDATE(), installation_date) / (4 * 30.44)) * 4) MONTH) AS next_service_date
      FROM
        customer
      WHERE
        DATEDIFF(CURDATE(), installation_date) >= (4 * 30.44)
        AND DATEDIFF(CURDATE(), installation_date) < (5 * 30.44)
        AND MOD(MONTH(CURDATE()) - MONTH(installation_date) + 12 * (YEAR(CURDATE()) - YEAR(installation_date)), 4) = 0;
    `;

    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    console.error("Error fetching customers with service due:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching customers with service due.",
      error,
    });
  }
});

manageCustomerRouter.get("/service-due-this-month", async (req, res) => {
  try {
    // Get the start and end of the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const customers = await prisma.$queryRaw`
      SELECT 
        id,
        customer_name,
        installation_date,
        ADDDATE(installation_date, INTERVAL (FLOOR(DATEDIFF(CURDATE(), installation_date) / 120) * 4) MONTH) AS next_service_date
      FROM 
        customer
      WHERE 
        ADDDATE(installation_date, INTERVAL (FLOOR(DATEDIFF(CURDATE(), installation_date) / 120) * 4) MONTH) 
        BETWEEN ${startOfMonth} AND ${endOfMonth};
    `;

    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    console.error(
      "Error fetching customers with service due this month:",
      error
    );
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while fetching customers with service due this month.",
      error,
    });
  }
});

// Get due services between parsed start & end date.
manageCustomerRouter.get("/service-due-between", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Both startDate and endDate are required.",
      });
    }
    // Ensure startDate and endDate are valid dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate the date range
    if (start >= end) {
      return res
        .status(400)
        .json({ success: false, message: "startDate must be before endDate." });
    }

    // Query to fetch customers with service due between the given dates
    const customers = await prisma.$queryRaw`
      SELECT 
        id,
        customer_name,
        installation_date,
        ADDDATE(installation_date, INTERVAL (FLOOR(DATEDIFF(CURDATE(), installation_date) / (4 * 30.44)) * 4) MONTH) AS next_service_date
      FROM 
        customer
      WHERE 
        ADDDATE(installation_date, INTERVAL (FLOOR(DATEDIFF(CURDATE(), installation_date) / (4 * 30.44)) * 4) MONTH)
        BETWEEN ${start} AND ${end}
        AND DATEDIFF(CURDATE(), installation_date) >= 4 * 30;  -- Ensure the installation date is old enough
    `;

    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    console.error(
      "Error fetching customers with service due between dates:",
      error
    );
    res.status(500).json({
      success: false,
      message:
        "An error occurred while fetching customers with service due between the specified dates.",
      error,
    });
  }
});

// Add new AMC customer / Update existing AMC customer
manageCustomerRouter.post("/add-amc", async (req, res) => {
  try {
    const { employeeId, amount, start_date, end_date } = req.body;

    // Validate required fields
    if (!employeeId || !amount || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "Required fields must be provided.",
      });
    }

    // Check if the customer exists
    // const customerExists = await prisma.customer.findUnique({
    //   where: { id: employeeId },
    // });

    // if (!customerExists) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Customer not found." });
    // }

    // Check if an AMC record already exists for the customer
    const existingAmcCustomer = await prisma.amcCustomer.findUnique({
      where: { employeeId },
    });

    let updatedAmcCustomer, newAmcCustomer, updatedCustomer, newAmcDetails;

    if (existingAmcCustomer) {
      // Update the existing AMC record
      updatedAmcCustomer = await prisma.amcCustomer.update({
        where: { employeeId },
        data: {
          amount,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
          total_amc_taken: Number(existingAmcCustomer.total_amc_taken) + 1,
          first_amc: false,
          updated_at: new Date(),
        },
      });

      newAmcDetails = await prisma.amcDetails.create({
        data: {
          employeeId,
          amount,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
          first_amc: false,
        },
      });
    } else {
      // Create a new AMC record
      newAmcCustomer = await prisma.amcCustomer.create({
        data: {
          employeeId,
          amount,
          total_amc_taken: 1,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
          first_amc: true,
        },
      });

      // Update the customer's type to 'AMC'
      updatedCustomer = await prisma.customer.update({
        where: { id: employeeId },
        data: { customer_type: "AMC", updated_at: new Date() },
      });

      newAmcDetails = await prisma.amcDetails.create({
        data: {
          employeeId,
          amount,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
          first_amc: true,
        },
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        updatedAmcCustomer,
        newAmcCustomer,
        updatedCustomer,
        newAmcDetails,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        "Failed to create or update AmcCustomer and update Customer type.",
      error,
    });
  }
});

module.exports = manageCustomerRouter;
