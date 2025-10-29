import * as React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import Carousel from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { getSliderArticles } from "@/services/netlify-news";
import type { NewsItem } from "@/services/static-data";
import { cacheImages } from "@/services/image-cache";

const { width } = Dimensions.get("window");

interface CarouselComponentProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  height?: number;
}

interface CarouselItem {
  id: string;
  image: string;
  article: NewsItem;
}

export default function CarouselComponent({
  autoPlay = true,
  autoPlayInterval = 3000,
  height = 220,
}: CarouselComponentProps) {
  const [data, setData] = useState<CarouselItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const progress = useSharedValue(0);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const loadSliderArticles = async () => {
      setIsLoading(true);
      try {
        const articles = await getSliderArticles();
        const carouselData: CarouselItem[] = articles
          .filter((article) => article.imageUrl) // Only include articles with images
          .slice(0, 5) // Limit to 5 items for carousel
          .map((article) => ({
            id: article._id,
            image: article.imageUrl,
            article,
          }));
        setData(carouselData);
        // Pre-cache carousel images
        const imageUrls = carouselData
          .map((item) => item.image)
          .filter((url): url is string => Boolean(url));
        if (imageUrls.length > 0) {
          cacheImages(imageUrls).catch(console.error);
        }
      } catch (error) {
        console.error("Error loading slider articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSliderArticles();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, { height }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (data.length === 0) {
    return null; // Don't render carousel if no data
  }

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={width}
        height={height}
        data={data}
        autoPlay={autoPlay && data.length > 1}
        autoPlayInterval={autoPlayInterval}
        pagingEnabled
        snapEnabled
        scrollAnimationDuration={800}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        onProgressChange={progress}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push(`/article/${item.article._id}`)}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={200}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
