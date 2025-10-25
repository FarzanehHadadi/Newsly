import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { useEffect, useState } from 'react';
import { getArticleById } from '@/services/netlify-news';
import { useTheme } from '@react-navigation/native';

export default function HomeScreen() {
  const { articleId } = useLocalSearchParams();
  const [articleData, setArticleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const theme = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    if (articleId) setIsLoading(true);
    getArticleById(articleId as string).then((data) =>
      setArticleData(data?.article)
    );
    setIsLoading(false);
  }, [articleId]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <>
          <Image
            style={styles.image}
            source={{ uri: articleData?.imageUrl }}
            resizeMode="cover"
          />
          <Text style={styles.title}>{articleData?.title}</Text>
          <Text style={styles.description}>{articleData?.description}</Text>
          <Text style={styles.source}>Article from: {articleData?.source}</Text>
          <Text style={styles.publishedAt}>
            Last updated:{' '}
            {articleData?.publishedAt
              ? new Date(articleData.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Date not available'}
          </Text>
        </>
      )}
    </SafeAreaView>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      display: 'flex',
      // alignItems: 'center',
    },

    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 10,
      lineHeight: 28,
    },
    description: {
      fontSize: 16,
      marginBottom: 20,
      lineHeight: 22,
    },
    source: {
      fontSize: 14,
      color: theme.colors.secondaryText,
      marginBottom: 10,
    },
    publishedAt: {
      fontSize: 14,
      color: theme.colors.secondaryText,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      alignSelf: 'center',
    },
  });
