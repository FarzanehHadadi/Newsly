import { getNewsByKeyword } from '@/services/get-news';
import { NewsData } from '@/services/static-data';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [data, setData] = useState<NewsData>([]);
  useEffect(() => {
    getNewsByKeyword().then((data) => setData(data));
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 28, paddingHorizontal: 10 }}>
            <View
              style={{
                margin: 2,
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
              }}
            >
              <Image
                src={item.image}
                width={45}
                height={45}
                style={{ borderRadius: 4 }}
              />
              <Text style={{ fontWeight: 700 }}>{item.title}</Text>
            </View>
            <Text>{item.description}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
