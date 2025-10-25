// utils/newsApi.js
import axios from 'axios';

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
export const getArticleById = async (id: string) => {
  const url = `${BASE_URL}/.netlify/functions/getArticleById?id=${id}`;
  const response = await axios.get(url);
  return response.data;
};
