import { Employee, UserRole, Permission } from '@/types';
import { MOCK_EMPLOYEES } from '@/mock/employees';
import { ROLE_DEFINITIONS } from '@/permissions/roles';

class EmployeeService {
  private employees: Employee[] = [...MOCK_EMPLOYEES];

  async getEmployees(): Promise<Employee[]> {
    return [...this.employees];
  }

  async getEmployeeById(id: string): Promise<Employee | undefined> {
    return this.employees.find((e) => e.id === id);
  }

  async updateRole(id: string, role: UserRole): Promise<Employee | null> {
    const emp = this.employees.find((e) => e.id === id);
    if (!emp) return null;
    emp.role = role;
    emp.permissions = [...ROLE_DEFINITIONS[role].defaultPermissions];
    return emp;
  }

  async updatePermissions(id: string, permissions: Permission[]): Promise<Employee | null> {
    const emp = this.employees.find((e) => e.id === id);
    if (!emp) return null;
    emp.permissions = [...permissions];
    return emp;
  }
}

export const mockEmployeeService = new EmployeeService();
