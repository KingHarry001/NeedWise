import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useBudgetStore } from '../store/useBudgetStore';

export default function AddExpenseScreen() {
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedType, setSelectedType] = useState<'need' | 'want' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [importance, setImportance] = useState<1 | 2 | 3 | 4 | 5>(3);

  // Get action from store
  const addExpense = useBudgetStore(state => state.addExpense);

  const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health'];

  const handleAddExpense = () => {
    // Validation
    if (!expenseName.trim()) {
      Alert.alert('Missing Info', 'Please enter expense name');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    if (!selectedType) {
      Alert.alert('Missing Info', 'Please select Need or Want');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Missing Info', 'Please select a category');
      return;
    }

    // Add to store
    addExpense({
      name: expenseName,
      amount: parseFloat(amount),
      category: selectedCategory,
      type: selectedType,
      importance: importance,
    });

    // Success feedback
    Alert.alert(
      'Expense Added! ✅',
      `${expenseName}: ₦${parseFloat(amount).toLocaleString()}\nSaved successfully!`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Clear form
            setExpenseName('');
            setAmount('');
            setSelectedType(null);
            setSelectedCategory('');
            setImportance(3);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Add New Expense</Text>

      {/* Expense Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Expense Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Groceries, Netflix"
          value={expenseName}
          onChangeText={setExpenseName}
        />
      </View>

      {/* Amount */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Amount</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>₦</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
      </View>

      {/* Need or Want */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === 'need' && styles.typeButtonActive,
            ]}
            onPress={() => setSelectedType('need')}
          >
            <Text
              style={[
                styles.typeButtonText,
                selectedType === 'need' && styles.typeButtonTextActive,
              ]}
            >
              Need
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === 'want' && styles.typeButtonActive,
            ]}
            onPress={() => setSelectedType('want')}
          >
            <Text
              style={[
                styles.typeButtonText,
                selectedType === 'want' && styles.typeButtonTextActive,
              ]}
            >
              Want
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.categoryButtonTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Importance */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Importance (1-5)</Text>
        <View style={styles.importanceContainer}>
          {[1, 2, 3, 4, 5].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.importanceButton,
                importance === level && styles.importanceButtonActive,
              ]}
              onPress={() => setImportance(level as 1 | 2 | 3 | 4 | 5)}
            >
              <Text
                style={[
                  styles.importanceButtonText,
                  importance === level && styles.importanceButtonTextActive,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.importanceHint}>
          1 = Low priority, 5 = Critical
        </Text>
      </View>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
        <Text style={styles.addButtonText}>Add Expense</Text>
      </TouchableOpacity>
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
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#2E7D32',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryButtonActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  importanceContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  importanceButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  importanceButtonActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  importanceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  importanceButtonTextActive: {
    color: 'white',
  },
  importanceHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  addButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});