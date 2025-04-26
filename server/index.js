const express = require("express");
const cors = require("cors");
const technicianRouter = require("./routes/old/technician.routes");
// const serviceRouter = require("./routes/service.routes");
// const manageCustomerRouter = require("./routes/managing-routes/manage.customer.route");

const userRouter = require("./routes/user.routes");
const customerRouter = require("./routes/customer.routes");
const employeeRouter = require("./routes/employee.routes");

const { connectDB } = require("./config/db.config");
const purchaseRouter = require("./routes/purchase.route");
const partsRouter = require("./routes/parts.route");
const serviceRouterNew = require("./routes/newService.route");
const stockRouter = require("./routes/stock.routes");
const transactionRouter = require("./routes/transaction.route");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
  })
);
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// app.use("/inventory", inventoryRouter); // 8
app.use("/technician", technicianRouter); // 6

app.use("/customer", customerRouter); // 5
app.use("/employee", employeeRouter);

app.use("/service", serviceRouterNew);
app.use("/purchase", purchaseRouter);
app.use("/part", partsRouter);
app.use("/user", userRouter);
app.use("/stock", stockRouter);
app.use("/transaction", transactionRouter);

app.get("/", async (req, res) => {
  res.send("Hello from Server");
});

app.listen(process.env.PORT, async () => {
  try {
    await connectDB();
    console.log(new Date());
    console.log(`Server running at port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
