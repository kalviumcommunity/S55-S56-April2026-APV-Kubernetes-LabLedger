import { supabase } from '../lib/supabase';
import type { InventoryItem, InventoryItemInsert } from '../types/inventory';

// Updated Table Names based on new schema
const TABLE_NAME = 'items'; 

export const inventoryService = {
  /**
   * Fetches all items from the items table.
   */
  async fetchItems(): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Supabase Error (fetchItems):', error.message, error.details);
      throw error;
    }

    return data as InventoryItem[];
  },

  /**
   * Adds a new item to the inventory.
   */
  async addItem(item: InventoryItemInsert): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error('Error adding inventory item:', error);
      throw error;
    }

    return data as InventoryItem;
  },

  /**
   * Updates the quantity of an existing item.
   */
  async updateItemQuantity(id: number, quantity: number): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ quantity })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating item quantity:', error);
      throw error;
    }

    return data as InventoryItem;
  },

  /**
   * Deletes an item from the inventory.
   */
  async deleteItem(id: number): Promise<void> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  },

  /**
   * Updates a full inventory record.
   */
  async updateItem(id: number, item: Partial<InventoryItemInsert>): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }

    return data as InventoryItem;
  },

  /**
   * Fetches counts grouped by category for the breakdown chart.
   */
  async getCategoryBreakdown() {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('category');

    if (error) throw error;

    const counts: Record<string, number> = {};
    data.forEach((item: any) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    return Object.entries(counts).map(([category, count]) => ({ category, count }));
  },

  /**
   * Fetches items that are at or below their min_stock level.
   */
  async getLowStockItems(): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*');

    if (error) throw error;
    
    return (data as InventoryItem[]).filter(item => item.quantity <= item.min_stock);
  },

  /**
   * Fetches the latest usage logs for the 'Recently Used' feed.
   */
  async getRecentUsage(limit = 5) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase Error (getRecentUsage):', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Fetches all transactions for the Ledger/Audit trail.
   */
  async fetchTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error (fetchTransactions):', error.message);
      throw error;
    }
    return data as Transaction[];
  },

  /**
   * Manual transaction logging helper.
   */
  async logTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) {
      console.error('Error logging manual transaction:', error);
      throw error;
    }
    return data;
  },

  /**
   * Aggregates usage data for the last 7 days for trend charts.
   */
  async getWeeklyUsage() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('transactions')
      .select('created_at, quantity')
      .eq('type', 'USE')
      .gte('created_at', sevenDaysAgo.toISOString());

    if (error) throw error;

    // Group by date
    const dailyMap: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dailyMap[d.toISOString().split('T')[0]] = 0;
    }

    data.forEach((t: any) => {
        const d = t.created_at.split('T')[0];
        if (dailyMap[d] !== undefined) {
            dailyMap[d] += t.quantity;
        }
    });

    return Object.entries(dailyMap)
        .map(([date, count]) => ({ 
            date: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            count 
        }))
        .reverse();
  },

  /**
   * Gets top items by total usage volume.
   */
  async getTopUsage(limit = 5) {
    const { data, error } = await supabase
      .from('transactions')
      .select('item_name, quantity')
      .eq('type', 'USE');

    if (error) throw error;

    const totals: Record<string, number> = {};
    data.forEach((t: any) => {
        totals[t.item_name] = (totals[t.item_name] || 0) + t.quantity;
    });

    return Object.entries(totals)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, limit);
  },

  /**
   * Gets total quantity of stock held in each category.
   */
  async getCategoryVolume() {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('category, quantity');

    if (error) throw error;

    const volumes: Record<string, number> = {};
    data.forEach((item: any) => {
        volumes[item.category] = (volumes[item.category] || 0) + item.quantity;
    });

    return Object.entries(volumes).map(([category, volume]) => ({ category, volume }));
  },

  /**
   * Atomic stock deduction and transaction logging via Postgres RPC.
   */
  async logUsage(itemId: number, quantity: number, user: string) {
    const { data, error } = await supabase.rpc('handle_usage', {
      target_item_id: itemId,
      usage_quantity: quantity,
      user_name: user,
    });

    if (error) {
      console.error('Usage Logic Error:', error.message);
      throw error;
    }

    return data;
  },
};
