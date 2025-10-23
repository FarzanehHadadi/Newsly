// utils/newsApi.js
const BASE_URL = 'https://newslyrn.netlify.app/'; // Replace with your actual Netlify URL

export const fetchNews = async (category = null) => {
  try {
    const url = category
      ? `${BASE_URL}/.netlify/functions/getNews?category=${category}`
      : `${BASE_URL}/.netlify/functions/getNews`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};
/**
 * // hooks/useNews.js
import { useState, useEffect } from 'react';
import { fetchNews } from '../utils/newsApi';

export const useNews = (category = null) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchNews(category);
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [category]);

  return { articles, loading, error, refetch: () => loadNews() };
};
 */

/**
 * // components/NewsList.js
import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useNews } from '../hooks/useNews';

const NewsList = ({ category }) => {
  const { articles, loading, error } = useNews(category);

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error: {error}</Text>;

  const renderArticle = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1 }}>
      <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text style={{ color: 'gray' }}>{item.source} • {item.category}</Text>
    </View>
  );

  return (
    <FlatList
      data={articles}
      renderItem={renderArticle}
      keyExtractor={(item) => item.url}
    />
  );
};

export default NewsList;
 */
