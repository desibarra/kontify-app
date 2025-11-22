import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

interface KontifyLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export function KontifyLogo({ size = 'medium', showText = true }: KontifyLogoProps) {
  const sizes = {
    small: { icon: 40, text: 18, gap: 10 },
    medium: { icon: 40, text: 20, gap: 10 },
    large: { icon: 40, text: 24, gap: 12 },
  };

  const currentSize = sizes[size];

  return (
    <View style={[styles.container, { gap: currentSize.gap }]}>
      <Image
        source={require('../../../assets/images/logo.png')}
        style={{ width: currentSize.icon, height: currentSize.icon }}
        resizeMode="contain"
      />
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
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textAccent: {
    color: '#93EC80',
    fontWeight: '700',
  },
});
