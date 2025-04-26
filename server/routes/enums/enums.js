const stockMovementFromLocation = [
  "PURCHASE",
  "MAIN",
  "OFFICE",
  "TECHNICIAN",
  "UNKNOWN_SOURCE_RETURN",
];

const stockMovementToLocation = [
  "PURCHASE_RETURN",
  "MAIN",
  "OFFICE",
  "TECHNICIAN",
  "Direct_Sell",
];

const stockMovementType = [
  "PURCHASE",
  "PURCHASE_RETURN",
  "ASSIGN",
  "TRANSFER",
  "SALE",
  "SALE_RETURN",
];

module.exports = {
  stockMovementFromLocation,
  stockMovementToLocation,
  stockMovementType,
};
