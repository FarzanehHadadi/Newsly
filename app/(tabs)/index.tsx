import { Button } from "@/components/ui/button";
import CarouselComponent from "@/components/ui/carousel";
import { useTheme, useFocusEffect } from "@react-navigation/native";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { NewsData } from "@/services/static-data";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { fetchNews, searchNews } from "@/services/netlify-news";
import { toggleBookmark, isBookmarked } from "@/services/bookmark";

export default function HomeScreen() {
  const [data, setData] = useState<NewsData>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const isManualToggleRef = useRef(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const stickySearchOpacity = useRef(new Animated.Value(0)).current;
  const stickySearchTranslateY = useRef(new Animated.Value(-60)).current;
  const searchInputRef = useRef<TextInput>(null);
  const HEADER_HEIGHT = 250;

  const refreshBookmarks = useCallback(async () => {
    if (isManualToggleRef.current) {
      isManualToggleRef.current = false;
      return; // Skip loading bookmarks if we just manually toggled
    }

    if (data.length === 0) return;

    const ids = new Set<string>();
    for (const item of data) {
      const bookmarked = await isBookmarked(item._id);
      if (bookmarked) ids.add(item._id);
    }
    setBookmarkedIds(ids);
  }, [data]);

  useEffect(() => {
    // Load bookmarks when data changes
    refreshBookmarks();
  }, [refreshBookmarks]);

  // Refresh bookmarks when screen comes into focus (e.g., when returning from article detail)
  useFocusEffect(
    useCallback(() => {
      // Only refresh if we have data and it's not a manual toggle
      if (data.length > 0 && !isManualToggleRef.current) {
        const refresh = async () => {
          const ids = new Set<string>();
          for (const item of data) {
            const bookmarked = await isBookmarked(item._id);
            if (bookmarked) ids.add(item._id);
          }
          setBookmarkedIds(ids);
        };
        refresh();
      }
    }, [data])
  );

  useEffect(() => {
    const loadInitialData = async () => {
      if (!isSearchMode) {
        const result = await fetchNews(null, 1);
        setData(result.articles);
        setHasNextPage(result.pagination.hasNextPage || false);
        setCurrentPage(1);
      }
    };
    loadInitialData();
  }, [isSearchMode]);

  // Animate sticky search bar based on scroll position
  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      if (value > HEADER_HEIGHT) {
        Animated.parallel([
          Animated.timing(stickySearchOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(stickySearchTranslateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(stickySearchOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(stickySearchTranslateY, {
            toValue: -60,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });

    return () => {
      scrollY.removeListener(listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setIsSearchMode(false);
      const result = await fetchNews(null, 1);
      setData(result.articles);
      setHasNextPage(result.pagination.hasNextPage || false);
      setCurrentPage(1);
      return;
    }

    setIsSearching(true);
    setIsSearchMode(true);
    const results = await searchNews(searchQuery);
    setData(results);
    setHasNextPage(false);
    setIsSearching(false);
  };

  const loadMoreArticles = async () => {
    if (!hasNextPage || isLoadingMore || isSearchMode) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const result = await fetchNews(null, nextPage);

    if (result.articles.length > 0) {
      setData((prev) => [...prev, ...result.articles]);
      setHasNextPage(result.pagination.hasNextPage || false);
      setCurrentPage(nextPage);
    } else {
      setHasNextPage(false);
    }
    setIsLoadingMore(false);
  };

  const handleBookmarkPress = async (item: NewsData[0]) => {
    // Mark that we're doing a manual toggle to prevent useEffect from interfering
    isManualToggleRef.current = true;

    // Optimistically update the UI immediately
    const currentlyBookmarked = bookmarkedIds.has(item._id);
    setBookmarkedIds((prev) => {
      const newSet = new Set(prev);
      if (currentlyBookmarked) {
        newSet.delete(item._id);
      } else {
        newSet.add(item._id);
      }
      return newSet;
    });

    // Perform the actual toggle
    await toggleBookmark(item);

    // Verify and sync with actual state
    const actualBookmarked = await isBookmarked(item._id);
    setBookmarkedIds((prev) => {
      const newSet = new Set(prev);
      if (actualBookmarked) {
        newSet.add(item._id);
      } else {
        newSet.delete(item._id);
      }
      return newSet;
    });

    // Reset the flag after a short delay
    setTimeout(() => {
      isManualToggleRef.current = false;
    }, 300);
  };

  const theme = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();

  const stickySearchAnimatedStyle = {
    opacity: stickySearchOpacity,
    transform: [{ translateY: stickySearchTranslateY }],
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {/* Sticky Search Bar */}
      <Animated.View
        style={[
          styles.stickySearchContainer,
          stickySearchAnimatedStyle,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View style={styles.stickySearchInner}>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={searchInputRef}
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search"
              placeholderTextColor={
                (theme.colors as any).secondaryText || "#666"
              }
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.iconWrapper} onPress={handleSearch}>
              <MaterialCommunityIcons
                name="magnify"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <FlatList
        data={isSearching ? [] : data}
        onScroll={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y;
          scrollY.setValue(offsetY);
        }}
        scrollEventThrottle={16}
        onEndReached={loadMoreArticles}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          isSearching ? (
            <View style={styles.listLoadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : null
        }
        ListHeaderComponent={
          <>
            {/* Search Bar with right icon */}
            <View style={styles.searchContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.searchInput, { color: theme.colors.text }]}
                  placeholder="Search"
                  placeholderTextColor={
                    (theme.colors as any).secondaryText || "#666"
                  }
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                />
                <TouchableOpacity
                  style={styles.iconWrapper}
                  onPress={handleSearch}
                >
                  <MaterialCommunityIcons
                    name="magnify"
                    size={24}
                    color={theme.colors.text}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Categories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryContainer}
            >
              <Button variant="link" size="sm" label="All" onPress={() => {}} />
              <Button
                variant="link"
                size="sm"
                label="Sport"
                onPress={() => {}}
              />
              <Button
                variant="link"
                size="sm"
                label="Weather"
                onPress={() => {}}
              />
              <Button
                variant="link"
                size="sm"
                label="Tech"
                onPress={() => {}}
              />
            </ScrollView>

            {/* Carousel */}
            <CarouselComponent />
          </>
        }
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
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.itemTitle}
                >
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
    stickySearchContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      paddingTop: 10,
      paddingBottom: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    stickySearchInner: {
      paddingHorizontal: 16,
    },
    searchContainer: {
      width: "100%",
      marginBottom: 15,
      paddingHorizontal: 16,
      marginTop: 10,
    },
    inputWrapper: {
      width: "100%",
      position: "relative",
      justifyContent: "center",
    },
    searchInput: {
      width: "100%",
      backgroundColor: "#eaeaea",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      paddingRight: 40, // space for the icon
      fontSize: 16,
    },
    iconWrapper: {
      position: "absolute",
      right: 12,
      top: "50%",
      transform: [{ translateY: -12 }],
    },
    categoryContainer: {
      paddingHorizontal: 16,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginBottom: 20,
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
    loadingContainer: {
      paddingVertical: 20,
      alignItems: "center",
    },
    listLoadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      minHeight: 400,
      paddingVertical: 40,
    },
  });
