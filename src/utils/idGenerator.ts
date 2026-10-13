let loanCounter = 10290;
let receiptCounter = 5040;
let customerCounter = 405;
let itemCounter = 8120;

export function generateLoanNumber(): string {
  loanCounter += 1;
  return `GL-${loanCounter}`;
}

export function generateReceiptNumber(): string {
  receiptCounter += 1;
  return `REC-${receiptCounter}`;
}

export function generateCustomerCode(): string {
  customerCounter += 1;
  return `CUST-${customerCounter.toString().padStart(4, '0')}`;
}

export function generateInventoryId(): string {
  itemCounter += 1;
  return `ITM-${itemCounter}`;
}
