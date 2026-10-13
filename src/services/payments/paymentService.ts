import { Payment, PaymentType, PaymentMethod } from '@/types';
import { MOCK_PAYMENTS } from '@/mock/payments';
import { generateReceiptNumber } from '@/utils/idGenerator';
import { mockLoanService } from '../loans/loanService';

class PaymentService {
  private payments: Payment[] = [...MOCK_PAYMENTS];

  async getPayments(query?: string): Promise<Payment[]> {
    let list = [...this.payments];
    if (query && query.trim().length > 0) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.receiptNumber.toLowerCase().includes(q) ||
          p.loanNumber.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q)
      );
    }
    return list;
  }

  async getPaymentById(id: string): Promise<Payment | undefined> {
    return this.payments.find((p) => p.id === id);
  }

  async recordPayment(data: {
    loanId: string;
    loanNumber: string;
    customerId: string;
    customerName: string;
    amount: number;
    paymentType: PaymentType;
    paymentMethod: PaymentMethod;
    receivedByUserId: string;
    receivedByUserName: string;
    branchName: string;
    notes?: string;
  }): Promise<Payment> {
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      receiptNumber: generateReceiptNumber(),
      loanId: data.loanId,
      loanNumber: data.loanNumber,
      customerId: data.customerId,
      customerName: data.customerName,
      amount: data.amount,
      paymentType: data.paymentType,
      paymentMethod: data.paymentMethod,
      paymentDate: new Date().toISOString(),
      receivedByUserId: data.receivedByUserId,
      receivedByUserName: data.receivedByUserName,
      branchName: data.branchName,
      notes: data.notes,
      receiptStatus: 'ISSUED',
    };

    this.payments.unshift(newPayment);

    // If closure, trigger loan close
    if (data.paymentType === 'CLOSURE') {
      await mockLoanService.closeLoan(data.loanId, data.receivedByUserName);
    }

    return newPayment;
  }
}

export const mockPaymentService = new PaymentService();
