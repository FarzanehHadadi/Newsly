import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { getArticleById } from "@/services/netlify-news";
import { useTheme } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { toggleBookmark, isBookmarked } from "@/services/bookmark";
import type { NewsItem } from "@/services/static-data";

export default function ArticleDetailScreen() {
  const { articleId } = useLocalSearchParams();
  const [articleData, setArticleData] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmark, setIsBookmark] = useState(false);

  const theme = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    const loadArticle = async () => {
      if (articleId) {
        setIsLoading(true);
        const data = await getArticleById(articleId as string);
        if (data?.article) {
          setArticleData(data.article);
        }
        setIsLoading(false);
      }
    };
    loadArticle();
  }, [articleId]);

  useEffect(() => {
    const checkBookmark = async () => {
      if (articleId) {
        const bookmarked = await isBookmarked(articleId as string);
        setIsBookmark(bookmarked);
      }
    };
    checkBookmark();
  }, [articleId, articleData]);

  const handleBookmarkPress = async () => {
    if (articleData) {
      const newBookmarked = await toggleBookmark(articleData);
      setIsBookmark(newBookmarked);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!articleData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Article not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{articleData.title}</Text>
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={handleBookmarkPress}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={isBookmark ? "bookmark" : "bookmark-outline"}
            size={28}
            color={isBookmark ? "#007AFF" : "#666"}
          />
        </TouchableOpacity>
      </View>
      <Image
        style={styles.image}
        source={{ uri: articleData.imageUrl }}
        resizeMode="cover"
      />
      <Text style={styles.description}>{articleData.description}</Text>
      <Text style={styles.source}>
        Article from:{" "}
        {typeof articleData.source === "string"
          ? articleData.source
          : articleData.source?.name || "Unknown"}
      </Text>
      <Text style={styles.publishedAt}>
        Last updated:{" "}
        {articleData.publishedAt
          ? new Date(articleData.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Date not available"}
      </Text>
    </SafeAreaView>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      display: "flex",
      // alignItems: 'center',
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginVertical: 10,
      gap: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 10,
      lineHeight: 28,
      flex: 1,
    },
    bookmarkButton: {
      padding: 4,
      marginTop: 10,
    },
    description: {
      fontSize: 16,
      marginBottom: 20,
      lineHeight: 22,
    },
    source: {
      fontSize: 14,
      color: theme.colors.secondaryText,
      marginBottom: 10,
    },
    publishedAt: {
      fontSize: 14,
      color: theme.colors.secondaryText,
    },
    image: {
      width: "100%",
      height: 200,
      borderRadius: 10,
      alignSelf: "center",
    },
  });
