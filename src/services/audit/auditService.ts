import { AuditLog } from '@/types';
import { MOCK_AUDIT_LOGS } from '@/mock/auditLogs';

class AuditService {
  private logs: AuditLog[] = [...MOCK_AUDIT_LOGS];

  async getAuditLogs(): Promise<AuditLog[]> {
    return [...this.logs];
  }

  async log(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const newEntry: AuditLog = {
      ...log,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.logs.unshift(newEntry);
    return newEntry;
  }
}

export const mockAuditService = new AuditService();
