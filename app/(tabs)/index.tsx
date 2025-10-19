import { getNewsByKeyword } from '@/services/get-news';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [data, setData] = useState([]);
  console.log('🚀 ~ HomeScreen ~ data:', data);
  useEffect(() => {
    getNewsByKeyword().then((data) => setData(data));
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Text>Text</Text>
      <Link
        href={{
          pathname: '/article/[news]',
          params: { news: 'test' },
        }}
      >
        View News
      </Link>
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
