import { Organization, Branch } from '@/types';

export const MOCK_ORGANIZATION: Organization = {
  id: 'org-001',
  name: 'Kumar Pawnbrokers & Jewellers',
  code: 'KUMAR-TN',
  tagline: 'Trusted Gold Loans & Collateral Services Since 1988',
  taxNumber: '33AABCK1029R1ZM',
  phone: '+91 98401 23456',
  email: 'contact@kumarpawnbrokers.com',
  address: 'No. 44, Usman Road, T. Nagar, Chennai, Tamil Nadu 600017',
  totalBranches: 3,
};

export const MOCK_BRANCHES: Branch[] = [
  {
    id: 'branch-001',
    organizationId: 'org-001',
    name: 'Main Branch (T. Nagar)',
    code: 'TN-01',
    address: 'No. 44, Usman Road, T. Nagar, Chennai 600017',
    phone: '+91 44 2434 1100',
    isMainBranch: true,
    managerName: 'Suresh Natarajan',
  },
  {
    id: 'branch-002',
    organizationId: 'org-001',
    name: 'North Branch (Sowcarpet)',
    code: 'SW-02',
    address: 'No. 18, Mint Street, Sowcarpet, Chennai 600079',
    phone: '+91 44 2538 4422',
    isMainBranch: false,
    managerName: 'Rajesh K. Mehta',
  },
  {
    id: 'branch-003',
    organizationId: 'org-001',
    name: 'West Branch (Anna Nagar)',
    code: 'AN-03',
    address: 'Plot 112, 2nd Avenue, Anna Nagar, Chennai 600040',
    phone: '+91 44 2621 8899',
    isMainBranch: false,
    managerName: 'M. Anandhan',
  },
];
