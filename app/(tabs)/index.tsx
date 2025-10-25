import { Button } from '@/components/ui/button';
import CarouselComponent from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { NewsData } from '@/services/static-data';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { fetchNews } from '@/services/netlify-news';

export default function HomeScreen() {
  const [data, setData] = useState<NewsData>([]);
  console.log('🚀 ~ HomeScreen ~ data:', data?.[0]?.imageUrl);

  useEffect(() => {
    fetchNews().then((data) => setData(data));
  }, []);

  const theme = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
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
              <Button variant="link" size="sm" label="All" onPress={() => {}} />
              <Button
                variant="link"
                size="sm"
                label="Sport"
                onPress={() => {}}
              />
              <Button
                variant="link"
                size="sm"
                label="Weather"
                onPress={() => {}}
              />
              <Button
                variant="link"
                size="sm"
                label="Tech"
                onPress={() => {}}
              />
            </ScrollView>

            {/* Carousel */}
            <CarouselComponent />
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.list}
            onPress={() => router.push(`/article/${item._id}`)}
            activeOpacity={0.7}
          >
            <Image
              src={item.imageUrl}
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
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
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
      width: '100%',
      marginBottom: 15,
      paddingHorizontal: 16,
      marginTop: 10,
    },
    inputWrapper: {
      width: '100%',
      position: 'relative',
      justifyContent: 'center',
    },
    searchInput: {
      width: '100%',
      backgroundColor: '#eaeaea',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      paddingRight: 40, // space for the icon
    },
    iconWrapper: {
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: [{ translateY: -12 }],
    },
    categoryContainer: {
      paddingHorizontal: 16,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 20,
    },
    list: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
      width: '100%',
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
      fontWeight: '500',
      fontSize: 18,
    },
    itemDescription: {
      fontWeight: '400',
      color: theme.colors.text,
      fontSize: 12,
    },
    contentContainer: {
      paddingBottom: 80,
    },
  });
