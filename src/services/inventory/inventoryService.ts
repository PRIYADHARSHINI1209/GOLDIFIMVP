import { PledgedItem, ItemStatus } from '@/types';
import { MOCK_INVENTORY } from '@/mock/inventory';

class InventoryService {
  private items: PledgedItem[] = [...MOCK_INVENTORY];

  async getInventory(statusFilter?: ItemStatus | 'ALL', query?: string): Promise<PledgedItem[]> {
    let list = [...this.items];
    if (statusFilter && statusFilter !== 'ALL') {
      list = list.filter((i) => i.status === statusFilter);
    }
    if (query && query.trim().length > 0) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (i) =>
          i.description.toLowerCase().includes(q) ||
          i.loanNumber.toLowerCase().includes(q) ||
          i.customerName.toLowerCase().includes(q) ||
          i.storageLocker.toLowerCase().includes(q)
      );
    }
    return list;
  }

  async getItemById(id: string): Promise<PledgedItem | undefined> {
    return this.items.find((i) => i.id === id);
  }

  async updateStorageLocation(id: string, storageLocker: string): Promise<PledgedItem | null> {
    const item = this.items.find((i) => i.id === id);
    if (!item) return null;
    item.storageLocker = storageLocker;
    return item;
  }
}

export const mockInventoryService = new InventoryService();
