import {
  CustomerType,
  EmployeeType,
  StockMovementType,
  ServiceRateType,
  TechnicianStockMovementType,
  UserType,
  Gender,
  SaleOrigin,
  ServiceReqStatus,
  StockLocation,
  StockMovFromLocation,
  StockMovToLocation,
  TransactionType,
  TransactionAmountType,
  TransactionStatus,
  TransactionMethods,
} from "./enumTypes";
// LeaveType,
// StockMovementDestination,
// StockMovementSource,
// StockStatus,
// Status,
// TechnicianMovementDestination,
// TechnicianMovementSource,

export interface Amc {
  _id: string;
  customerId: string;
  amount: string;
  startDate: Date;
  endDate: Date;
  firstAmc: boolean;
  transactionId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  _id: string;
  name: string;
  mobile: number;
  email?: string;
  address?: string;
  gender?: Gender;
  dob?: string;
  pincode: string;
  joiningDate: Date;
  startingSalary?: string;
  baseSalary?: string;
  inHandSalary?: string;
  currentCTC?: string;
  employeeType: EmployeeType;
  userId?: string;
  createdBy: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  employeeName: string;
}

export interface Customer {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  address: string;
  gender?: Gender;
  dob?: string;
  pincode: string;
  model: string;
  serialNo: string;
  installationDate: Date;
  lastServiceDate?: Date;
  nextServiceDate: Date;

  totalAmcTaken: number;
  remarks?: string;

  customerType: CustomerType;
  userId?: string;
  active: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  password: string;
  email?: string;
  mobile: string;
  displayName: string;
  profilePic?: string;

  userType: UserType;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  customerId?: string;
  customer?: Customer;
  employeeId?: string;
  employee?: Employee;
  createdBy: string;
}

