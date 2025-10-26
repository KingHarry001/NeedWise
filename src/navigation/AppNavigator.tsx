import React from 'react';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import InsightsScreen from '../screens/InsightsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Text, View } from 'react-native';

// Define the types for your tab screens
export type TabNavigatorParamsList = {
  Home: undefined;
  'Add Expense': undefined;
  Insights: undefined;
  Settings: undefined;
};

// Create the bottom tab navigator with a specified type
const Tab = createBottomTabNavigator<TabNavigatorParamsList>();

export default function AppNavigator() {
  const screenOptions: BottomTabNavigationOptions = {
    tabBarActiveTintColor: '#2E7D32', // Active tab color (green)
    tabBarInactiveTintColor: '#999', // Inactive tab color (gray)
    tabBarStyle: {
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
      paddingBottom: 8,
      paddingTop: 8,
      height: 60,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '600',
    },
    headerStyle: {
      backgroundColor: 'white',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
  };

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} />,
          headerShown: false, // Hide header for home screen
        }}
      />
      <Tab.Screen
        name="Add Expense"
        component={AddExpenseScreen}
        options={{
          tabBarIcon: ({ color }) => <TabIcon emoji="➕" color={color} />,
        }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          tabBarIcon: ({ color }) => <TabIcon emoji="📊" color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => <TabIcon emoji="⚙️" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Simple emoji-based icon component
interface TabIconProps {
  emoji: string;
  color: string;
}

function TabIcon({ emoji, color }: TabIconProps) {
  return (
    <View>
      <Text style={{ fontSize: 24, opacity: color === '#2E7D32' ? 1 : 0.5 }}>
        {emoji}
      </Text>
    </View>
  );
}
