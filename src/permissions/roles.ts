import { UserRole, Permission, DataScope } from '@/types';

export interface RoleDefinition {
  role: UserRole;
  displayName: string;
  description: string;
  defaultScope: DataScope;
  defaultPermissions: Permission[];
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  OWNER: {
    role: 'OWNER',
    displayName: 'Owner / Proprietor',
    description: 'Full business control across all branches with audit and managerial privileges.',
    defaultScope: 'ALL_BRANCHES',
    defaultPermissions: [
      'customers.view',
      'customers.create',
      'customers.edit',
      'loans.view',
      'loans.create',
      'loans.edit',
      'loans.close',
      'payments.view',
      'payments.create',
      'inventory.view',
      'inventory.create',
      'inventory.edit',
      'reports.view',
      'employees.view',
      'employees.manage',
      'settings.view',
      'settings.manage',
      'audit.view',
    ],
  },
  MANAGER: {
    role: 'MANAGER',
    displayName: 'Branch Manager',
    description: 'Manages branch operations, employee assignments, customer approvals and branch reports.',
    defaultScope: 'SINGLE_BRANCH',
    defaultPermissions: [
      'customers.view',
      'customers.create',
      'customers.edit',
      'loans.view',
      'loans.create',
      'loans.edit',
      'loans.close',
      'payments.view',
      'payments.create',
      'inventory.view',
      'inventory.create',
      'inventory.edit',
      'reports.view',
      'employees.view',
      'settings.view',
      'audit.view',
    ],
  },
  PAWN_OFFICER: {
    role: 'PAWN_OFFICER',
    displayName: 'Pawn Officer',
    description: 'Evaluates gold/pledges, creates pawn loans, edits loan terms, and logs pledges.',
    defaultScope: 'SINGLE_BRANCH',
    defaultPermissions: [
      'customers.view',
      'customers.create',
      'customers.edit',
      'loans.view',
      'loans.create',
      'loans.edit',
      'payments.view',
      'payments.create',
      'inventory.view',
      'inventory.create',
      'inventory.edit',
    ],
  },
  CASHIER: {
    role: 'CASHIER',
    displayName: 'Cashier / Teller',
    description: 'Processes loan interest and principal collections, prints payment receipts.',
    defaultScope: 'SINGLE_BRANCH',
    defaultPermissions: [
      'customers.view',
      'loans.view',
      'payments.view',
      'payments.create',
      'inventory.view',
    ],
  },
  INVENTORY_STAFF: {
    role: 'INVENTORY_STAFF',
    displayName: 'Vault / Inventory Staff',
    description: 'Manages locker placement, vault security verification, and item release.',
    defaultScope: 'SINGLE_BRANCH',
    defaultPermissions: [
      'inventory.view',
      'inventory.create',
      'inventory.edit',
      'loans.view',
    ],
  },
};
