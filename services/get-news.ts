import { NewsData, staticData } from './static-data';
const apiKey = '69df098b53d55b29b88817f24f128681';
const category = 'general';
const url =
  'https://gnews.io/api/v4/top-headlines?category=' +
  category +
  '&lang=en&country=us&max=10&apikey=' +
  apiKey;

/**
 * // Get basic category list
const response = await fetch('https://newslyrn.netlify.app/.netlify/functions/getCategories');
const data = await response.json();
// data.categories contains array of categories

// Get categories with article counts
const response = await fetch('https://newslyrn.netlify.app/.netlify/functions/getCategories?includeStats=true');
const data = await response.json();
// data.categories contains categories with articleCount
 */
