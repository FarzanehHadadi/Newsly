import {
  StyleSheet,
  Text,
  FlatList,
  Image,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import { useTheme, useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  getBookmarks,
  toggleBookmark,
  isBookmarked,
} from "@/services/bookmark";
import type { NewsItem } from "@/services/static-data";
import { Text as CustomText } from "@/components/ui/text";

export default function BookmarkScreen() {
  const [bookmarks, setBookmarks] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const theme = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();

  const loadBookmarks = useCallback(async () => {
    setIsLoading(true);
    try {
      const bookmarkData = await getBookmarks();
      console.log("📖 Loaded bookmarks:", bookmarkData.length);
      setBookmarks(bookmarkData);

      const ids = new Set<string>();
      for (const item of bookmarkData) {
        const bookmarked = await isBookmarked(item._id);
        if (bookmarked) ids.add(item._id);
      }
      setBookmarkedIds(ids);
      console.log("📖 Bookmarked IDs:", Array.from(ids));
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh bookmarks when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [loadBookmarks])
  );

  const handleBookmarkPress = async (item: NewsItem) => {
    const newBookmarked = await toggleBookmark(item);
    setBookmarkedIds((prev) => {
      const newSet = new Set(prev);
      if (newBookmarked) {
        newSet.add(item._id);
      } else {
        newSet.delete(item._id);
      }
      return newSet;
    });

    // Remove from bookmarks list if unbookmarked
    if (!newBookmarked) {
      setBookmarks((prev) => prev.filter((b) => b._id !== item._id));
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="bookmark-outline"
            size={64}
            color="#ccc"
          />
          <Text style={styles.emptyText}>No bookmarks yet</Text>
          <Text style={styles.emptySubtext}>
            Save articles to read them later
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <FlatList
        data={bookmarks}
        renderItem={({ item }) => (
          <View style={styles.list}>
            <TouchableOpacity
              style={styles.listContent}
              onPress={() => router.push(`/article/${item._id}`)}
              activeOpacity={0.7}
            >
              <Image
                src={item.imageUrl}
                width={56}
                height={56}
                style={styles.itemImage}
                resizeMode="cover"
              />
              <View style={styles.textContainer}>
                <CustomText
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.itemTitle}
                >
                  {item.title}
                </CustomText>
                <CustomText
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={styles.itemDescription}
                >
                  {item.description}
                </CustomText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={() => handleBookmarkPress(item)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={
                  bookmarkedIds.has(item._id) ? "bookmark" : "bookmark-outline"
                }
                size={24}
                color={bookmarkedIds.has(item._id) ? "#007AFF" : "#666"}
              />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.text,
      marginTop: 16,
    },
    emptySubtext: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.6,
      marginTop: 8,
    },
    list: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
      width: "100%",
      marginVertical: 15,
      paddingHorizontal: 16,
    },
    listContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flex: 1,
    },
    bookmarkButton: {
      padding: 4,
    },
    itemImage: {
      borderRadius: 12,
    },
    textContainer: {
      flex: 1,
      gap: 6,
    },
    itemTitle: {
      color: theme.colors.text,
      fontWeight: "500",
      fontSize: 18,
    },
    itemDescription: {
      fontWeight: "400",
      color: theme.colors.text,
      fontSize: 12,
    },
    contentContainer: {
      paddingBottom: 80,
    },
  });
