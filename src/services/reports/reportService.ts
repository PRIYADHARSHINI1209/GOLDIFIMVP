import { DashboardMetrics } from '@/types';
import { MOCK_LOANS } from '@/mock/loans';
import { MOCK_CUSTOMERS } from '@/mock/customers';
import { MOCK_PAYMENTS } from '@/mock/payments';

class ReportService {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const activeLoans = MOCK_LOANS.filter((l) => l.status === 'ACTIVE' || l.status === 'DUE_SOON');
    const overdueLoans = MOCK_LOANS.filter((l) => l.status === 'OVERDUE');
    const dueSoonLoans = MOCK_LOANS.filter((l) => l.status === 'DUE_SOON');

    const totalActiveLoans = activeLoans.length;
    const activeLoansAmount = activeLoans.reduce((sum, l) => sum + l.principalAmount, 0);

    const overdueLoansCount = overdueLoans.length;
    const overdueLoansAmount = overdueLoans.reduce((sum, l) => sum + l.totalAmountDue, 0);

    const todaysPayments = MOCK_PAYMENTS.slice(0, 2);
    const todaysPaymentsCount = todaysPayments.length;
    const todaysPaymentsAmount = todaysPayments.reduce((sum, p) => sum + p.amount, 0);

    const inventoryValue = MOCK_LOANS
      .filter((l) => l.pledgedItem.status === 'PLEDGED' || l.pledgedItem.status === 'IN_STORAGE')
      .reduce((sum, l) => sum + l.pledgedItem.estimatedMarketValue, 0);

    return {
      totalActiveLoans,
      activeLoansAmount,
      todaysNewLoansCount: 1,
      todaysNewLoansAmount: 60000,
      todaysPaymentsCount,
      todaysPaymentsAmount,
      outstandingPrincipal: activeLoansAmount + overdueLoansAmount,
      overdueLoansCount,
      overdueLoansAmount,
      dueTodayCount: dueSoonLoans.length,
      totalCustomers: MOCK_CUSTOMERS.length,
      totalInventoryValue: inventoryValue,
      itemsInVault: 5,
    };
  }
}

export const mockReportService = new ReportService();
