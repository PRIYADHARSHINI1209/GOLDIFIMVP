import { Permission } from '@/types';

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: {
    key: Permission;
    label: string;
    description: string;
  }[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: 'customers',
    name: 'Customer Management',
    description: 'Access to customer profiles, KYC information, and history',
    permissions: [
      { key: 'customers.view', label: 'View Customers', description: 'Browse and search customer records' },
      { key: 'customers.create', label: 'Create Customers', description: 'Onboard new customers with KYC' },
      { key: 'customers.edit', label: 'Edit Customers', description: 'Update customer details and contact info' },
    ],
  },
  {
    id: 'loans',
    name: 'Pawn Loans',
    description: 'Loan origination, status tracking, and closing',
    permissions: [
      { key: 'loans.view', label: 'View Loans', description: 'Browse loans, terms, interest, and status' },
      { key: 'loans.create', label: 'Create Loans', description: 'Issue new loans against pledged collateral' },
      { key: 'loans.edit', label: 'Edit Loans', description: 'Adjust loan terms, interest rates, or due dates' },
      { key: 'loans.close', label: 'Close / Redeem Loans', description: 'Mark loans closed and authorize item release' },
    ],
  },
  {
    id: 'payments',
    name: 'Payments & Receipts',
    description: 'Interest and principal collection processing',
    permissions: [
      { key: 'payments.view', label: 'View Payments', description: 'View payment receipts and transaction records' },
      { key: 'payments.create', label: 'Record Payments', description: 'Accept cash/UPI payments and issue receipts' },
    ],
  },
  {
    id: 'inventory',
    name: 'Vault & Pledged Inventory',
    description: 'Pledged jewelry, storage locker tracking, and item valuation',
    permissions: [
      { key: 'inventory.view', label: 'View Inventory', description: 'Browse items in vault storage' },
      { key: 'inventory.create', label: 'Add Items', description: 'Log new items into storage' },
      { key: 'inventory.edit', label: 'Edit Inventory', description: 'Update locker location or item status' },
    ],
  },
  {
    id: 'reports',
    name: 'Analytics & Reports',
    description: 'Financial summaries, overdue alerts, and daily ledger reports',
    permissions: [
      { key: 'reports.view', label: 'View Reports', description: 'Access business analytics and summaries' },
    ],
  },
  {
    id: 'employees',
    name: 'Employee Management',
    description: 'Staff directory, role assignments, and permission controls',
    permissions: [
      { key: 'employees.view', label: 'View Staff', description: 'View list of branch staff' },
      { key: 'employees.manage', label: 'Manage Staff', description: 'Add staff, change roles and custom permissions' },
    ],
  },
  {
    id: 'settings',
    name: 'System & Shop Settings',
    description: 'Branch profiles, interest defaults, and security configurations',
    permissions: [
      { key: 'settings.view', label: 'View Settings', description: 'View shop configurations and info' },
      { key: 'settings.manage', label: 'Manage Settings', description: 'Modify shop details, interest rates and security' },
    ],
  },
  {
    id: 'audit',
    name: 'Security & Audit Logs',
    description: 'System-wide compliance audit trail',
    permissions: [
      { key: 'audit.view', label: 'View Audit Logs', description: 'Inspect audit trail and user action history' },
    ],
  },
];
