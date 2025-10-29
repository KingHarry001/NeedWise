import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useBudgetStore } from '../store/useBudgetStore';
import { lightTheme, darkTheme } from '../utils/theme';

export default function HomeScreen() {
  // Connect to global store
  const budget = useBudgetStore(state => state.budget);
  const expenses = useBudgetStore(state => state.expenses);
  const getTotalSpent = useBudgetStore(state => state.getTotalSpent);
  const getRemaining = useBudgetStore(state => state.getRemaining);
  const getNeedsPercentage = useBudgetStore(state => state.getNeedsPercentage);
  const getWantsPercentage = useBudgetStore(state => state.getWantsPercentage);
  const deleteExpense = useBudgetStore(state => state.deleteExpense);
  const darkMode = useBudgetStore(state => state.darkMode);

  const theme = darkMode ? darkTheme : lightTheme;

  const spent = getTotalSpent();
  const remaining = getRemaining();
  const percentSpent = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const needsPercent = getNeedsPercentage();
  const wantsPercent = getWantsPercentage();

  // Get recent expenses (last 5)
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Category emoji mapping
  const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      'Food': '🛒',
      'Transport': '🚗',
      'Utilities': '⚡',
      'Entertainment': '🎮',
      'Shopping': '🛍️',
      'Health': '🏥',
      'Others': '📦',
    };
    return emojiMap[category] || '💰';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.text }]}>Hello! 👋</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Here's your spending overview</Text>
      </View>

      {/* Budget Card */}
      <View style={[styles.budgetCard, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.budgetLabel, { color: theme.textSecondary }]}>Monthly Budget</Text>
        <Text style={[styles.budgetAmount, { color: theme.primary }]}>₦{budget.toLocaleString()}</Text>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.row}>
          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Spent</Text>
            <Text style={[styles.spentAmount, { color: theme.danger }]}>₦{spent.toLocaleString()}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Remaining</Text>
            <Text style={[
              styles.remainingAmount,
              { color: remaining < 0 ? theme.danger : theme.success }
            ]}>
              ₦{remaining.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressBarContainer, { backgroundColor: theme.border }]}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${Math.min(percentSpent, 100)}%`,
                backgroundColor: percentSpent > 90 ? theme.danger : theme.primary
              }
            ]} 
          />
        </View>
        <Text style={[styles.percentText, { color: theme.textSecondary }]}>{percentSpent}% used</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.statCardValue, { color: theme.primary }]}>{needsPercent}%</Text>
          <Text style={[styles.statCardLabel, { color: theme.textSecondary }]}>Needs</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.statCardValue, { color: theme.primary }]}>{wantsPercent}%</Text>
          <Text style={[styles.statCardLabel, { color: theme.textSecondary }]}>Wants</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.statCardValue, { color: theme.primary }]}>{expenses.length}</Text>
          <Text style={[styles.statCardLabel, { color: theme.textSecondary }]}>Expenses</Text>
        </View>
      </View>

      {/* Recent Expenses */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Expenses</Text>
        
        {recentExpenses.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.cardBackground }]}>
            <Text style={styles.emptyStateEmoji}>📝</Text>
            <Text style={[styles.emptyStateText, { color: theme.text }]}>No expenses yet</Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.textSecondary }]}>Tap the + tab to add your first expense</Text>
          </View>
        ) : (
          recentExpenses.map((expense) => (
            <TouchableOpacity
              key={expense.id}
              style={[styles.expenseItem, { backgroundColor: theme.cardBackground }]}
              onLongPress={() => {
                if (confirm(`Delete "${expense.name}"?`)) {
                  deleteExpense(expense.id);
                }
              }}
            >
              <View style={[styles.expenseIcon, { backgroundColor: theme.inputBackground }]}>
                <Text style={styles.expenseEmoji}>
                  {getCategoryEmoji(expense.category)}
                </Text>
              </View>
              <View style={styles.expenseDetails}>
                <Text style={[styles.expenseName, { color: theme.text }]}>{expense.name}</Text>
                <Text style={[styles.expenseCategory, { color: theme.textSecondary }]}>
                  {expense.type === 'need' ? 'Need' : 'Want'} • {expense.category}
                </Text>
              </View>
              <Text style={[styles.expenseAmount, { color: theme.text }]}>₦{expense.amount.toLocaleString()}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Over Budget Warning */}
      {remaining < 0 && (
        <View style={[styles.warningBox, { backgroundColor: theme.dangerLight }]}>
          <Text style={[styles.warningText, { color: theme.danger }]}>
            ⚠️ You're ₦{Math.abs(remaining).toLocaleString()} over budget!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  budgetCard: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  budgetLabel: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  budgetAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  spentAmount: {
    fontSize: 20,
    fontWeight: '600',
  },
  remainingAmount: {
    fontSize: 20,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
  },
  percentText: {
    fontSize: 12,
    textAlign: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyState: {
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  expenseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseEmoji: {
    fontSize: 24,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 12,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  warningBox: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  warningText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});