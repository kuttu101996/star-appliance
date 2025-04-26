const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token)
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY); // Verify the token using the secret key

    const user = await User.findById({ _id: decoded.userId }).lean();

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    if (["OFFICE", "ADMIN", "TECHNICIAN"].includes(user.userType))
      req.empId = user.employeeId;

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid token.",
      error,
    });
  }
};

// Authorization middleware
// If logged user role do not match the permited roles the it will throw an error.
const authorizeRoles = (allowedRoles) => (req, res, next) => {
  const { user } = req;

  if (!user || !allowedRoles.includes(user.userType)) {
    return res.status(403).json({
      success: false,
      message: "Access forbidden: Insufficient permissions.",
    });
  }

  next(); // Continue to the next middleware or route handler
};

module.exports = { authenticateUser, authorizeRoles };
