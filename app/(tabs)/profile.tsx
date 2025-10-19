import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PersonScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
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
