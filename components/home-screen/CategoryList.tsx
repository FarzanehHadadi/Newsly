import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/button';
import type { Category } from '@/services/netlify-news';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryPress: (categoryName: string | null) => void;
}

export default function CategoryList({
  categories,
  selectedCategory,
  onCategoryPress,
}: CategoryListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      bounces={false}
      alwaysBounceHorizontal={false}
    >
      <Button
        variant="link"
        size="sm"
        label="All"
        onPress={() => onCategoryPress(null)}
      />
      {categories.map((category) => (
        <Button
          key={category._id}
          variant="link"
          size="sm"
          label={category.displayName}
          onPress={() => onCategoryPress(category.name)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 20,
  },
});
