import { Permission } from '@/types';

/**
 * Checks if the user's permission set includes a specific permission.
 */
export function hasPermission(userPermissions: Permission[] | undefined, permission: Permission): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return userPermissions.includes(permission);
}

/**
 * Checks if user has at least one of the specified permissions.
 */
export function hasAnyPermission(userPermissions: Permission[] | undefined, permissions: Permission[]): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return permissions.some((perm) => userPermissions.includes(perm));
}

/**
 * Checks if user has all of the specified permissions.
 */
export function hasAllPermissions(userPermissions: Permission[] | undefined, permissions: Permission[]): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return permissions.every((perm) => userPermissions.includes(perm));
}

/**
 * Route-to-permission mapping for mobile UI navigation security.
 */
export const ROUTE_PERMISSION_MAP: Record<string, Permission | Permission[]> = {
  '/dashboard': ['loans.view', 'reports.view', 'customers.view', 'inventory.view', 'payments.view'],
  '/customers': 'customers.view',
  '/customers/create': 'customers.create',
  '/loans': 'loans.view',
  '/loans/create': 'loans.create',
  '/payments': 'payments.view',
  '/inventory': 'inventory.view',
  '/reports': 'reports.view',
  '/employees': 'employees.view',
  '/employees/permissions': 'employees.manage',
  '/settings': 'settings.view',
  '/settings/audit': 'audit.view',
  '/settings/access': 'settings.manage',
};

/**
 * Checks if the route can be accessed by the user based on permissions.
 */
export function canAccessRoute(userPermissions: Permission[] | undefined, route: string): boolean {
  if (!userPermissions) return false;

  const required = ROUTE_PERMISSION_MAP[route];
  if (!required) return true; // Public or unconstrained route

  if (Array.isArray(required)) {
    return hasAnyPermission(userPermissions, required);
  }
  return hasPermission(userPermissions, required);
}
