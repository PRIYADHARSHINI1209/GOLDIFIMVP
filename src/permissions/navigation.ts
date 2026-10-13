import { Permission } from '@/types';

export interface NavItem {
  id: string;
  label: string;
  route: string;
  iconName: string;
  requiredPermission?: Permission;
  isBottomTab: boolean;
  badgeCount?: number;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    route: '/(app)/dashboard',
    iconName: 'grid-outline',
    isBottomTab: true,
  },
  {
    id: 'customers',
    label: 'Customers',
    route: '/(app)/customers',
    iconName: 'people-outline',
    requiredPermission: 'customers.view',
    isBottomTab: true,
  },
  {
    id: 'loans',
    label: 'Loans',
    route: '/(app)/loans',
    iconName: 'receipt-outline',
    requiredPermission: 'loans.view',
    isBottomTab: true,
  },
  {
    id: 'payments',
    label: 'Payments',
    route: '/(app)/payments',
    iconName: 'cash-outline',
    requiredPermission: 'payments.view',
    isBottomTab: true,
  },
  {
    id: 'more',
    label: 'More',
    route: '/(app)/more',
    iconName: 'ellipsis-horizontal-circle-outline',
    isBottomTab: true,
  },
];

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    id: 'inventory',
    label: 'Vault & Inventory',
    route: '/(app)/inventory',
    iconName: 'cube-outline',
    requiredPermission: 'inventory.view',
    isBottomTab: false,
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    route: '/(app)/reports',
    iconName: 'bar-chart-outline',
    requiredPermission: 'reports.view',
    isBottomTab: false,
  },
  {
    id: 'employees',
    label: 'Staff & Roles',
    route: '/(app)/employees',
    iconName: 'shield-checkmark-outline',
    requiredPermission: 'employees.view',
    isBottomTab: false,
  },
  {
    id: 'audit',
    label: 'Audit Trail',
    route: '/(app)/settings/audit',
    iconName: 'document-text-outline',
    requiredPermission: 'audit.view',
    isBottomTab: false,
  },
  {
    id: 'settings',
    label: 'Settings',
    route: '/(app)/settings',
    iconName: 'settings-outline',
    requiredPermission: 'settings.view',
    isBottomTab: false,
  },
];
