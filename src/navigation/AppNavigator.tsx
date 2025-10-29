import React from "react";
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import BudgetsScreen from "../screens/BudgetsScreen";
import AddItemScreen from "./AddItemScreen";
import WishlistScreen from "../screens/WishlistScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Text, View, StyleSheet, Platform } from "react-native";
import { useAppStore } from "../store/useBudgetStore";

export type TabNavigatorParamsList = {
  Home: undefined;
  Budgets: undefined;
  "Add Item": undefined;
  Wishlist: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabNavigatorParamsList>();

export default function AppNavigator() {
  const darkMode = useAppStore((state) => state.darkMode);

  const screenOptions: BottomTabNavigationOptions = {
    tabBarActiveTintColor: darkMode ? "#4CAF50" : "#2E7D32",
    tabBarInactiveTintColor: darkMode ? "#666" : "#999",
    tabBarStyle: {
      backgroundColor: darkMode ? "#1E1E1E" : "#FFFFFF",
      borderTopWidth: 0,
      paddingBottom: Platform.OS === "ios" ? 20 : 8,
      paddingTop: 8,
      height: Platform.OS === "ios" ? 85 : 65,
      elevation: 0,
      shadowColor: darkMode ? "#000" : "#000",
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: darkMode ? 0.3 : 0.1,
      shadowRadius: 12,
      position: "absolute",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: "600",
      marginTop: 4,
    },
    headerShown: false, // Hide all headers
    tabBarBackground: () => (
      <View
        style={[
          styles.tabBarBackground,
          { backgroundColor: darkMode ? "#1E1E1E" : "#FFFFFF" },
        ]}
      />
    ),
  };

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              emoji="🏠"
              color={color}
              focused={focused}
              darkMode={darkMode}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Budgets"
        component={BudgetsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              emoji="💰"
              color={color}
              focused={focused}
              darkMode={darkMode}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Add Item"
        component={AddItemScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              emoji="➕"
              color={color}
              focused={focused}
              darkMode={darkMode}
              isCenter
            />
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              emoji="⭐"
              color={color}
              focused={focused}
              darkMode={darkMode}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              emoji="⚙️"
              color={color}
              focused={focused}
              darkMode={darkMode}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

interface TabIconProps {
  emoji: string;
  color: string;
  focused: boolean;
  darkMode: boolean;
  isCenter?: boolean;
}

function TabIcon({ emoji, color, focused, darkMode, isCenter }: TabIconProps) {
  if (isCenter) {
    return (
      <View
        style={[
          styles.centerIconContainer,
          {
            backgroundColor: darkMode ? "#4CAF50" : "#2E7D32",
            shadowColor: darkMode ? "#4CAF50" : "#2E7D32",
          },
        ]}
      >
        <Text style={styles.centerIconText}>{emoji}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.iconContainer,
        focused && {
          backgroundColor: darkMode
            ? "rgba(76, 175, 80, 0.15)"
            : "rgba(46, 125, 50, 0.1)",
        },
      ]}
    >
      <Text style={[styles.iconText, { opacity: focused ? 1 : 0.5 }]}>
        {emoji}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 24,
  },
  centerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centerIconText: {
    fontSize: 28,
  },
});