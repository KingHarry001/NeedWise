import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { lightTheme, darkTheme } from '../utils/theme';

export default function HomeScreen() {
  const budgetItems = useAppStore(state => state.budgetItems);
  const wishlistItems = useAppStore(state => state.wishlistItems);
  const getTotalBudget = useAppStore(state => state.getTotalBudget);
  const getTotalWishlist = useAppStore(state => state.getTotalWishlist);
  const darkMode = useAppStore(state => state.darkMode);

  const theme = darkMode ? darkTheme : lightTheme;

  const monthlyBudget = getTotalBudget('monthly');
  const weeklyBudget = getTotalBudget('weekly');
  const needsTotal = getTotalWishlist('need');
  const wantsTotal = getTotalWishlist('want');
  const totalWishlist = getTotalWishlist();

  const unpurchasedNeeds = wishlistItems.filter(item => !item.isPurchased && item.type === 'need').length;
  const unpurchasedWants = wishlistItems.filter(item => !item.isPurchased && item.type === 'want').length;

  const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      'Food': '🛒',
      'Transport': '🚗',
      'Utilities': '⚡',
      'Entertainment': '🎮',
      'Shopping': '🛍️',
      'Health': '🏥',
      'Rent': '🏠',
      'Others': '📦',
    };
    return emojiMap[category] || '💰';
  };

  const recentBudgetItems = [...budgetItems]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const topWishlistItems = [...wishlistItems]
    .filter(item => !item.isPurchased)
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 3);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.text }]}>Hello! 👋</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Here's your financial overview
        </Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        <View style={[styles.summaryCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Monthly Budget</Text>
          <Text style={[styles.summaryAmount, { color: theme.primary }]}>
            ₦{monthlyBudget.toLocaleString()}
          </Text>
          <Text style={[styles.summarySubtext, { color: theme.textTertiary }]}>
            {budgetItems.filter(i => i.period === 'monthly').length} items
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Weekly Budget</Text>
          <Text style={[styles.summaryAmount, { color: theme.secondary }]}>
            ₦{weeklyBudget.toLocaleString()}
          </Text>
          <Text style={[styles.summarySubtext, { color: theme.textTertiary }]}>
            {budgetItems.filter(i => i.period === 'weekly').length} items
          </Text>
        </View>
      </View>

      {/* Wishlist Overview */}
      <View style={[styles.wishlistOverview, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Wishlist Summary</Text>
        
        <View style={styles.wishlistRow}>
          <View style={styles.wishlistStat}>
            <View>
              <Text style={[styles.wishlistValue, { color: theme.text }]}>
                ₦{needsTotal.toLocaleString()}
              </Text>
              <Text style={[styles.wishlistLabel, { color: theme.textSecondary }]}>
                Needs ({unpurchasedNeeds})
              </Text>
            </View>
          </View>

          <View style={styles.wishlistStat}>
            <View>
              <Text style={[styles.wishlistValue, { color: theme.text }]}>
                ₦{wantsTotal.toLocaleString()}
              </Text>
              <Text style={[styles.wishlistLabel, { color: theme.textSecondary }]}>
                Wants ({unpurchasedWants})
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.totalRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Total Wishlist</Text>
          <Text style={[styles.totalValue, { color: theme.primary }]}>
            ₦{totalWishlist.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Recent Budget Items */}
      {recentBudgetItems.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Budget Items</Text>
          
          {recentBudgetItems.map((item) => (
            <View key={item.id} style={[styles.listItem, { backgroundColor: theme.cardBackground }]}>
              <View style={[styles.itemIcon, { backgroundColor: theme.inputBackground }]}>
                <Text style={styles.itemEmoji}>{getCategoryEmoji(item.category)}</Text>
              </View>
              <View style={styles.itemDetails}>
                <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.itemSubtext, { color: theme.textSecondary }]}>
                  {item.period} • {item.category}
                  {item.isCompound && ` • ${item.subItems?.length || 0} items`}
                </Text>
              </View>
              <Text style={[styles.itemAmount, { color: theme.text }]}>
                ₦{item.amount.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Top Wishlist Items */}
      {topWishlistItems.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Priority Wishlist</Text>
          
          {topWishlistItems.map((item) => (
            <View key={item.id} style={[styles.listItem, { backgroundColor: theme.cardBackground }]}>
              <View style={[styles.itemIcon, { backgroundColor: theme.inputBackground }]}>
                <Text style={styles.itemEmoji}>{getCategoryEmoji(item.category)}</Text>
              </View>
              <View style={styles.itemDetails}>
                <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.itemSubtext, { color: theme.textSecondary }]}>
                  {item.type === 'need' ? 'Need' : 'Want'} • Priority: {item.importance}
                </Text>
              </View>
              <Text style={[styles.itemAmount, { color: theme.text }]}>
                ₦{item.amount.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Empty State */}
      {budgetItems.length === 0 && wishlistItems.length === 0 && (
        <View style={[styles.emptyState, { backgroundColor: theme.cardBackground }]}>
          <Text style={styles.emptyEmoji}>💡</Text>
          <Text style={[styles.emptyText, { color: theme.text }]}>Start Managing Your Money</Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Add budget items to track recurring expenses{'\n'}
            or create a wishlist for things you want to buy
          </Text>
        </View>
      )}
    <View style={styles.content}></View>
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
    paddingTop: 40,
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
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 12,
  },
  wishlistOverview: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  wishlistRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  wishlistStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  wishlistIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistIcon: {
    fontSize: 24,
  },
  wishlistValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  wishlistLabel: {
    fontSize: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemEmoji: {
    fontSize: 20,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtext: {
    fontSize: 12,
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});