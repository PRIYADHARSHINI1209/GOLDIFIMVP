import { useAuth } from './useAuth';
import { Permission } from '@/types';

export function usePermissions() {
  const { permissions, role, hasPermission, hasAnyPermission } = useAuth();

  return {
    permissions,
    role,
    hasPermission,
    hasAnyPermission,
    canViewCustomers: hasPermission('customers.view'),
    canCreateCustomer: hasPermission('customers.create'),
    canEditCustomer: hasPermission('customers.edit'),
    canViewLoans: hasPermission('loans.view'),
    canCreateLoan: hasPermission('loans.create'),
    canEditLoan: hasPermission('loans.edit'),
    canCloseLoan: hasPermission('loans.close'),
    canViewPayments: hasPermission('payments.view'),
    canCreatePayment: hasPermission('payments.create'),
    canViewInventory: hasPermission('inventory.view'),
    canManageInventory: hasPermission('inventory.edit'),
    canViewReports: hasPermission('reports.view'),
    canViewEmployees: hasPermission('employees.view'),
    canManageEmployees: hasPermission('employees.manage'),
    canViewSettings: hasPermission('settings.view'),
    canManageSettings: hasPermission('settings.manage'),
    canViewAudit: hasPermission('audit.view'),
  };
}
