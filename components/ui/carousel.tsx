import * as React from "react";
import { View, Dimensions, Image, StyleSheet } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";

const { width } = Dimensions.get("window");

// Example data: image URLs or colors
const defaultData = [
  { id: "1", image: "https://picsum.photos/800/400?1" },
  { id: "2", image: "https://picsum.photos/800/400?2" },
  { id: "3", image: "https://picsum.photos/800/400?3" },
  { id: "4", image: "https://picsum.photos/800/400?4" },
];

interface CarouselComponentProps {
  data?: { id: string; image: string }[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  height?: number;
}

export default function CarouselComponent({
  data = defaultData,
  autoPlay = true,
  autoPlayInterval = 3000,
  height = 220,
}: CarouselComponentProps) {
  const progress = useSharedValue(0);

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={width}
        height={height}
        data={data}
        autoPlay={autoPlay}
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
          <View style={styles.card}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
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
