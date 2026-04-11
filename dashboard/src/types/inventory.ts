export type Status = 'In Stock' | 'Low' | 'Expired';

export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  min_stock: number;
  unit: string;
  expiry: string;
  category: string;
  created_at?: string;
}

export interface Transaction {
  id: number;
  item_id: number;
  type: 'USE';
  quantity: number;
  user: string;
  item_name?: string; // Kept for Dashboard view convenience
  category?: string;  // Kept for Dashboard view convenience
  created_at: string;
}

// Keeping UsageLog for backward compatibility if needed, 
// but transitioning to Transaction
export type UsageLog = Transaction;

export interface InventoryItemInsert {
  name: string;
  quantity: number;
  min_stock?: number;
  unit: string;
  expiry: string;
  category: string;
}
