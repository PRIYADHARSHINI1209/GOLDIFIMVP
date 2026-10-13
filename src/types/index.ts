export type UserRole =
  | 'OWNER'
  | 'MANAGER'
  | 'PAWN_OFFICER'
  | 'CASHIER'
  | 'INVENTORY_STAFF';

export type Permission =
  | 'customers.view'
  | 'customers.create'
  | 'customers.edit'
  | 'loans.view'
  | 'loans.create'
  | 'loans.edit'
  | 'loans.close'
  | 'payments.view'
  | 'payments.create'
  | 'inventory.view'
  | 'inventory.create'
  | 'inventory.edit'
  | 'reports.view'
  | 'employees.view'
  | 'employees.manage'
  | 'settings.view'
  | 'settings.manage'
  | 'audit.view';

export type DataScope = 'ALL_BRANCHES' | 'SINGLE_BRANCH';

export interface Organization {
  id: string;
  name: string;
  code: string;
  tagline: string;
  taxNumber: string;
  phone: string;
  email: string;
  address: string;
  totalBranches: number;
}

export interface Branch {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  isMainBranch: boolean;
  managerName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  branchId: string;
  branchName: string;
  scope: DataScope;
  permissions: Permission[];
  status: 'ACTIVE' | 'SUSPENDED';
  avatarInitials: string;
}

export type CustomerStatus = 'VERIFIED' | 'PENDING' | 'FLAGGED';

export interface Customer {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  idProofType: 'Aadhaar' | 'PAN' | 'Voter ID' | 'Driving License';
  idProofNumber: string;
  status: CustomerStatus;
  activeLoansCount: number;
  totalLoansCount: number;
  outstandingAmount: number;
  totalValuationPledged: number;
  createdAt: string;
  notes?: string;
}

export type LoanStatus = 'ACTIVE' | 'DUE_SOON' | 'OVERDUE' | 'CLOSED' | 'RENEWED';

export type ItemCategory =
  | 'GOLD_JEWELRY'
  | 'GOLD_COIN'
  | 'SILVER'
  | 'WATCH'
  | 'ELECTRONICS'
  | 'OTHER';

export type ItemStatus = 'PLEDGED' | 'IN_STORAGE' | 'RELEASED' | 'SOLD' | 'CLOSED';

export interface PledgedItem {
  id: string;
  loanId: string;
  loanNumber: string;
  customerName: string;
  category: ItemCategory;
  description: string;
  purityKarat?: string;
  grossWeightGrams: number;
  netWeightGrams: number;
  marketRatePerGram?: number;
  estimatedMarketValue: number;
  assessedLoanValue: number;
  storageLocker: string;
  status: ItemStatus;
  receivedDate: string;
  releasedDate?: string;
  notes?: string;
}

export interface LoanTimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  actor: string;
  type: 'CREATED' | 'PAYMENT' | 'RENEWED' | 'OVERDUE_ALERT' | 'CLOSED';
}

export interface Loan {
  id: string;
  loanNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  branchName: string;
  principalAmount: number;
  monthlyInterestRatePercent: number;
  accumulatedInterest: number;
  totalAmountDue: number;
  amountPaid: number;
  tenureMonths: number;
  startDate: string;
  dueDate: string;
  lastPaymentDate?: string;
  status: LoanStatus;
  pledgedItem: PledgedItem;
  ltvRatioPercent: number; // Loan to Value %
  timeline: LoanTimelineEvent[];
}

export type PaymentType = 'INTEREST' | 'PRINCIPAL' | 'RENEWAL' | 'CLOSURE';
export type PaymentMethod = 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE';

export interface Payment {
  id: string;
  receiptNumber: string;
  loanId: string;
  loanNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  receivedByUserId: string;
  receivedByUserName: string;
  branchName: string;
  notes?: string;
  receiptStatus: 'ISSUED' | 'CANCELLED';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  branchId: string;
  branchName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'INVITED';
  joinedDate: string;
  lastActive: string;
  permissions: Permission[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  objectType: 'LOAN' | 'CUSTOMER' | 'PAYMENT' | 'INVENTORY' | 'EMPLOYEE' | 'AUTH' | 'SETTINGS';
  objectId: string;
  branchName: string;
  result: 'SUCCESS' | 'FAILED' | 'WARNING';
  details: string;
}

export interface DashboardMetrics {
  totalActiveLoans: number;
  activeLoansAmount: number;
  todaysNewLoansCount: number;
  todaysNewLoansAmount: number;
  todaysPaymentsCount: number;
  todaysPaymentsAmount: number;
  outstandingPrincipal: number;
  overdueLoansCount: number;
  overdueLoansAmount: number;
  dueTodayCount: number;
  totalCustomers: number;
  totalInventoryValue: number;
  itemsInVault: number;
}
