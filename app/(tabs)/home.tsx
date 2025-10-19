import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {

  return (
    <SafeAreaView style={styles.container}>
      <Text>Text</Text>
      {/* <Link

        href={{
          pathname: "/article/[news]",
          params: { news: "test" },
        }}
      >
        View News
      </Link> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height:"100%",
    alignItems: "center",
    justifyContent:"center"
  },
});
