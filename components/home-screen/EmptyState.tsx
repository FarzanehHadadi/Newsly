import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text } from '@/components/ui/text';

interface EmptyStateProps {
  isSearchMode: boolean;
  searchQuery?: string;
  selectedCategory?: string | null;
  categoryDisplayName?: string | null;
}

export default function EmptyState({
  isSearchMode,
  searchQuery = '',
  selectedCategory,
  categoryDisplayName,
}: EmptyStateProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={isSearchMode ? 'magnify' : 'newspaper-variant-outline'}
        size={64}
        color={(theme.colors as any).secondaryText || '#999'}
      />
      <Text style={styles.title}>
        {isSearchMode ? 'No results found' : 'No articles found'}
      </Text>
      <Text style={styles.message}>
        {isSearchMode
          ? `No articles found for "${searchQuery}". Try a different search term.`
          : selectedCategory
          ? `No articles available in ${
              categoryDisplayName || selectedCategory
            } category.`
          : 'No articles available at the moment. Please try again later.'}
      </Text>
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 400,
      paddingVertical: 60,
      paddingHorizontal: 32,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      marginTop: 24,
      marginBottom: 8,
      textAlign: 'center',
      color: theme.colors.text,
    },
    message: {
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
      color: (theme.colors as any).secondaryText || '#666',
    },
  });
