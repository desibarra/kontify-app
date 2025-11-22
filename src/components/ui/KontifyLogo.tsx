import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface KontifyLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export function KontifyLogo({ size = 'medium' }: KontifyLogoProps) {
  const sizes = {
    small: { width: 100, height: 40 },
    medium: { width: 140, height: 56 },
    large: { width: 180, height: 72 },
  };

  const currentSize = sizes[size];

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/logo.png')}
        style={[styles.logoImage, { width: currentSize.width, height: currentSize.height }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
});
