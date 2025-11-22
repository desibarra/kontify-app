import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface KontifyLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export function KontifyLogo({ size = 'medium', showText = true }: KontifyLogoProps) {
  const sizes = {
    small: { icon: 20, text: 14, container: 32 },
    medium: { icon: 24, text: 16, container: 40 },
    large: { icon: 32, text: 20, container: 50 },
  };

  const currentSize = sizes[size];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#92BF4E', '#7DA842']}
        style={[styles.iconContainer, { width: currentSize.container, height: currentSize.container }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="shield-checkmark" size={currentSize.icon} color="#000" />
      </LinearGradient>
      {showText && (
        <Text style={[styles.text, { fontSize: currentSize.text }]}>
          Kontify<Text style={styles.textAccent}>+</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#92BF4E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  textAccent: {
    color: '#92BF4E',
    fontWeight: '800',
  },
});
