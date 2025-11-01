import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface LoadingIndicatorProps {
  variant?: 'small' | 'large';
}

export default function LoadingIndicator({
  variant = 'small',
}: LoadingIndicatorProps) {
  const theme = useTheme();
  const styles = getStyles(variant);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={variant} color={theme.colors.primary} />
    </View>
  );
}

const getStyles = (variant: 'small' | 'large') =>
  StyleSheet.create({
    container: {
      ...(variant === 'small'
        ? {
            paddingVertical: 20,
            alignItems: 'center',
          }
        : {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
            paddingVertical: 40,
          }),
    },
  });
