import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function ThemedTabs() {
  const { darkMode } = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: darkMode ? Colors.dark.tint : Colors.light.tint,
        tabBarInactiveTintColor: darkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: darkMode ? Colors.dark.background : Colors.light.background,
          },
          default: {
            backgroundColor: darkMode ? Colors.dark.background : Colors.light.background,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="log-in" size={28} color={color} style={{ opacity: focused ? 1 : 0.7 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/images/home.png')}
              style={{ width: 28, height: 28, tintColor: color, opacity: focused ? 1 : 0.7 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="TransactionsScreen"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="swap-horizontal" size={28} color={color} style={{ opacity: focused ? 1 : 0.7 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="ReportsScreen"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="bar-chart" size={28} color={color} style={{ opacity: focused ? 1 : 0.7 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/images/user.png')}
              style={{ width: 28, height: 28, tintColor: color, opacity: focused ? 1 : 0.7 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="search" size={28} color={color} style={{ opacity: focused ? 1 : 0.7 }} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <ThemeProvider>
      <ThemedTabs />
    </ThemeProvider>
  );
}
