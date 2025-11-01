import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text } from '@/components/ui/text';
import type { NewsData } from '@/services/static-data';

interface NewsItemProps {
  item: NewsData[0];
  isBookmarked: boolean;
  onPress: () => void;
  onBookmarkPress: () => void;
}

export default function NewsItem({
  item,
  isBookmarked,
  onPress,
  onBookmarkPress,
}: NewsItemProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.list}>
      <TouchableOpacity
        style={styles.listContent}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.itemImage}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
        />
        <View style={styles.textContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemTitle}>
            {item.title}
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.itemDescription}
          >
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bookmarkButton}
        onPress={onBookmarkPress}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          size={24}
          color={isBookmarked ? '#007AFF' : '#666'}
        />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    list: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
      width: '100%',
      marginVertical: 15,
      paddingHorizontal: 16,
    },
    listContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
    },
    bookmarkButton: {
      padding: 4,
    },
    itemImage: {
      width: 56,
      height: 56,
      borderRadius: 12,
      backgroundColor: '#e0e0e0',
    },
    textContainer: {
      flex: 1,
      gap: 6,
    },
    itemTitle: {
      color: theme.colors.text,
      fontWeight: '500',
      fontSize: 18,
    },
    itemDescription: {
      fontWeight: '400',
      color: theme.colors.text,
      fontSize: 12,
    },
  });