export interface Parts {
  _id: string;
  itemName: string;
  itemCode: string;
  description?: string;
  costPrice: number;
  internalSellingPrice: number;
  externalSellingPrice: number;
  active: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  _id: string;
  detail: {
    partId: string;
    quantity: number;
    unitCost: number;
  }[];
  billNo: string;
  purchaseDate: Date;
  totalCost: number;
  paymentStatus: string;
  transactionIds: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Return {
  _id: string;
  partId: string;
  quantity: number;
  returnBy: string;
  collectedBy: string;
  returnDate: Date;
  transactionId?: string;
  returnItems: string[];
  returnDestination: StockMovToLocation;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Salary {
  _id: string;
  transactionId: string;
  paidLeave: number;
  lwp: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  _id: string;
  stockId: string;
  soldTo: string;
  soldBy: string;
  saleDate: Date;
  saleOrigin: SaleOrigin;
  saleAmount: number;
  salePaymentStatus: string;
  transactionId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceRecord {
  _id: string;
  serviceRequestId: string;
  serviceDueDate: Date;
  actualServiceDate: Date;
  serviceDescription?: string;

  partsUsed: {
    partId?: string;
    price?: string;
  }[]; // Inventory[]
  totalCos: number;
  serviceDoneBy: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;

  serviceReq?: ServiceRequest;
  serviceDoneTechnician?: Employee;
  createdUser?: User;
}

export interface ServiceRequest {
  _id: string;
  customerId: Partial<Customer>;
  requestDate: Date;
  serviceTypeId: Partial<ServiceType>;
  // serviceType: String;
  status: ServiceReqStatus;
  technicianId?: Partial<Employee>;
  cusDescription?: string;
  resolutionNotes?: string;
  cancelReason?: string;
  createdBy: Partial<User>;
  updatedBy: Partial<User>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceType {
  _id: string;
  serviceName: string;
  rate: number;
  rateType: ServiceRateType;
  active: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stock {
  _id: string;
  partId: Parts;
  location: StockLocation;

  technicianId?: string;
  quantity: number;
  active: boolean;
  createdBy: string;

  itemName: string;
  itemCode: string;
  description?: string;
  costPrice: number;
  internalSellingPrice: number;
  externalSellingPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TechnicianStockType extends Omit<Stock, "technicianId"> {
  technicianId: Employee;
}

export type TechnicianStockExtended = Stock & {
  location?: string;
  mainStockQuantity?: number;
  isLowStock?: boolean;
};

export interface StockMovement {
  _id: string;
  partId: string;
  fromLocation: StockMovFromLocation;
  toLocation: StockMovToLocation;
  movementType: StockMovementType;
  technicianId?: string;
  quantity: number;
  movementDate: Date;
  // movedBy: string;
  remarks?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TechnicianStockMovement {
  _id: string;
  partId: string;
  quantity: number;
  movementType: TechnicianStockMovementType;
  technicianId: string;
  revceivedBy?: string;
  movementDate: Date;

  transactionId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  _id: string;
  transactionId: string;
  paidBy: string;
  recivedBy: string;
  confirmedBy?: string;
  transactionDate: Date;
  amount: number;
  amountType: TransactionAmountType;
  transactionMethod: TransactionMethods;
  status: TransactionStatus;
  transactionType: TransactionType;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomSelectOption {
  _id: string;
  label: string;
}

//
//
//
//
//
//
// export interface ServiceType {
//   _id: string;
//   typeName: string;
//   rate?: number;
//   rateType?: RateType;
//   createdAt: string | Date;
//   updatedAt: string | Date;
//   active: boolean;
//   ServiceRecord: ServiceRecord[];
// }

// export interface EmployeeSalary {
//   _id: string;
//   employeeId: string;
//   employee: Employee;
//   paymentDate: string | Date;
//   amount: number;
//   paidLeave?: number | null;
//   lwp?: number | null; // Leave Without Pay
//   createdBy: string;
//   createdAt: string | Date;
//   updatedAt: string | Date;
// }

// export interface Leave {
//   _id: string;
//   employeeId: string;
//   employee: Employee;
//   leaveDate: string | Date;
//   leaveType: LeaveType;
//   reason?: string | null;
//   createdBy: string;
//   createdAt: string | Date;
//   updatedAt: string | Date;
// }

// Define the Customer type
// export interface Customer {
//   _id: string;
//   name: string;
//   address: string | null;
//   gender: string;
//   DOB?: string | Date;
//   pinCode: string;
//   mobile: string;
//   model: string;
//   serialNo: string | null;
//   installationDate: string | Date;
//   remarks: string | null;
//   customerType: CustomerType;
//   createdBy: string | null;
//   userId?: string;
//   User?: User; // Define User interface separately
//   createdAt: string | Date;
//   updatedAt: string | Date;
//   active: boolean;
//   AmcCustomer: AmcCustomer[];
//   AmcDetails: AmcDetails[];
//   ServiceRequest: ServiceRequest[];
//   ServiceRecord: ServiceRecord[];
// }

// Define the Employee type
// export interface Employee {
//   _id: string;
//   name: string;
//   address: string | null;
//   gender: string;
//   DOB?: string | Date;
//   mobile: string;
//   joiningDate: string | Date;
//   baseSalary: string;
//   currentSalary: string | null;
//   employeeType: EmployeeType;
//   userId?: string;
//   User?: User; // Define User interface separately
//   createdBy: string | null;
//   createdAt: string | Date;
//   updatedAt: string | Date;
//   active: boolean;
//   ServiceRequest: ServiceRequest[];
//   ServiceRecord: ServiceRecord[];
//   TechnicianInventory: TechnicianInventory[];
//   EmployeeSalary: EmployeeSalary[];
//   Leave: Leave[];
// }

// Define the User type
// export interface User {
//   _id: string;
//   password?: string;
//   displayname?: string;
//   profilePic?: string | null;
//   email?: string;
//   mobile: string;
//   userType: UserType;
//   customerId: string | null;
//   employeeId: string | null;
//   createdBy: string;
//   createdAt: string | Date;
//   updatedAt: string | Date;
//   active: boolean;
//   Customer?: Customer | null; // Define Customer interface separately
//   Employee?: Employee | null; // Define Employee interface separately
// }

// export interface ServiceRequest {
//   _id: string;
//   customer: Customer;
//   requestDate: string | Date;
//   serviceType?: string | number;
//   status: Status;
//   employeeId?: string | null;
//   employee?: Employee | null;
//   description?: string | null;
//   resolutionNotes?: string | null;
//   createdBy: number;
//   createdAt: string | Date;
//   updatedAt: string | Date;
//   ServiceRecord: ServiceRecord[];
// }

// export interface ServiceRecord {
//   _id: string;
//   employeeId?: string | null;
//   customer: Customer;
//   serviceRequestId: string;
//   serviceRequest: ServiceRequest;
//   employee: Employee;
//   serviceTypeId?: string | null;
//   serviceType?: ServiceType | null;
//   serviceDate: string | Date;
//   serviceDescription?: string | null;
//   partsUsed?: string | null;
//   cost?: number | null;
//   createdBy: string;
//   createdAt: string | Date;
//   updatedAt: string | Date;
// }

// export interface Inventory {
//   _id: string;
//   itemName: string;
//   itemCode: string;
//   description: string;
//   mainStockQty: number;
//   officeStockQty: number;
//   costPrice: number;
//   sellingPrice: number;
//   location: string;
//   active: boolean;
//   purchases: Purchase[];
//   TechnicianInventory: TechnicianInventory[];
//   InventoryMovement: InventoryMovement[];
// }

// export interface InventoryMovement {
//   _id: string;
//   inventoryId: string;
//   inventory: Inventory;
//   movementType: InventoryMovementType;
//   sourceLocation: InventoryMovementSource;
//   destinationLocation: InventoryMovementDestination;
//   quantityBefore: number;
//   quantityMoved: number;
//   quantityAfter: number;
//   createdBy: string;
//   technicianId?: string;
//   movementDate: string | Date;
//   createdAt: string | Date;
// }

// export interface TechnicianInventory {
//   _id: string;
//   employeeId: string;
//   employee: Employee;
//   partId: string;
//   inventory: Inventory;
//   quantity: number;
//   status: InventoryStatus;
//   assignedDate: string | Date;
//   createdBy: number;
//   createdAt: string | Date;
//   updatedAt?: string | Date;
//   movements: TechnicianInventoryMovement[];
// }

// export interface TechnicianInventoryMovement {
//   _id: string;
//   technicianInventoryId: string;
//   technicianInventory: TechnicianInventory;
//   movementType: TechnicianInventoryMovementType;
//   source: TechnicianMovementSource;
//   destination: TechnicianMovementDestination;
//   billNo?: string | null;
//   amount?: number | null;
//   quantityBefore: number;
//   quantityMoved: number;
//   quantityAfter: number;
//   collectedBy?: string | null;
//   createdBy: string;
//   movementDate: string | Date;
//   createdAt: string | Date;
//   updatedAt?: string | Date;
// }

// export interface AmcCustomer {
//   _id: string;
//   employeeId: string;
//   customer: Customer; // Reference Customer interface
//   amount: number;
//   totalAmcTaken: number;
//   startDate: string | Date;
//   endDate: string | Date;
//   firstAmc: boolean;
//   createdBy: string;
//   createdAt: string | Date;
//   updatedAt: string | Date;
// }

// export interface AmcDetails {
//   _id: string;
//   employeeId: number;
//   customer: Customer; // Reference Customer interface
//   amount: number;
//   startDate: string | Date;
//   endDate: string | Date;
//   firstAmc: boolean;
//   createdBy: number;
//   createdAt: string | Date;
//   updatedAt: string | Date;
// }

// Define the type for a successful API response
interface SuccessResponse<T> {
  success: true;
  message: string;
  result: T;
}

interface LoginSuccessResponse<T> {
  token: string;
  success: true;
  message: string;
  result: T;
}

// Define the type for a failed API response
interface ErrorResponse {
  success: false;
  message: string;
  error: string;
}

// Define a union type for the API response
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
export type LoginApiResponse<T> = LoginSuccessResponse<T> | ErrorResponse;

// Define the result type for the API call
// export type UsersApiResponse = User[];
