import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert, TextInput } from 'react-native';
import { useBudgetStore } from '../store/useBudgetStore';
import { lightTheme, darkTheme } from '../utils/theme';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  const budget = useBudgetStore(state => state.budget);
  const setBudget = useBudgetStore(state => state.setBudget);
  const resetData = useBudgetStore(state => state.resetData);
  const expenses = useBudgetStore(state => state.expenses);
  const darkMode = useBudgetStore(state => state.darkMode);
  const setDarkMode = useBudgetStore(state => state.setDarkMode);

  const theme = darkMode ? darkTheme : lightTheme;

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data?',
      `This will delete all ${expenses.length} expenses and reset your budget. This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetData();
            Alert.alert('Success', 'All data has been cleared!');
          },
        },
      ]
    );
  };

  const handleSaveBudget = () => {
    const newBudget = parseFloat(budgetInput);
    if (isNaN(newBudget) || newBudget <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid budget amount');
      return;
    }
    setBudget(newBudget);
    setIsEditingBudget(false);
    Alert.alert('Success', `Budget updated to ₦${newBudget.toLocaleString()}`);
  };

  const startEditingBudget = () => {
    setBudgetInput(budget.toString());
    setIsEditingBudget(true);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Profile</Text>
        
        <View style={[styles.profileCard, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>U</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>NeedWise User</Text>
            <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>{expenses.length} expenses tracked</Text>
          </View>
        </View>
      </View>

      {/* Budget Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Budget</Text>
        
        {isEditingBudget ? (
          <View style={[styles.budgetEditCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.label, { color: theme.text }]}>New Budget Amount</Text>
            <View style={[styles.budgetInputRow, { backgroundColor: theme.inputBackground }]}>
              <Text style={[styles.currencySymbol, { color: theme.textSecondary }]}>₦</Text>
              <TextInput
                style={[styles.budgetInput, { color: theme.text }]}
                keyboardType="numeric"
                value={budgetInput}
                onChangeText={setBudgetInput}
                placeholder="Enter amount"
                placeholderTextColor={theme.textTertiary}
                autoFocus
              />
            </View>
            <View style={styles.budgetButtonRow}>
              <TouchableOpacity
                style={[styles.budgetButton, styles.cancelButton, { backgroundColor: theme.inputBackground }]}
                onPress={() => setIsEditingBudget(false)}
              >
                <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.budgetButton, styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={handleSaveBudget}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.cardBackground }]} onPress={startEditingBudget}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>💰</Text>
              <View>
                <Text style={[styles.settingTitle, { color: theme.text }]}>Monthly Budget</Text>
                <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>₦{budget.toLocaleString()}</Text>
              </View>
            </View>
            <Text style={[styles.settingArrow, { color: theme.textTertiary }]}>›</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>📅</Text>
            <View>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Budget Period</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>Monthly</Text>
            </View>
          </View>
          <Text style={[styles.settingArrow, { color: theme.textTertiary }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Preferences</Text>
        
        <View style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={[styles.settingTitle, { color: theme.text }]}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: theme.border, true: '#81C784' }}
            thumbColor={notificationsEnabled ? theme.primary : '#f4f3f4'}
          />
        </View>

        <View style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🌙</Text>
            <Text style={[styles.settingTitle, { color: theme.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: theme.border, true: '#81C784' }}
            thumbColor={darkMode ? theme.primary : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>💱</Text>
            <View>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Currency</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>Nigerian Naira (₦)</Text>
            </View>
          </View>
          <Text style={[styles.settingArrow, { color: theme.textTertiary }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Data & Privacy */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Data & Privacy</Text>
        
        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>💾</Text>
            <View>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Data Storage</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>Stored locally on device</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.cardBackground }]} onPress={handleResetData}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🗑️</Text>
            <Text style={[styles.settingTitle, { color: theme.danger }]}>
              Reset All Data
            </Text>
          </View>
          <Text style={[styles.settingArrow, { color: theme.textTertiary }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>About</Text>
        
        <View style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>ℹ️</Text>
            <View>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Version</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>1.0.0</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>📝</Text>
            <Text style={[styles.settingTitle, { color: theme.text }]}>About NeedWise</Text>
          </View>
          <Text style={[styles.settingArrow, { color: theme.textTertiary }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={[styles.footer, { color: theme.textTertiary }]}>
        Made with 💚 by NeedWise Team{'\n'}
        All data stored securely on your device
      </Text>
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
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  budgetEditCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  budgetInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  budgetInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: 12,
  },
  budgetButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  budgetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {},
  saveButton: {},
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  settingArrow: {
    fontSize: 24,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 24,
    lineHeight: 18,
  },
});