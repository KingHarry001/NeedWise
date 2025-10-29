import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useAppStore } from "../store/useAppStore";
import { lightTheme, darkTheme } from "../utils/theme";

type ItemMode = "budget" | "wishlist";

export default function AddItemScreen() {
  const [mode, setMode] = useState<ItemMode>("wishlist");
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly">(
    "monthly"
  );
  const [isCompound, setIsCompound] = useState(false);
  const [selectedType, setSelectedType] = useState<"need" | "want">("need");
  const [importance, setImportance] = useState<1 | 2 | 3 | 4 | 5>(3);

  const addBudgetItem = useAppStore((state) => state.addBudgetItem);
  const addWishlistItem = useAppStore((state) => state.addWishlistItem);
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

  const handleSubmit = () => {
    if (!itemName.trim()) {
      Alert.alert("Missing Info", "Please enter item name");
      return;
    }
    if (!isCompound && (!amount || parseFloat(amount) <= 0)) {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
      return;
    }
    if (!selectedCategory) {
      Alert.alert("Missing Info", "Please select a category");
      return;
    }

    if (mode === "budget") {
      addBudgetItem({
        name: itemName,
        amount: isCompound ? 0 : parseFloat(amount),
        category: selectedCategory,
        period: selectedPeriod,
        isCompound,
        subItems: isCompound ? [] : undefined,
      });

      Alert.alert(
        "Budget Item Added! ✅",
        `${itemName} added to ${selectedPeriod} budget${
          isCompound ? "\nYou can now add sub-items in the Budgets tab" : ""
        }`,
        [{ text: "OK", onPress: resetForm }]
      );
    } else {
      if (!selectedType) {
        Alert.alert("Missing Info", "Please select Need or Want");
        return;
      }

      addWishlistItem({
        name: itemName,
        amount: parseFloat(amount),
        category: selectedCategory,
        type: selectedType,
        importance,
      });

      Alert.alert(
        "Added to Wishlist! ⭐",
        `${itemName}: ₦${parseFloat(amount).toLocaleString()}`,
        [{ text: "OK", onPress: resetForm }]
      );
    }
  };

  const resetForm = () => {
    setItemName("");
    setAmount("");
    setSelectedCategory("");
    setSelectedPeriod("monthly");
    setIsCompound(false);
    setSelectedType("need");
    setImportance(3);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.spacer}>
        <Text style={[styles.title, { color: theme.text }]}>Add New Item</Text>
      </View>

      {/* Mode Selection */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Add to</Text>
        <View style={styles.modeContainer}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
              mode === "budget" && {
                backgroundColor: theme.primary,
                borderColor: theme.primary,
              },
            ]}
            onPress={() => setMode("budget")}
          >
            <Text
              style={[
                styles.modeButtonText,
                { color: theme.text },
                mode === "budget" && { color: "white" },
              ]}
            >
              💰 Budget
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
              mode === "wishlist" && {
                backgroundColor: theme.secondary,
                borderColor: theme.secondary,
              },
            ]}
            onPress={() => setMode("wishlist")}
          >
            <Text
              style={[
                styles.modeButtonText,
                { color: theme.text },
                mode === "wishlist" && { color: "white" },
              ]}
            >
              ⭐ Wishlist
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Item Name */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Item Name</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.cardBackground,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder={
            mode === "budget"
              ? "e.g., Foodstuff, Rent"
              : "e.g., New Phone, Shoes"
          }
          placeholderTextColor={theme.textTertiary}
          value={itemName}
          onChangeText={setItemName}
        />
      </View>

      {/* Budget-specific: Period */}
      {mode === "budget" && (
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Period</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
                selectedPeriod === "weekly" && {
                  backgroundColor: theme.primaryLight,
                  borderColor: theme.primary,
                },
              ]}
              onPress={() => setSelectedPeriod("weekly")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  { color: theme.text },
                  selectedPeriod === "weekly" && { color: theme.primary },
                ]}
              >
                Weekly
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
                selectedPeriod === "monthly" && {
                  backgroundColor: theme.primaryLight,
                  borderColor: theme.primary,
                },
              ]}
              onPress={() => setSelectedPeriod("monthly")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  { color: theme.text },
                  selectedPeriod === "monthly" && { color: theme.primary },
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Budget-specific: Compound toggle */}
      {mode === "budget" && (
        <View style={styles.inputGroup}>
          <TouchableOpacity
            style={[
              styles.compoundToggle,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setIsCompound(!isCompound)}
          >
            <View style={styles.compoundLeft}>
              <Text style={[styles.compoundTitle, { color: theme.text }]}>
                Multiple Items
              </Text>
              <Text
                style={[
                  styles.compoundSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Like foodstuff with sub-items (pepper, flour, etc.)
              </Text>
            </View>
            <View
              style={[
                styles.checkbox,
                isCompound && { backgroundColor: theme.primary },
              ]}
            >
              {isCompound && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Amount */}
      {!isCompound && (
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Amount</Text>
          <View
            style={[
              styles.amountInputContainer,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[styles.currencySymbol, { color: theme.textSecondary }]}
            >
              ₦
            </Text>
            <TextInput
              style={[styles.amountInput, { color: theme.text }]}
              placeholder="0"
              placeholderTextColor={theme.textTertiary}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>
      )}

      {/* Category */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Category</Text>
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
                selectedCategory === category && {
                  backgroundColor: theme.secondary,
                  borderColor: theme.secondary,
                },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  { color: theme.text },
                  selectedCategory === category && { color: "white" },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Wishlist-specific: Type */}
      {mode === "wishlist" && (
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
                selectedType === "need" && {
                  backgroundColor: theme.primaryLight,
                  borderColor: theme.primary,
                },
              ]}
              onPress={() => setSelectedType("need")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  { color: theme.text },
                  selectedType === "need" && { color: theme.primary },
                ]}
              >
                Need
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
                selectedType === "want" && {
                  backgroundColor: theme.secondaryLight,
                  borderColor: theme.secondary,
                },
              ]}
              onPress={() => setSelectedType("want")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  { color: theme.text },
                  selectedType === "want" && { color: theme.secondary },
                ]}
              >
                Want
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Wishlist-specific: Importance */}
      {mode === "wishlist" && (
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            Priority (1-5)
          </Text>
          <View style={styles.importanceContainer}>
            {[1, 2, 3, 4, 5].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.importanceButton,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.border,
                  },
                  importance === level && {
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                  },
                ]}
                onPress={() => setImportance(level as 1 | 2 | 3 | 4 | 5)}
              >
                <Text
                  style={[
                    styles.importanceButtonText,
                    { color: theme.text },
                    importance === level && { color: "white" },
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.importanceHint, { color: theme.textSecondary }]}>
            1 = Low priority, 5 = Critical
          </Text>
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          {
            backgroundColor:
              mode === "budget" ? theme.primary : theme.secondary,
          },
        ]}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>
          {mode === "budget" ? "Add to Budget" : "Add to Wishlist"}
        </Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  spacer: {
    paddingTop: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  modeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  modeButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    alignItems: "center",
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
    paddingVertical: 12,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    alignItems: "center",
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  compoundToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  compoundLeft: {
    flex: 1,
  },
  compoundTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  compoundSubtitle: {
    fontSize: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  importanceContainer: {
    flexDirection: "row",
    gap: 8,
  },
  importanceButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  importanceButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  importanceHint: {
    fontSize: 12,
    marginTop: 8,
  },
  submitButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
