import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/theme/colors';
import { GoldifiLogo } from '@/components/ui/GoldifiLogo';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(app)/dashboard');
      } else {
        router.replace('/(auth)/welcome');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <GoldifiLogo size="lg" />
      <ActivityIndicator size="small" color={Colors.primary} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginTop: 24,
  },
});
