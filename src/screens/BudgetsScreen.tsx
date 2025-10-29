import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { useAppStore, BudgetItem, SubItem } from "../store/useAppStore";
import { lightTheme, darkTheme } from "../utils/theme";

export default function BudgetsScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingSubItem, setEditingSubItem] = useState<{
    budgetId: string;
    subItem: SubItem;
  } | null>(null);
  const [editingBudgetItem, setEditingBudgetItem] = useState<BudgetItem | null>(
    null
  );
  const [subItemName, setSubItemName] = useState("");
  const [subItemAmount, setSubItemAmount] = useState("");
  const [budgetName, setBudgetName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetCategory, setBudgetCategory] = useState("");

  const budgetItems = useAppStore((state) => state.budgetItems);
  const deleteBudgetItem = useAppStore((state) => state.deleteBudgetItem);
  const updateBudgetItem = useAppStore((state) => state.updateBudgetItem);
  const addSubItem = useAppStore((state) => state.addSubItem);
  const updateSubItem = useAppStore((state) => state.updateSubItem);
  const deleteSubItem = useAppStore((state) => state.deleteSubItem);
  const getTotalBudget = useAppStore((state) => state.getTotalBudget);
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

  const monthlyItems = budgetItems.filter((item) => item.period === "monthly");
  const weeklyItems = budgetItems.filter((item) => item.period === "weekly");

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

  const handleEditBudgetItem = (item: BudgetItem) => {
    setEditingBudgetItem(item);
    setBudgetName(item.name);
    setBudgetAmount(item.amount.toString());
    setBudgetCategory(item.category);
  };

  const saveBudgetEdit = () => {
    if (!editingBudgetItem) return;

    const amount = parseFloat(budgetAmount);
    if (
      !budgetName.trim() ||
      (isNaN(amount) && !editingBudgetItem.isCompound) ||
      !budgetCategory
    ) {
      Alert.alert("Invalid Input", "Please fill all fields correctly");
      return;
    }

    updateBudgetItem(editingBudgetItem.id, {
      name: budgetName,
      amount: editingBudgetItem.isCompound ? editingBudgetItem.amount : amount,
      category: budgetCategory,
    });

    setEditingBudgetItem(null);
    Alert.alert("✅ Updated!", `${budgetName} has been updated`);
  };

  const handleDeleteItem = (item: BudgetItem) => {
    Alert.alert(
      "Delete Budget Item",
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteBudgetItem(item.id),
        },
      ]
    );
  };

  const handleAddSubItem = (budgetId: string) => {
    Alert.prompt(
      "Add Sub-Item",
      "Enter item name and amount",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add",
          onPress: (text?: string) => {
            const parts = text?.split(",") || [];
            if (parts.length === 2) {
              const name = parts[0].trim();
              const amount = parseFloat(parts[1].trim());
              if (name && amount > 0) {
                addSubItem(budgetId, { name, amount });
              } else {
                Alert.alert("Invalid Input", "Please enter: Name, Amount");
              }
            } else {
              Alert.alert(
                "Invalid Format",
                "Use format: Name, Amount\nExample: Pepper, 5000"
              );
            }
          },
        },
      ],
      "plain-text",
      "",
      "default"
    );
  };

  const handleEditSubItem = (budgetId: string, subItem: SubItem) => {
    setEditingSubItem({ budgetId, subItem });
    setSubItemName(subItem.name);
    setSubItemAmount(subItem.amount.toString());
  };

  const saveSubItemEdit = () => {
    if (!editingSubItem) return;

    const amount = parseFloat(subItemAmount);
    if (!subItemName.trim() || isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Input", "Please enter valid name and amount");
      return;
    }

    updateSubItem(editingSubItem.budgetId, editingSubItem.subItem.id, {
      name: subItemName,
      amount,
    });

    setEditingSubItem(null);
  };

  const handleDeleteSubItem = (
    budgetId: string,
    subItemId: string,
    subItemName: string
  ) => {
    Alert.alert("Delete Sub-Item", `Delete "${subItemName}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteSubItem(budgetId, subItemId),
      },
    ]);
  };

  const renderBudgetItem = (item: BudgetItem) => {
    const isExpanded = expandedId === item.id;

    return (
      <View
        key={item.id}
        style={[styles.budgetItem, { backgroundColor: theme.cardBackground }]}
      >
        <TouchableOpacity
          style={styles.budgetHeader}
          onPress={() => setExpandedId(isExpanded ? null : item.id)}
          onLongPress={() => handleEditBudgetItem(item)}
        >
          <View
            style={[
              styles.itemIcon,
              { backgroundColor: theme.inputBackground },
            ]}
          >
            <Text style={styles.itemEmoji}>
              {getCategoryEmoji(item.category)}
            </Text>
          </View>
          <View style={styles.itemDetails}>
            <Text style={[styles.itemName, { color: theme.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.itemSubtext, { color: theme.textSecondary }]}>
              {item.category}
              {item.isCompound && ` • ${item.subItems?.length || 0} items`}
            </Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={[styles.itemAmount, { color: theme.text }]}>
              ₦{item.amount.toLocaleString()}
            </Text>
            {item.isCompound && (
              <Text style={[styles.expandIcon, { color: theme.textTertiary }]}>
                {isExpanded ? "▼" : "▶"}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {isExpanded && item.isCompound && item.subItems && (
          <View
            style={[styles.subItemsContainer, { borderTopColor: theme.border }]}
          >
            {item.subItems.map((subItem) => (
              <TouchableOpacity
                key={subItem.id}
                style={[
                  styles.subItem,
                  { backgroundColor: theme.inputBackground },
                ]}
                onPress={() => handleEditSubItem(item.id, subItem)}
                onLongPress={() =>
                  handleDeleteSubItem(item.id, subItem.id, subItem.name)
                }
              >
                <Text style={[styles.subItemName, { color: theme.text }]}>
                  • {subItem.name}
                </Text>
                <Text
                  style={[styles.subItemAmount, { color: theme.textSecondary }]}
                >
                  ₦{subItem.amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.addSubButton, { borderColor: theme.border }]}
              onPress={() => handleAddSubItem(item.id)}
            >
              <Text style={[styles.addSubButtonText, { color: theme.primary }]}>
                + Add Item
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.spacer}>
        <Text style={[styles.title, { color: theme.text }]}>Budget</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Monthly Items
        </Text>
        <View
          style={[styles.totalCard, { backgroundColor: theme.cardBackground }]}
        >
          <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>
            Total Monthly Budget
          </Text>
          <Text style={[styles.totalAmount, { color: theme.primary }]}>
            ₦{getTotalBudget("monthly").toLocaleString()}
          </Text>
        </View>
        {monthlyItems.length === 0 ? (
          <View
            style={[
              styles.emptyState,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No monthly budget items
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Tap + to add recurring expenses
            </Text>
          </View>
        ) : (
          monthlyItems.map(renderBudgetItem)
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Weekly Items
        </Text>
        <View
          style={[styles.totalCard, { backgroundColor: theme.cardBackground }]}
        >
          <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>
            Total Weekly Budget
          </Text>
          <Text style={[styles.totalAmount, { color: theme.secondary }]}>
            ₦{getTotalBudget("weekly").toLocaleString()}
          </Text>
        </View>
        {weeklyItems.length === 0 ? (
          <View
            style={[
              styles.emptyState,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No weekly budget items
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Tap + to add weekly expenses
            </Text>
          </View>
        ) : (
          weeklyItems.map(renderBudgetItem)
        )}
      </View>

      <View style={[styles.hintBox, { backgroundColor: theme.primaryLight }]}>
        <Text style={[styles.hintText, { color: theme.primary }]}>
          💡 Long press to edit • Tap compound items to expand
        </Text>
      </View>

      {/* Edit Budget Item Modal */}
      <Modal
        visible={editingBudgetItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingBudgetItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Edit Budget Item
            </Text>

            <TextInput
              style={[
                styles.modalInput,
                { backgroundColor: theme.inputBackground, color: theme.text },
              ]}
              placeholder="Item name"
              placeholderTextColor={theme.textTertiary}
              value={budgetName}
              onChangeText={setBudgetName}
            />

            {!editingBudgetItem?.isCompound && (
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
                  value={budgetAmount}
                  onChangeText={setBudgetAmount}
                />
              </View>
            )}

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
                    budgetCategory === cat && {
                      backgroundColor: theme.primary,
                      borderColor: theme.primary,
                    },
                  ]}
                  onPress={() => setBudgetCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: theme.text },
                      budgetCategory === cat && { color: "white" },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalDeleteBtn,
                  { backgroundColor: theme.danger },
                ]}
                onPress={() => {
                  setEditingBudgetItem(null);
                  if (editingBudgetItem) handleDeleteItem(editingBudgetItem);
                }}
              >
                <Text style={styles.modalDeleteText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalCancelBtn,
                  { backgroundColor: theme.inputBackground },
                ]}
                onPress={() => setEditingBudgetItem(null)}
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
                onPress={saveBudgetEdit}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Sub-Item Modal */}
      <Modal
        visible={editingSubItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingSubItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Edit Sub-Item
            </Text>

            <TextInput
              style={[
                styles.modalInput,
                { backgroundColor: theme.inputBackground, color: theme.text },
              ]}
              placeholder="Item name"
              placeholderTextColor={theme.textTertiary}
              value={subItemName}
              onChangeText={setSubItemName}
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
                value={subItemAmount}
                onChangeText={setSubItemAmount}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalCancelBtn,
                  { backgroundColor: theme.inputBackground },
                ]}
                onPress={() => setEditingSubItem(null)}
              >
                <Text
                  style={[
                    styles.modalButtonText,
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
                onPress={saveSubItemEdit}
              >
                <Text style={[styles.modalButtonText, { color: "white" }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24 },
  spacer: { paddingTop: 30 },
  totalCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  totalLabel: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  totalAmount: { fontSize: 32, fontWeight: "bold" },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  budgetItem: {
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetHeader: { flexDirection: "row", alignItems: "center", padding: 16 },
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
  itemName: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  itemSubtext: { fontSize: 12 },
  itemRight: { alignItems: "flex-end" },
  itemAmount: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  expandIcon: { fontSize: 12 },
  subItemsContainer: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  subItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  subItemName: { fontSize: 14, flex: 1 },
  subItemAmount: { fontSize: 14, fontWeight: "600" },
  addSubButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    marginTop: 4,
  },
  addSubButtonText: { fontSize: 14, fontWeight: "600" },
  emptyState: {
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  emptySubtext: { fontSize: 14, textAlign: "center" },
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
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  modalInput: { borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 12 },
  modalAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
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
  categoryScroll: { marginBottom: 20 },
  categoryChip: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryChipText: { fontSize: 14, fontWeight: "500" },
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
  modalButtonText: { fontSize: 16, fontWeight: "600" },
});
