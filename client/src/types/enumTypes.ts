export enum CustomerType {
  IN_WARRANTY = "IN_WARRANTY",
  AMC = "AMC",
  OUT_OF_WARRANTY = "OUT_OF_WARRANTY",
  EXTENDED_WARRANTY = "EXTENDED_WARRANTY",
} // ["IN_WARRANTY", "AMC", "OUT_OF_WARRANTY", "EXTENDED_WARRANTY"],

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
} // ["MALE", "FEMALE", "OTHER"]

export enum EmployeeType {
  ADMIN = "ADMIN",
  OFFICE = "OFFICE",
  TECHNICIAN = "TECHNICIAN",
} // ["ADMIN", "OFFICE", "TECHNICIAN"]

export enum PaymentStatus {
  DUE = "DUE",
  PAID = "PAID",
} // ["DUE", "PAID"]

export enum ReturnDestination {
  OFFICE = "OFFICE",
  MAIN = "MAIN",
} // ["MAIN", "OFFICE"]

export enum SaleOrigin {
  OFFICE = "OFFICE",
  TECHNICIAN = "TECHNICIAN",
} // ["OFFICE", "TECHNICIAN"]

export enum ServiceReqStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
} // ["PENDING", "ASSIGNED", "COMPLETED", "CANCELED"]

export enum ServiceRateType {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
} // ["FIXED", "PERCENTAGE"]

export enum StockLocation {
  TECHNICIAN = "TECHNICIAN",
  OFFICE = "OFFICE",
  MAIN = "MAIN",
} //  ["MAIN", "OFFICE", "TECHNICIAN"]

export enum StockMovFromLocation {
  PURCHASE = "PURCHASE",
  MAIN = "MAIN",
  OFFICE = "OFFICE",
  TECHNICIAN = "TECHNICIAN",
  SALE_RETURN = "SALE_RETURN",
} // ["PURCHASE", "MAIN", "OFFICE", "TECHNICIAN", "SALE_RETURN"],

export enum StockMovToLocation {
  PURCHASE_RETURN = "PURCHASE_RETURN",
  MAIN = "MAIN",
  OFFICE = "OFFICE",
  TECHNICIAN = "TECHNICIAN",
  SALE = "SALE",
} // ["PURCHASE_RETURN", "MAIN", "OFFICE", "TECHNICIAN", "SALE"]

export enum StockMovementType {
  PURCHASE = "PURCHASE",
  PURCHASE_RETURN = "PURCHASE_RETURN",
  ASSIGN = "ASSIGN",
  ASSIGN_RETUEN = "ASSIGN_RETUEN",
  TRANSFER = "TRANSFER",
  SALE = "SALE",
  SALE_RETURN = "SALE_RETURN",
} // ["PURCHASE", "PURCHASE_RETURN", "TRANSFER", "SALE", "RETURN"]

export enum TechnicianStockMovementType {
  ASSIGNED = "ASSIGNED",
  PAID = "PAID",
  RETURN = "RETURN",
} // ["ASSIGNED", "PAID", "RETURN"]

export enum TransactionAmountType {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
} // ["CREDIT", "DEBIT"]

export enum TransactionMethods {
  CASH = "CASH",
  CARD = "CARD",
  UPI = "UPI",
} // ["CASH", "CARD", "UPI"]

export enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
} // ["PENDING", "SUCCESS", "FAILED"]

export enum TransactionType {
  PURCHASE = "PURCHASE",
  SALARY = "SALARY",
  EXPENSE = "EXPENSE",
  AMC = "AMC",
  AMC_RETURN = "AMC_RETURN",
  SALE = "SALE",
  RETURN = "RETURN",
  TECHNICIAN_PAID = "TECHNICIAN_PAID",
} // ["SALARY", "EXPENSE", "AMC", "AMC_RETURN", "SALE", "RETURN", "TECHNICIAN_PAID"]

export enum UserType {
  CUSTOMER = "CUSTOMER",
  TECHNICIAN = "TECHNICIAN",
  OFFICE = "OFFICE",
  ADMIN = "ADMIN",
} // ["CUSTOMER", "TECHNICIAN", "OFFICE", "ADMIN"]

export enum SellTo {
  CUSTOMER = "CUSTOMER",
  TECHNICIAN = "TECHNICIAN",
}
export enum InternalMovement {
  MAIN = "MAIN",
  OFFICE = "OFFICE",
}
