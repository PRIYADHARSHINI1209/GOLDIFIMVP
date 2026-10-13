import { Loan, LoanStatus } from '@/types';
import { MOCK_LOANS } from '@/mock/loans';
import { generateLoanNumber, generateInventoryId } from '@/utils/idGenerator';

class LoanService {
  private loans: Loan[] = [...MOCK_LOANS];

  async getLoans(statusFilter?: LoanStatus | 'ALL', query?: string): Promise<Loan[]> {
    let list = [...this.loans];
    if (statusFilter && statusFilter !== 'ALL') {
      list = list.filter((l) => l.status === statusFilter);
    }
    if (query && query.trim().length > 0) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (l) =>
          l.loanNumber.toLowerCase().includes(q) ||
          l.customerName.toLowerCase().includes(q) ||
          l.pledgedItem.description.toLowerCase().includes(q)
      );
    }
    return list;
  }

  async getLoanById(id: string): Promise<Loan | undefined> {
    return this.loans.find((l) => l.id === id);
  }

  async createLoan(data: {
    customerId: string;
    customerName: string;
    customerPhone: string;
    branchId: string;
    branchName: string;
    principalAmount: number;
    monthlyInterestRatePercent: number;
    tenureMonths: number;
    itemCategory: any;
    itemDescription: string;
    purityKarat: string;
    grossWeightGrams: number;
    netWeightGrams: number;
    estimatedMarketValue: number;
    storageLocker: string;
    actorName: string;
  }): Promise<Loan> {
    const loanNum = generateLoanNumber();
    const itemId = generateInventoryId();
    const startDate = new Date();
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + data.tenureMonths);

    const ltvRatio = (data.principalAmount / data.estimatedMarketValue) * 100;
    const accumulatedInterest = (data.principalAmount * (data.monthlyInterestRatePercent / 100));

    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      loanNumber: loanNum,
      customerId: data.customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      branchId: data.branchId,
      branchName: data.branchName,
      principalAmount: data.principalAmount,
      monthlyInterestRatePercent: data.monthlyInterestRatePercent,
      accumulatedInterest,
      totalAmountDue: data.principalAmount + accumulatedInterest,
      amountPaid: 0,
      tenureMonths: data.tenureMonths,
      startDate: startDate.toISOString(),
      dueDate: dueDate.toISOString(),
      status: 'ACTIVE',
      ltvRatioPercent: Math.round(ltvRatio * 10) / 10,
      pledgedItem: {
        id: itemId,
        loanId: `loan-${Date.now()}`,
        loanNumber: loanNum,
        customerName: data.customerName,
        category: data.itemCategory,
        description: data.itemDescription,
        purityKarat: data.purityKarat,
        grossWeightGrams: data.grossWeightGrams,
        netWeightGrams: data.netWeightGrams,
        estimatedMarketValue: data.estimatedMarketValue,
        assessedLoanValue: data.principalAmount,
        storageLocker: data.storageLocker,
        status: 'PLEDGED',
        receivedDate: startDate.toISOString(),
      },
      timeline: [
        {
          id: `tl-${Date.now()}`,
          title: 'Loan Disbursed',
          description: `Disbursed ₹${data.principalAmount} against collateral`,
          date: startDate.toISOString(),
          actor: data.actorName,
          type: 'CREATED',
        },
      ],
    };

    this.loans.unshift(newLoan);
    return newLoan;
  }

  async closeLoan(id: string, actorName: string): Promise<Loan | null> {
    const loan = this.loans.find((l) => l.id === id);
    if (!loan) return null;

    loan.status = 'CLOSED';
    loan.pledgedItem.status = 'RELEASED';
    loan.pledgedItem.releasedDate = new Date().toISOString();
    loan.timeline.push({
      id: `tl-${Date.now()}`,
      title: 'Loan Closed & Pledge Released',
      description: 'Account settled in full. Collateral released.',
      date: new Date().toISOString(),
      actor: actorName,
      type: 'CLOSED',
    });
    return loan;
  }
}

export const mockLoanService = new LoanService();
