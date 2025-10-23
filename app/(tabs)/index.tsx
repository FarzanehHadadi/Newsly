import { Button } from "@/components/ui/button";
import CarouselComponent from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { getNewsByKeyword } from "@/services/get-news";
import { NewsData } from "@/services/static-data";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function HomeScreen() {
  const [data, setData] = useState<NewsData>([]);

  useEffect(() => {
    getNewsByKeyword().then((data) => setData(data));
  }, []);

  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <FlatList
        data={data}
        ListHeaderComponent={
          <>
            {/* Search Bar with right icon */}
            <View style={styles.searchContainer}>
              <View style={styles.inputWrapper}>
                <Input
                  style={styles.searchInput}
                  placeholder="Search"
                  placeholderTextColor="#000"
                />
                <TouchableOpacity style={styles.iconWrapper}>
                  <MaterialCommunityIcons
                    name="magnify"
                    size={24}
                    color="#000"
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
              <Button
                variant="default"
                size="lg"
                label="All"
                onPress={() => {}}
              />
              <Button
                variant="default"
                size="lg"
                label="Sport"
                onPress={() => {}}
              />
              <Button
                variant="default"
                size="lg"
                label="Weather"
                onPress={() => {}}
              />
              <Button
                variant="default"
                size="lg"
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
            <Image
              src={item.image}
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
          </View>
        )}
        keyExtractor={(item) => item.id}
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
