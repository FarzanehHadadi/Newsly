import { NewsData, staticData } from './static-data';
const apiKey = '69df098b53d55b29b88817f24f128681';
const category = 'general';
const url =
  'https://gnews.io/api/v4/top-headlines?category=' +
  category +
  '&lang=en&country=us&max=10&apikey=' +
  apiKey;
