import { Button } from "@/components/ui/button";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [data, setData] = useState<NewsData>([]);

  useEffect(() => {
    getNewsByKeyword().then((data) => setData(data));
  }, []);
  const theme = useTheme();
  const styles = getStyles(theme);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 12,
        }}
      >
        <Button variant="default" size="lg" label="All" onPress={() => {}} />
        <Button variant="default" size="lg" label="Sport" onPress={() => {}} />
        <Button
          variant="default"
          size="lg"
          label="Weather"
          onPress={() => {}}
        />
      </ScrollView>
      <FlatList
        data={data}
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

            <View style={styles.itemDivider} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer} // ✅ center with padding
      />
    </SafeAreaView>
  );
}
const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    contentContainer: {
      paddingHorizontal: 20,
      alignItems: "center",
    },
    itemDivider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginTop: 16,
    },
    itemImage: {
      borderRadius: 12,
      marginTop: 8,
    },
    itemTitle: {
      color: theme.colors.text,

      fontWeight: "500",
      fontSize: 18,
      marginBottom: 4,
    },
    itemDescription: {
      fontWeight: "400",
      color: theme.colors.text,
      fontSize: 14,
    },
    list: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
      width: "90%",
      marginVertical: 20,
    },
    textContainer: {},
    buttonContainer: {
      flex: 1,
      flexDirection: "row",
      marginBottom: 20,
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   contentContainer: {
//     paddingHorizontal: 20,
//     alignItems: 'center',
//   },
//   list: {
//     width: '90%', // ✅ makes padding visible and keeps content centered
//     marginVertical: 20,
//   },
//   itemImage: {
//     borderRadius: 4,
//     marginTop: 8,
//   },
//   itemTitle: {
//     fontWeight: '500',
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   itemDescription: {
//     fontWeight: '400',
//     fontSize: 14,
//   },
//   itemDivider: {
//     alignSelf: 'stretch',
//     height: 1,
//     backgroundColor: '#aaa',
//     marginTop: 16,
//   },
// });
