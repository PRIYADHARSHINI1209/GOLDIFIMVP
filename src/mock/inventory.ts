import { PledgedItem } from '@/types';
import { MOCK_LOANS } from './loans';

export const MOCK_INVENTORY: PledgedItem[] = MOCK_LOANS.map((loan) => loan.pledgedItem);
