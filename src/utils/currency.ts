/**
 * Formats a numeric value into the Indian Rupee (INR) numbering system.
 * e.g. 25000 -> "₹25,000"
 * e.g. 125000 -> "₹1,25,000"
 * e.g. 482000 -> "₹4,82,000"
 */
export function formatINR(amount: number | null | undefined, includeSymbol: boolean = true): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return includeSymbol ? '₹0' : '0';
  }

  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const absStr = Math.abs(rounded).toString();

  let result = '';
  if (absStr.length <= 3) {
    result = absStr;
  } else {
    const lastThree = absStr.substring(absStr.length - 3);
    const otherNumbers = absStr.substring(0, absStr.length - 3);
    const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = `${formattedOther},${lastThree}`;
  }

  const prefix = isNegative ? '- ' : '';
  const symbol = includeSymbol ? '₹' : '';
  return `${prefix}${symbol}${result}`;
}

/**
 * Parses raw user numeric text input to clean integer.
 */
export function parseINR(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}
