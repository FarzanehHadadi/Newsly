import * as React from 'react';
import { BlurView } from 'expo-blur';
import type { Theme } from '@react-navigation/native';
import {
  View,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Image } from 'expo-image';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { getSliderArticles } from '@/services/netlify-news';
import type { NewsItem } from '@/services/static-data';
import { cacheImages } from '@/services/image-cache';

const { width } = Dimensions.get('window');

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
function CarouselItemComponent({
  item,
  onPress,
  styles,
}: {
  item: CarouselItem;
  onPress: () => void;
  styles: any;
}) {
  const hoverProgress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: hoverProgress.value,
      transform: [
        {
          translateY: (1 - hoverProgress.value) * 100,
        },
      ],
    };
  });

  const handlePressIn = () => {
    hoverProgress.value = withTiming(1, { duration: 300 });
  };

  const handlePressOut = () => {
    hoverProgress.value = withTiming(0, { duration: 300 });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        contentFit='cover'
        cachePolicy='memory-disk'
        transition={200}
      />
      <Animated.View style={[styles.textContainer, animatedStyle]}>
        <BlurView intensity={60} tint='dark' style={styles.blurContainer}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={styles.itemTitle}>
            {item.article.title}
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={styles.itemDescription}>
            {item.article.description}
          </Text>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
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
  const styles = getStyles(theme);
  useEffect(() => {
    const loadSliderArticles = async () => {
      setIsLoading(true);
      try {
        const articles = await getSliderArticles();
        const carouselData: CarouselItem[] = articles
          .filter((article) => article.imageUrl)
          .slice(0, 5)
          .map((article) => ({
            id: article._id,
            image: article.imageUrl,
            article,
          }));
        setData(carouselData);
        const imageUrls = carouselData
          .map((item) => item.image)
          .filter((url): url is string => Boolean(url));
        if (imageUrls.length > 0) {
          cacheImages(imageUrls).catch(console.error);
        }
      } catch (error) {
        console.error('Error loading slider articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSliderArticles();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, { height }]}>
        <ActivityIndicator size='large' color={theme.colors.primary} />
      </View>
    );
  }

  if (data.length === 0) {
    return null;
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
        mode='parallax'
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        onProgressChange={progress}
        renderItem={({ item }) => (
          <CarouselItemComponent
            item={item}
            onPress={() => router.push(`/article/${item.article._id}`)}
            styles={styles}
          />
        )}
      />
    </View>
  );
}

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      flex: 1,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    itemTitle: {
      color: theme.colors.text,
      fontWeight: '500',
      fontSize: 20,
    },
    itemDescription: {
      fontWeight: '400',
      color: theme.colors.text,
      fontSize: 14,
    },
    textContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      overflow: 'hidden',
    },
    blurContainer: {
      flex: 1,
      gap: 6,
      paddingHorizontal: 20,
      paddingVertical: '5%',
    },
  });
