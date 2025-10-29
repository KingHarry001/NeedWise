import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useBudgetStore } from '../store/useBudgetStore';

export default function InsightsScreen() {
  const expenses = useBudgetStore(state => state.expenses);
  const budget = useBudgetStore(state => state.budget);
  const getNeedsTotal = useBudgetStore(state => state.getNeedsTotal);
  const getWantsTotal = useBudgetStore(state => state.getWantsTotal);
  const getNeedsPercentage = useBudgetStore(state => state.getNeedsPercentage);
  const getWantsPercentage = useBudgetStore(state => state.getWantsPercentage);
  const getTotalSpent = useBudgetStore(state => state.getTotalSpent);

  const needsTotal = getNeedsTotal();
  const wantsTotal = getWantsTotal();
  const needsPercent = getNeedsPercentage();
  const wantsPercent = getWantsPercentage();
  const totalSpent = getTotalSpent();

  // Calculate category totals
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxCategoryAmount = Math.max(...Object.values(categoryTotals), 1);

  // Calculate projections
  const daysInMonth = 30;
  const today = new Date();
  const dayOfMonth = today.getDate();
  const daysRemaining = daysInMonth - dayOfMonth;
  const avgPerDay = totalSpent / dayOfMonth;
  const projectedSpending = Math.round(avgPerDay * daysInMonth);

  const categoryEmojis: Record<string, string> = {
    'Food': '🛒',
    'Transport': '🚗',
    'Utilities': '⚡',
    'Entertainment': '🎮',
    'Shopping': '🛍️',
    'Health': '🏥',
    'Others': '📦',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Spending Insights</Text>

      {expenses.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>📊</Text>
          <Text style={styles.emptyStateText}>No data yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add some expenses to see insights
          </Text>
        </View>
      ) : (
        <>
          {/* Needs vs Wants */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Needs vs Wants</Text>
            
            <View style={styles.chartContainer}>
              {/* Bar Chart */}
              <View style={styles.barChart}>
                {needsPercent > 0 && (
                  <View style={[styles.bar, styles.needsBar, { flex: needsPercent }]}>
                    <Text style={styles.barText}>{needsPercent}%</Text>
                  </View>
                )}
                {wantsPercent > 0 && (
                  <View style={[styles.bar, styles.wantsBar, { flex: wantsPercent }]}>
                    <Text style={styles.barText}>{wantsPercent}%</Text>
                  </View>
                )}
              </View>

              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#2E7D32' }]} />
                  <Text style={styles.legendText}>
                    Needs (₦{needsTotal.toLocaleString()})
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#1976D2' }]} />
                  <Text style={styles.legendText}>
                    Wants (₦{wantsTotal.toLocaleString()})
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Category Breakdown */}
          {topCategories.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Top Categories</Text>
              
              {topCategories.map(([category, amount]) => {
                const percentage = (amount / maxCategoryAmount) * 100;
                const isWant = expenses.some(
                  e => e.category === category && e.type === 'want'
                );
                
                return (
                  <View key={category} style={styles.categoryItem}>
                    <Text style={styles.categoryName}>
                      {categoryEmojis[category] || '💰'} {category}
                    </Text>
                    <View style={styles.categoryBarContainer}>
                      <View 
                        style={[
                          styles.categoryBar, 
                          { 
                            width: `${percentage}%`,
                            backgroundColor: isWant ? '#1976D2' : '#2E7D32'
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.categoryAmount}>
                      ₦{amount.toLocaleString()}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Smart Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Smart Tip</Text>
            <Text style={styles.tipsText}>
              {needsPercent >= 70
                ? `Great job! You're spending ${needsPercent}% on needs. That's a healthy balance.`
                : wantsPercent >= 70
                ? `You're spending ${wantsPercent}% on wants. Consider focusing more on essential needs.`
                : `Your spending is balanced at ${needsPercent}% needs and ${wantsPercent}% wants.`}
            </Text>
          </View>

          {/* Monthly Summary */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>This Month</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={styles.summaryValue}>{expenses.length}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Average per Day</Text>
              <Text style={styles.summaryValue}>
                ₦{Math.round(avgPerDay).toLocaleString()}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Days Remaining</Text>
              <Text style={styles.summaryValue}>{daysRemaining} days</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Projected Spending</Text>
              <Text 
                style={[
                  styles.summaryValue, 
                  { color: projectedSpending > budget ? '#D32F2F' : '#2E7D32' }
                ]}
              >
                ₦{projectedSpending.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Warning if projected over budget */}
          {projectedSpending > budget && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ At your current rate, you'll exceed your budget by ₦
                {(projectedSpending - budget).toLocaleString()}
              </Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chartContainer: {
    marginTop: 8,
  },
  barChart: {
    flexDirection: 'row',
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  bar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  needsBar: {
    backgroundColor: '#2E7D32',
  },
  wantsBar: {
    backgroundColor: '#1976D2',
  },
  barText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  categoryBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  categoryBar: {
    height: '100%',
    borderRadius: 4,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'right',
  },
  tipsCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  warningBox: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  warningText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});