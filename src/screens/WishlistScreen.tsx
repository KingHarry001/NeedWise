import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useAppStore, WishlistItem } from "../store/useAppStore";
import { lightTheme, darkTheme } from "../utils/theme";

export default function WishlistScreen() {
  const [activeTab, setActiveTab] = useState<"needs" | "wants">("needs");
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImportance, setEditImportance] = useState<1 | 2 | 3 | 4 | 5>(3);

  const wishlistItems = useAppStore((state) => state.wishlistItems);
  const deleteWishlistItem = useAppStore((state) => state.deleteWishlistItem);
  const updateWishlistItem = useAppStore((state) => state.updateWishlistItem);
  const togglePurchased = useAppStore((state) => state.togglePurchased);
  const getTotalWishlist = useAppStore((state) => state.getTotalWishlist);
  const getWishlistByType = useAppStore((state) => state.getWishlistByType);
  const darkMode = useAppStore((state) => state.darkMode);

  const theme = darkMode ? darkTheme : lightTheme;
  const categories = [
    "Food",
    "Transport",
    "Utilities",
    "Entertainment",
    "Shopping",
    "Health",
    "Rent",
    "Others",
  ];

  const needsItems = getWishlistByType("need");
  const wantsItems = getWishlistByType("want");
  const needsTotal = getTotalWishlist("need");
  const wantsTotal = getTotalWishlist("want");
  const purchasedItems = wishlistItems.filter((item) => item.isPurchased);

  const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      Food: "🛒",
      Transport: "🚗",
      Utilities: "⚡",
      Entertainment: "🎮",
      Shopping: "🛍️",
      Health: "🏥",
      Rent: "🏠",
      Others: "📦",
    };
    return emojiMap[category] || "💰";
  };

  const getPriorityColor = (importance: number) => {
    if (importance >= 4) return theme.danger;
    if (importance === 3) return theme.warning;
    return theme.textSecondary;
  };

  const handleEdit = (item: WishlistItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditAmount(item.amount.toString());
    setEditCategory(item.category);
    setEditImportance(item.importance);
  };

  const saveEdit = () => {
    if (!editingItem) return;

    const amount = parseFloat(editAmount);
    if (!editName.trim() || isNaN(amount) || amount <= 0 || !editCategory) {
      Alert.alert("Invalid Input", "Please fill all fields correctly");
      return;
    }

    updateWishlistItem(editingItem.id, {
      name: editName,
      amount,
      category: editCategory,
      importance: editImportance,
    });

    setEditingItem(null);
    Alert.alert("✅ Updated!", `${editName} has been updated`);
  };

  const handleDelete = (item: WishlistItem) => {
    Alert.alert("Delete Item", `Delete "${item.name}" from wishlist?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteWishlistItem(item.id),
      },
    ]);
  };

  const handleTogglePurchased = (item: WishlistItem) => {
    togglePurchased(item.id);
    if (!item.isPurchased) {
      Alert.alert("✅ Purchased!", `${item.name} marked as purchased`);
    }
  };

  const renderWishlistItem = (item: WishlistItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.wishlistItem, { backgroundColor: theme.cardBackground }]}
      onPress={() => handleEdit(item)}
      onLongPress={() => handleTogglePurchased(item)}
    >
      <View
        style={[styles.itemIcon, { backgroundColor: theme.inputBackground }]}
      >
        <Text style={styles.itemEmoji}>{getCategoryEmoji(item.category)}</Text>
      </View>

      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: theme.text }]}>
          {item.name}
        </Text>
        <View style={styles.itemMetaRow}>
          <Text style={[styles.itemCategory, { color: theme.textSecondary }]}>
            {item.category}
          </Text>
          <View style={styles.priorityBadge}>
            <Text
              style={[
                styles.priorityText,
                { color: getPriorityColor(item.importance) },
              ]}
            >
              {"★".repeat(item.importance)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.itemAmount, { color: theme.text }]}>
        ₦{item.amount.toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.spacer}>
        <Text style={[styles.title, { color: theme.text }]}>Wishlist</Text>
      </View>

      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.totalRow}>
          <View style={styles.totalItem}>
            <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>
              Needs
            </Text>
            <Text style={[styles.totalAmount, { color: theme.primary }]}>
              ₦{needsTotal.toLocaleString()}
            </Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalItem}>
            <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>
              Wants
            </Text>
            <Text style={[styles.totalAmount, { color: theme.secondary }]}>
              ₦{wantsTotal.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.tabsContainer,
          { backgroundColor: theme.cardBackground },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "needs" && {
              borderBottomColor: theme.primary,
              borderBottomWidth: 3,
            },
          ]}
          onPress={() => setActiveTab("needs")}
        >
          <Text
            style={[
              styles.tabText,
              { color: theme.textSecondary },
              activeTab === "needs" && {
                color: theme.primary,
                fontWeight: "bold",
              },
            ]}
          >
            Needs ({needsItems.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "wants" && {
              borderBottomColor: theme.secondary,
              borderBottomWidth: 3,
            },
          ]}
          onPress={() => setActiveTab("wants")}
        >
          <Text
            style={[
              styles.tabText,
              { color: theme.textSecondary },
              activeTab === "wants" && {
                color: theme.secondary,
                fontWeight: "bold",
              },
            ]}
          >
            Wants ({wantsItems.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {activeTab === "needs" ? (
          needsItems.length === 0 ? (
            <View
              style={[
                styles.emptyState,
                { backgroundColor: theme.cardBackground },
              ]}
            >
              <Text style={styles.emptyEmoji}>✅</Text>
              <Text style={[styles.emptyText, { color: theme.text }]}>
                No Needs Yet
              </Text>
              <Text
                style={[styles.emptySubtext, { color: theme.textSecondary }]}
              >
                Add essential items you need to get
              </Text>
            </View>
          ) : (
            needsItems.map(renderWishlistItem)
          )
        ) : wantsItems.length === 0 ? (
          <View
            style={[
              styles.emptyState,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={styles.emptyEmoji}>💫</Text>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No Wants Yet
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Add items you'd like to have
            </Text>
          </View>
        ) : (
          wantsItems.map(renderWishlistItem)
        )}

        {purchasedItems.length > 0 && (
          <View style={styles.purchasedSection}>
            <Text
              style={[styles.purchasedTitle, { color: theme.textSecondary }]}
            >
              Purchased ({purchasedItems.length})
            </Text>
            {purchasedItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.purchasedItem,
                  { backgroundColor: theme.inputBackground },
                ]}
                onPress={() => handleTogglePurchased(item)}
                onLongPress={() => handleDelete(item)}
              >
                <Text
                  style={[styles.purchasedName, { color: theme.textTertiary }]}
                >
                  ✓ {item.name}
                </Text>
                <Text
                  style={[
                    styles.purchasedAmount,
                    { color: theme.textTertiary },
                  ]}
                >
                  ₦{item.amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={[styles.hintBox, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.hintText, { color: theme.primary }]}>
            💡 Tap to edit • Long press to mark purchased/delete
          </Text>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editingItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Edit Wishlist Item
            </Text>

            <TextInput
              style={[
                styles.modalInput,
                { backgroundColor: theme.inputBackground, color: theme.text },
              ]}
              placeholder="Item name"
              placeholderTextColor={theme.textTertiary}
              value={editName}
              onChangeText={setEditName}
            />

            <View
              style={[
                styles.modalAmountRow,
                { backgroundColor: theme.inputBackground },
              ]}
            >
              <Text
                style={[styles.modalCurrency, { color: theme.textSecondary }]}
              >
                ₦
              </Text>
              <TextInput
                style={[styles.modalAmountInput, { color: theme.text }]}
                placeholder="0"
                placeholderTextColor={theme.textTertiary}
                keyboardType="numeric"
                value={editAmount}
                onChangeText={setEditAmount}
              />
            </View>

            <Text style={[styles.modalLabel, { color: theme.text }]}>
              Category
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: theme.inputBackground,
                      borderColor: theme.border,
                    },
                    editCategory === cat && {
                      backgroundColor: theme.secondary,
                      borderColor: theme.secondary,
                    },
                  ]}
                  onPress={() => setEditCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: theme.text },
                      editCategory === cat && { color: "white" },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.modalLabel, { color: theme.text }]}>
              Priority
            </Text>
            <View style={styles.importanceContainer}>
              {[1, 2, 3, 4, 5].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.importanceBtn,
                    {
                      backgroundColor: theme.inputBackground,
                      borderColor: theme.border,
                    },
                    editImportance === level && {
                      backgroundColor: theme.primary,
                      borderColor: theme.primary,
                    },
                  ]}
                  onPress={() => setEditImportance(level as 1 | 2 | 3 | 4 | 5)}
                >
                  <Text
                    style={[
                      styles.importanceBtnText,
                      { color: theme.text },
                      editImportance === level && { color: "white" },
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalDeleteBtn,
                  { backgroundColor: theme.danger },
                ]}
                onPress={() => {
                  setEditingItem(null);
                  if (editingItem) handleDelete(editingItem);
                }}
              >
                <Text style={styles.modalDeleteText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalCancelBtn,
                  { backgroundColor: theme.inputBackground },
                ]}
                onPress={() => setEditingItem(null)}
              >
                <Text
                  style={[
                    styles.modalCancelText,
                    { color: theme.textSecondary },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalSaveBtn,
                  { backgroundColor: theme.primary },
                ]}
                onPress={saveEdit}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24 },
  spacer: { paddingTop: 50, paddingLeft: 20 },
  totalRow: { flexDirection: "row", alignItems: "center" },
  totalItem: { flex: 1, alignItems: "center" },
  totalDivider: { width: 1, height: 40, backgroundColor: "#E0E0E0" },
  totalLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  totalAmount: { fontSize: 24, fontWeight: "bold" },
  tabsContainer: {
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabText: { fontSize: 16, fontWeight: "500" },
  scrollView: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  wishlistItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemEmoji: { fontSize: 20 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  itemMetaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  itemCategory: { fontSize: 12 },
  priorityBadge: { flexDirection: "row" },
  priorityText: { fontSize: 12, fontWeight: "bold" },
  itemAmount: { fontSize: 16, fontWeight: "bold" },
  emptyState: {
    borderRadius: 16,
    padding: 48,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  emptySubtext: { fontSize: 14, textAlign: "center" },
  purchasedSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  purchasedTitle: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  purchasedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
  },
  purchasedName: { fontSize: 14, textDecorationLine: "line-through" },
  purchasedAmount: { fontSize: 14, textDecorationLine: "line-through" },
  hintBox: { marginTop: 24, padding: 16, borderRadius: 12, borderLeftWidth: 4 },
  hintText: { fontSize: 13, lineHeight: 18 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  modalInput: { borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 12 },
  modalAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modalCurrency: { fontSize: 20, fontWeight: "bold", marginRight: 8 },
  modalAmountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    paddingVertical: 12,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 8,
  },
  categoryScroll: { marginBottom: 16 },
  categoryChip: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryChipText: { fontSize: 14, fontWeight: "500" },
  importanceContainer: { flexDirection: "row", gap: 8, marginBottom: 20 },
  importanceBtn: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  importanceBtnText: { fontSize: 16, fontWeight: "600" },
  modalButtons: { flexDirection: "row", gap: 8 },
  modalDeleteBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalDeleteText: { color: "white", fontSize: 16, fontWeight: "600" },
  modalCancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalCancelText: { fontSize: 16, fontWeight: "600" },
  modalSaveBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalSaveText: { color: "white", fontSize: 16, fontWeight: "600" },
});
