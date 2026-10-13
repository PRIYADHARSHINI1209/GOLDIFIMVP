import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/theme/colors';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { RoleSimulatorWidget } from '@/components/navigation/RoleSimulatorWidget';
import { useAuth } from '@/context/AuthContext';
import { Typography } from '@/theme/typography';

export default function AppLayout() {
  const { role } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.divider,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        },
        tabBarLabelStyle: {
          ...Typography.captionMedium,
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'grid' : 'grid-outline'} focused={focused} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: 'Customers',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'people' : 'people-outline'} focused={focused} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="loans"
        options={{
          title: 'Loans',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'receipt' : 'receipt-outline'} focused={focused} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Payments',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cash' : 'cash-outline'} focused={focused} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'ellipsis-horizontal-circle' : 'ellipsis-horizontal-circle-outline'}
              focused={focused}
              color={color as string}
            />
          ),
        }}
      />

      {/* Hidden subroutes accessible via navigation */}
      <Tabs.Screen name="inventory" options={{ href: null }} />
      <Tabs.Screen name="employees" options={{ href: null }} />
      <Tabs.Screen name="reports" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
