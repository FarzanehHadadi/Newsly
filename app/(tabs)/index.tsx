import { Button } from '@/components/ui/button';
import { getNewsByKeyword } from '@/services/get-news';
import { NewsData } from '@/services/static-data';
import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [data, setData] = useState<NewsData>([]);

  useEffect(() => {
    getNewsByKeyword().then((data) => setData(data));
  }, []);
  const theme = useTheme();
  const styles = getStyles(theme);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal>
        <Button variant="default" label="All" onPress={() => {}} />
        <Button variant="default" label="Sport" onPress={() => {}} />
        <Button variant="default" label="Weather" onPress={() => {}} />
      </ScrollView>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.list}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Image
              src={item.image}
              width={300}
              height={300}
              style={styles.itemImage}
              resizeMode="cover"
            />
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
      alignItems: 'center',
    },
    itemDivider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginTop: 16,
    },
    itemImage: {
      borderRadius: 4,
      marginTop: 8,
    },
    itemTitle: {
      color: theme.colors.text,

      fontWeight: '500',
      fontSize: 18,
      marginBottom: 4,
    },
    itemDescription: {
      fontWeight: '400',
      color: theme.colors.text,
      fontSize: 14,
    },
    list: {
      width: '90%', // ✅ makes padding visible and keeps content centered
      marginVertical: 20,
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
