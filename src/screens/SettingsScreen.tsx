import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { lightTheme, darkTheme } from '../utils/theme';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const budgetItems = useAppStore(state => state.budgetItems);
  const wishlistItems = useAppStore(state => state.wishlistItems);
  const resetData = useAppStore(state => state.resetData);
  const darkMode = useAppStore(state => state.darkMode);
  const setDarkMode = useAppStore(state => state.setDarkMode);

  const theme = darkMode ? darkTheme : lightTheme;

  const totalItems = budgetItems.length + wishlistItems.length;

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data?',
      `This will delete all ${totalItems} items (${budgetItems.length} budget items and ${wishlistItems.length} wishlist items). This action cannot be undone.`,
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

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={styles.spacer}></View>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Overview</Text>
        
        <View style={[styles.infoCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Budget Items</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{budgetItems.length}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Wishlist Items</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{wishlistItems.length}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Total Items</Text>
            <Text style={[styles.infoValue, { color: theme.primary }]}>{totalItems}</Text>
          </View>
        </View>
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
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                Stored locally on device
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}
          onPress={handleResetData}
        >
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🗑️</Text>
            <Text style={[styles.settingTitle, { color: theme.danger }]}>
              Reset All Data
            </Text>
          </View>
          <Text style={[styles.settingArrow, { color: theme.textTertiary }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Support</Text>
        
        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>❓</Text>
            <Text style={[styles.settingTitle, { color: theme.text }]}>Help & Support</Text>
          </View>
          <Text style={[styles.settingArrow, { color: theme.textTertiary }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>⭐</Text>
            <Text style={[styles.settingTitle, { color: theme.text }]}>Rate App</Text>
          </View>
          <Text style={[styles.settingArrow, { color: theme.textTertiary }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>📧</Text>
            <Text style={[styles.settingTitle, { color: theme.text }]}>Contact Us</Text>
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
            <Text style={[styles.settingTitle, { color: theme.text }]}>Terms & Privacy</Text>
          </View>
          <Text style={[styles.settingArrow, { color: theme.textTertiary }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={[styles.footer, { color: theme.textTertiary }]}>
        Made with 💚 for Smart Money Management{'\n'}
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
  spacer: {
    padding: 20,
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
  infoCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
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