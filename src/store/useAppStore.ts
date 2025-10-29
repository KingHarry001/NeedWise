import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sub-item for compound budget items
export interface SubItem {
  id: string;
  name: string;
  amount: number;
}

// Budget item (recurring expenses)
export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  period: 'weekly' | 'monthly';
  isCompound: boolean;
  subItems?: SubItem[];
  date: string;
}

// Wishlist item (things to buy)
export interface WishlistItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: 'need' | 'want';
  importance: 1 | 2 | 3 | 4 | 5;
  isPurchased: boolean;
  date: string;
}

interface AppState {
  budgetItems: BudgetItem[];
  wishlistItems: WishlistItem[];
  darkMode: boolean;
  isLoaded: boolean;
  
  // Budget actions
  addBudgetItem: (item: Omit<BudgetItem, 'id' | 'date'>) => void;
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;
  addSubItem: (budgetId: string, subItem: Omit<SubItem, 'id'>) => void;
  updateSubItem: (budgetId: string, subItemId: string, updates: Partial<SubItem>) => void;
  deleteSubItem: (budgetId: string, subItemId: string) => void;
  
  // Wishlist actions
  addWishlistItem: (item: Omit<WishlistItem, 'id' | 'date' | 'isPurchased'>) => void;
  updateWishlistItem: (id: string, updates: Partial<WishlistItem>) => void;
  deleteWishlistItem: (id: string) => void;
  togglePurchased: (id: string) => void;
  
  // General actions
  setDarkMode: (enabled: boolean) => void;
  loadFromStorage: () => Promise<void>;
  resetData: () => void;
  
  // Computed values
  getTotalBudget: (period: 'weekly' | 'monthly') => number;
  getTotalWishlist: (type?: 'need' | 'want') => number;
  getWishlistByType: (type: 'need' | 'want') => WishlistItem[];
}

export const useAppStore = create<AppState>((set, get) => ({
  budgetItems: [],
  wishlistItems: [],
  darkMode: false,
  isLoaded: false,
  
  loadFromStorage: async () => {
    try {
      const budgetData = await AsyncStorage.getItem('budgetItems');
      const wishlistData = await AsyncStorage.getItem('wishlistItems');
      const darkModeData = await AsyncStorage.getItem('darkMode');
      
      set({
        budgetItems: budgetData ? JSON.parse(budgetData) : [],
        wishlistItems: wishlistData ? JSON.parse(wishlistData) : [],
        darkMode: darkModeData === 'true',
        isLoaded: true,
      });
    } catch (error) {
      console.error('Error loading from storage:', error);
      set({ isLoaded: true });
    }
  },
  
  // Budget Items
  addBudgetItem: async (item) => {
    const newItem: BudgetItem = {
      ...item,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    const updated = [...get().budgetItems, newItem];
    await AsyncStorage.setItem('budgetItems', JSON.stringify(updated));
    set({ budgetItems: updated });
  },
  
  updateBudgetItem: async (id, updates) => {
    const updated = get().budgetItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    await AsyncStorage.setItem('budgetItems', JSON.stringify(updated));
    set({ budgetItems: updated });
  },
  
  deleteBudgetItem: async (id) => {
    const updated = get().budgetItems.filter(item => item.id !== id);
    await AsyncStorage.setItem('budgetItems', JSON.stringify(updated));
    set({ budgetItems: updated });
  },
  
  addSubItem: async (budgetId, subItem) => {
    const newSubItem: SubItem = {
      ...subItem,
      id: Date.now().toString(),
    };
    
    const updated = get().budgetItems.map(item => {
      if (item.id === budgetId) {
        const subItems = [...(item.subItems || []), newSubItem];
        const totalAmount = subItems.reduce((sum, sub) => sum + sub.amount, 0);
        return { ...item, subItems, amount: totalAmount };
      }
      return item;
    });
    
    await AsyncStorage.setItem('budgetItems', JSON.stringify(updated));
    set({ budgetItems: updated });
  },
  
  updateSubItem: async (budgetId, subItemId, updates) => {
    const updated = get().budgetItems.map(item => {
      if (item.id === budgetId && item.subItems) {
        const subItems = item.subItems.map(sub =>
          sub.id === subItemId ? { ...sub, ...updates } : sub
        );
        const totalAmount = subItems.reduce((sum, sub) => sum + sub.amount, 0);
        return { ...item, subItems, amount: totalAmount };
      }
      return item;
    });
    
    await AsyncStorage.setItem('budgetItems', JSON.stringify(updated));
    set({ budgetItems: updated });
  },
  
  deleteSubItem: async (budgetId, subItemId) => {
    const updated = get().budgetItems.map(item => {
      if (item.id === budgetId && item.subItems) {
        const subItems = item.subItems.filter(sub => sub.id !== subItemId);
        const totalAmount = subItems.reduce((sum, sub) => sum + sub.amount, 0);
        return { ...item, subItems, amount: totalAmount };
      }
      return item;
    });
    
    await AsyncStorage.setItem('budgetItems', JSON.stringify(updated));
    set({ budgetItems: updated });
  },
  
  // Wishlist Items
  addWishlistItem: async (item) => {
    const newItem: WishlistItem = {
      ...item,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      isPurchased: false,
    };
    
    const updated = [...get().wishlistItems, newItem];
    await AsyncStorage.setItem('wishlistItems', JSON.stringify(updated));
    set({ wishlistItems: updated });
  },
  
  updateWishlistItem: async (id, updates) => {
    const updated = get().wishlistItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    await AsyncStorage.setItem('wishlistItems', JSON.stringify(updated));
    set({ wishlistItems: updated });
  },
  
  deleteWishlistItem: async (id) => {
    const updated = get().wishlistItems.filter(item => item.id !== id);
    await AsyncStorage.setItem('wishlistItems', JSON.stringify(updated));
    set({ wishlistItems: updated });
  },
  
  togglePurchased: async (id) => {
    const updated = get().wishlistItems.map(item =>
      item.id === id ? { ...item, isPurchased: !item.isPurchased } : item
    );
    await AsyncStorage.setItem('wishlistItems', JSON.stringify(updated));
    set({ wishlistItems: updated });
  },
  
  // General
  setDarkMode: async (enabled) => {
    await AsyncStorage.setItem('darkMode', enabled.toString());
    set({ darkMode: enabled });
  },
  
  resetData: async () => {
    await AsyncStorage.removeItem('budgetItems');
    await AsyncStorage.removeItem('wishlistItems');
    set({ budgetItems: [], wishlistItems: [] });
  },
  
  // Computed
  getTotalBudget: (period) => {
    return get().budgetItems
      .filter(item => item.period === period)
      .reduce((sum, item) => sum + item.amount, 0);
  },
  
  getTotalWishlist: (type) => {
    const items = type 
      ? get().wishlistItems.filter(item => item.type === type)
      : get().wishlistItems;
    
    return items
      .filter(item => !item.isPurchased)
      .reduce((sum, item) => sum + item.amount, 0);
  },
  
  getWishlistByType: (type) => {
    return get().wishlistItems
      .filter(item => item.type === type && !item.isPurchased)
      .sort((a, b) => b.importance - a.importance);
  },
}));