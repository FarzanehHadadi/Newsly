import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text } from '@/components/ui/text';

interface OfflineBadgeProps {
  variant?: 'default' | 'sticky';
}

export default function OfflineBadge({
  variant = 'default',
}: OfflineBadgeProps) {
  return (
    <View
      style={variant === 'sticky' ? styles.stickyBadge : styles.defaultBadge}
    >
      <MaterialCommunityIcons
        name="wifi-off"
        size={variant === 'sticky' ? 14 : 16}
        color="#fff"
      />
      <Text
        style={variant === 'sticky' ? styles.stickyText : styles.defaultText}
      >
        Offline
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  defaultBadge: {
    backgroundColor: '#ff4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  defaultText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  stickyBadge: {
    backgroundColor: '#ff4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
    borderRadius: 4,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  stickyText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
});
