import { useTheme, useFocusEffect } from '@react-navigation/native';
import { useEffect, useState, useRef, useCallback } from 'react';
import { FlatList, View, Animated, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type {
  NewsData,
  NewsItem as NewsItemType,
} from '@/services/static-data';
import { useRouter } from 'expo-router';
import {
  fetchNews,
  searchNews,
  getCategories,
  type Category,
} from '@/services/netlify-news';
import { toggleBookmark, isBookmarked } from '@/services/bookmark';
import { useOnlineStatusWithInterval } from '@/services/network';
import { cacheImages } from '@/services/image-cache';
import * as Haptics from 'expo-haptics';
import CarouselComponent from '@/components/ui/carousel';
import SearchBar from '@/components/home-screen/SearchBar';
import NewsItem from '@/components/home-screen/NewsItem';
import EmptyState from '@/components/home-screen/EmptyState';
import OfflineBadge from '@/components/home-screen/OfflineBadge';
import CategoryList from '@/components/home-screen/CategoryList';
import LoadingIndicator from '@/components/home-screen/LoadingIndicator';
import { getStyles } from './_styles';

export default function HomeScreen() {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isManualToggleRef = useRef(false);
  const [data, setData] = useState<NewsData>({ articles: [] });

  const scrollY = useRef(new Animated.Value(0)).current;
  const stickySearchOpacity = useRef(new Animated.Value(0)).current;
  const stickySearchTranslateY = useRef(new Animated.Value(-60)).current;
  const searchInputRef = useRef<TextInput>(null);
  const HEADER_HEIGHT = 250;
  // const { isOnline } = useNetworkStatus();
  const isOnline = useOnlineStatusWithInterval(30000);

  const theme = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();

  const refreshBookmarks = useCallback(async () => {
    if (isManualToggleRef.current) {
      isManualToggleRef.current = false;
      return;
    }

    if (data?.articles?.length === 0) return;

    const ids = new Set<string>();
    for (const item of data?.articles) {
      const bookmarked = await isBookmarked(item._id);
      if (bookmarked) ids.add(item._id);
    }
    setBookmarkedIds(ids);
  }, [data]);

  useEffect(() => {
    refreshBookmarks();
  }, [refreshBookmarks]);

  useFocusEffect(
    useCallback(() => {
      if (data?.articles?.length > 0 && !isManualToggleRef.current) {
        const refresh = async () => {
          const ids = new Set<string>();
          for (const item of data?.articles) {
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
      if (isSearchMode) return;

      try {
        const result = await fetchNews(selectedCategory, 1);
        if (result && result.articles) {
          setData({ articles: result.articles });
          setHasNextPage(result.pagination?.hasNextPage || false);
          setCurrentPage(1);
          const imageUrls = result.articles
            .map((item) => item.imageUrl)
            .filter((url): url is string => Boolean(url));
          if (imageUrls.length > 0) {
            cacheImages(imageUrls).catch(console.error);
          }
        } else {
          setData({ articles: [] });
          setHasNextPage(false);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        setData({ articles: [] });
        setHasNextPage(false);
        setCurrentPage(1);
      }
    };
    loadInitialData();
  }, [isSearchMode, selectedCategory]);

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

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
  }, [scrollY, stickySearchOpacity, stickySearchTranslateY]);

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setIsSearchMode(false);
      setSelectedCategory(null);
      const result = await fetchNews(null, 1);
      setData({ articles: result.articles });
      setHasNextPage(result.pagination.hasNextPage || false);
      setCurrentPage(1);
      const imageUrls = result.articles
        .map((item) => item.imageUrl)
        .filter((url): url is string => Boolean(url));
      if (imageUrls.length > 0) {
        cacheImages(imageUrls).catch(console.error);
      }
      return;
    }

    setIsSearching(true);
    setIsSearchMode(true);
    setSelectedCategory(null);
    const results = await searchNews(searchQuery);
    setData({ articles: results });
    setHasNextPage(false);
    setIsSearching(false);
    const imageUrls = results
      .map((item) => item.imageUrl)
      .filter((url): url is string => Boolean(url));
    if (imageUrls.length > 0) {
      cacheImages(imageUrls).catch(console.error);
    }
  };

  const handleCategoryPress = async (categoryName: string | null) => {
    setSelectedCategory(categoryName);
    setIsSearchMode(false);
    setSearchQuery('');

    setIsLoadingCategory(true);
    setData({ articles: [] });

    try {
      const result = await fetchNews(categoryName, 1);
      if (result && result.articles) {
        setData({ articles: result.articles });
        setHasNextPage(result.pagination?.hasNextPage || false);
        setCurrentPage(1);
        const imageUrls = result.articles
          .map((item) => item.imageUrl)
          .filter((url): url is string => Boolean(url));
        if (imageUrls.length > 0) {
          cacheImages(imageUrls).catch(console.error);
        }
      } else {
        setData({ articles: [] } as NewsData);
        setHasNextPage(false);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error loading category news:', error);
      setData({ articles: [] } as NewsData);
      setHasNextPage(false);
      setCurrentPage(1);
    } finally {
      setIsLoadingCategory(false);
    }
  };

  const loadMoreArticles = async () => {
    if (!hasNextPage || isLoadingMore || isSearchMode) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const result = await fetchNews(selectedCategory, nextPage);

    if (result.articles.length > 0) {
      const imageUrls = result.articles
        .map((item) => item.imageUrl)
        .filter((url): url is string => Boolean(url));
      if (imageUrls.length > 0) {
        cacheImages(imageUrls).catch(console.error);
      }
      setData((prev) => ({
        ...prev,
        articles: [...prev.articles, ...result.articles],
      }));
      setHasNextPage(result.pagination.hasNextPage || false);
      setCurrentPage(nextPage);
    } else {
      setHasNextPage(false);
    }
    setIsLoadingMore(false);
  };

  const handleBookmarkPress = async (item: NewsItemType) => {
    isManualToggleRef.current = true;
    const currentlyBookmarked = bookmarkedIds.has(item._id);

    try {
      if (currentlyBookmarked) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        await Haptics.selectionAsync();
      }
    } catch {}

    setBookmarkedIds((prev) => {
      const newSet = new Set(prev);
      if (currentlyBookmarked) {
        newSet.delete(item._id);
      } else {
        newSet.add(item._id);
      }
      return newSet;
    });

    await toggleBookmark(item);

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

    setTimeout(() => {
      isManualToggleRef.current = false;
    }, 300);
  };

  const stickySearchAnimatedStyle = {
    opacity: stickySearchOpacity,
    transform: [{ translateY: stickySearchTranslateY }],
  };

  const categoryDisplayName =
    categories.find((c) => c.name === selectedCategory)?.displayName ||
    selectedCategory;

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
          {!isOnline && <OfflineBadge variant="sticky" />}
          <SearchBar
            searchQuery={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            inputRef={searchInputRef}
          />
        </View>
      </Animated.View>

      <FlatList
        data={isSearching || isLoadingCategory ? [] : data?.articles}
        onScroll={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y;
          scrollY.setValue(offsetY);
        }}
        scrollEventThrottle={16}
        onEndReached={loadMoreArticles}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? <LoadingIndicator variant="small" /> : null
        }
        ListEmptyComponent={
          isSearching || isLoadingCategory ? (
            <LoadingIndicator variant="large" />
          ) : data?.articles?.length === 0 ? (
            <EmptyState
              isSearchMode={isSearchMode}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              categoryDisplayName={categoryDisplayName}
            />
          ) : null
        }
        ListHeaderComponent={
          <>
            {!isOnline && <OfflineBadge />}

            <View style={styles.searchContainer}>
              <SearchBar
                searchQuery={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
            </View>

            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryPress={handleCategoryPress}
            />

            <CarouselComponent />
          </>
        }
        renderItem={({ item }) => (
          <NewsItem
            item={item}
            isBookmarked={bookmarkedIds.has(item._id)}
            onPress={() => router.push(`/article/${item._id}`)}
            onBookmarkPress={() => handleBookmarkPress(item)}
          />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
