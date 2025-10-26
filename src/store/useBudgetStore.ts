import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TypeScript interfaces
export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: 'need' | 'want';
  importance: 1 | 2 | 3 | 4 | 5;
  date: string;
}

interface BudgetState {
  // State
  budget: number;
  expenses: Expense[];
  budgetPeriod: 'weekly' | 'monthly';
  darkMode: boolean;
  isLoaded: boolean;
  
  // Actions
  setBudget: (amount: number) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  deleteExpense: (id: string) => void;
  resetData: () => void;
  setDarkMode: (enabled: boolean) => void;
  loadFromStorage: () => Promise<void>;
  
  // Computed values
  getTotalSpent: () => number;
  getRemaining: () => number;
  getNeedsTotal: () => number;
  getWantsTotal: () => number;
  getNeedsPercentage: () => number;
  getWantsPercentage: () => number;
}

// Create the store
export const useBudgetStore = create<BudgetState>((set, get) => ({
  // Initial state
  budget: 100000,
  expenses: [],
  budgetPeriod: 'monthly',
  darkMode: false,
  isLoaded: false,
  
  // Load from storage
  loadFromStorage: async () => {
    try {
      const budgetData = await AsyncStorage.getItem('budget');
      const expensesData = await AsyncStorage.getItem('expenses');
      const darkModeData = await AsyncStorage.getItem('darkMode');
      
      set({
        budget: budgetData ? parseFloat(budgetData) : 100000,
        expenses: expensesData ? JSON.parse(expensesData) : [],
        darkMode: darkModeData === 'true',
        isLoaded: true,
      });
    } catch (error) {
      console.error('Error loading from storage:', error);
      set({ isLoaded: true });
    }
  },
  
  // Set budget
  setBudget: async (amount) => {
    await AsyncStorage.setItem('budget', amount.toString());
    set({ budget: amount });
  },
  
  // Add expense
  addExpense: async (expense) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    const updatedExpenses = [...get().expenses, newExpense];
    await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    set({ expenses: updatedExpenses });
  },
  
  // Delete expense
  deleteExpense: async (id) => {
    const updatedExpenses = get().expenses.filter(e => e.id !== id);
    await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    set({ expenses: updatedExpenses });
  },
  
  // Reset all data
  resetData: async () => {
    await AsyncStorage.removeItem('budget');
    await AsyncStorage.removeItem('expenses');
    set({ budget: 100000, expenses: [] });
  },
  
  // Set dark mode
  setDarkMode: async (enabled) => {
    await AsyncStorage.setItem('darkMode', enabled.toString());
    set({ darkMode: enabled });
  },
  
  // Get total spent
  getTotalSpent: () => {
    return get().expenses.reduce((sum, expense) => sum + expense.amount, 0);
  },
  
  // Get remaining budget
  getRemaining: () => {
    return get().budget - get().getTotalSpent();
  },
  
  // Get needs total
  getNeedsTotal: () => {
    return get().expenses
      .filter(e => e.type === 'need')
      .reduce((sum, e) => sum + e.amount, 0);
  },
  
  // Get wants total
  getWantsTotal: () => {
    return get().expenses
      .filter(e => e.type === 'want')
      .reduce((sum, e) => sum + e.amount, 0);
  },
  
  // Get needs percentage
  getNeedsPercentage: () => {
    const total = get().getTotalSpent();
    if (total === 0) return 0;
    return Math.round((get().getNeedsTotal() / total) * 100);
  },
  
  // Get wants percentage
  getWantsPercentage: () => {
    const total = get().getTotalSpent();
    if (total === 0) return 0;
    return Math.round((get().getWantsTotal() / total) * 100);
  },
}));