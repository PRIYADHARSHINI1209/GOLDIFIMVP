import { Customer } from '@/types';
import { MOCK_CUSTOMERS } from '@/mock/customers';
import { generateCustomerCode } from '@/utils/idGenerator';

class CustomerService {
  private customers: Customer[] = [...MOCK_CUSTOMERS];

  async getCustomers(query?: string, statusFilter?: string): Promise<Customer[]> {
    let list = [...this.customers];
    if (statusFilter && statusFilter !== 'ALL') {
      list = list.filter((c) => c.status === statusFilter);
    }
    if (query && query.trim().length > 0) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.customerCode.toLowerCase().includes(q) ||
          c.phone.includes(q)
      );
    }
    return list;
  }

  async getCustomerById(id: string): Promise<Customer | undefined> {
    return this.customers.find((c) => c.id === id);
  }

  async createCustomer(data: Omit<Customer, 'id' | 'customerCode' | 'createdAt' | 'activeLoansCount' | 'totalLoansCount' | 'outstandingAmount' | 'totalValuationPledged'>): Promise<Customer> {
    const newCustomer: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      customerCode: generateCustomerCode(),
      activeLoansCount: 0,
      totalLoansCount: 0,
      outstandingAmount: 0,
      totalValuationPledged: 0,
      createdAt: new Date().toISOString(),
    };
    this.customers.unshift(newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null> {
    const index = this.customers.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.customers[index] = { ...this.customers[index], ...updates };
    return this.customers[index];
  }
}

export const mockCustomerService = new CustomerService();
