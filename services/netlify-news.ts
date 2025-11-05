import type { NewsItem, NewsSource } from './static-data';
import { checkNetworkStatus } from './network';
import * as SecureStore from 'expo-secure-store';
import {
  cacheNewsList,
  getCachedNewsList,
  cacheSliderArticles,
  getCachedSliderArticles,
  cacheArticleDetail,
  getCachedArticleDetail,
  cacheSearchResults,
  getCachedSearchResults,
} from './offline-cache';

const BASE_URL = 'https://newslyrn.netlify.app/';
const DEFAULT_LANGUAGE = 'en';
interface ApiResponse<T> {
  success: boolean;
  articles?: T[];
  article?: T;
  pagination?: Pagination;
}

export interface Category {
  _id: string;
  name: string;
  displayName: string;
  description: string;
}

interface GetCategoriesResponse {
  success: boolean;
  categories: Category[];
  totalCategories: number;
  message: string;
}

interface Pagination {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSize: number;
  totalArticles: number;
  totalPages: number;
}

interface RawArticle {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  url?: string;
  lang?: string;
  publishedAt?: string;
  createdAt?: string;
  source: string | NewsSource;
  category?: string;
  __v?: number;
}

interface FetchNewsResponse {
  articles: NewsItem[];
  pagination: Pagination;
}

const transformArticle = (article: RawArticle): NewsItem => {
  const transformSource = (source: string | NewsSource): NewsSource => {
    if (typeof source === 'string') {
      return {
        id: null,
        name: source,
        url: '',
        country: '',
      };
    }

    return (
      source || {
        id: null,
        name: 'Unknown',
        url: '',
        country: '',
      }
    );
  };

  return {
    _id: article._id,
    title: article.title || '',
    description: article.description || '',
    content: article.content || article.description || '',
    imageUrl: article.imageUrl || '',
    url: article.url || '',
    lang: article.lang || DEFAULT_LANGUAGE,
    publishedAt: article.publishedAt || article.createdAt || '',
    source: transformSource(article.source),
  };
};

const buildQueryString = (
  params: Record<string, string | number | null>
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const apiRequest = async <T>(
  endpoint: string,
  params?: Record<string, string | number | null>
): Promise<T> => {
  const queryString = params ? buildQueryString(params) : '';
  const url = `${BASE_URL}${endpoint}${queryString}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error(
        `Non-JSON response from ${endpoint}:`,
        text.substring(0, 200)
      );
      throw new Error(
        `API returned non-JSON response (${contentType}). This might be an error page.`
      );
    }

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new Error('API request was not successful');
    }

    return data as T;
  } catch (error) {
    console.error(`Error in API request to ${endpoint}:`, error);
    throw error;
  }
};

export const fetchNews = async (
  category: string | null = null,
  page: number = 1
): Promise<FetchNewsResponse> => {
  const isOnline = await checkNetworkStatus();

  if (!isOnline) {
    console.log('Offline mode: Loading cached news');
    const cachedArticles = await getCachedNewsList(page);
    if (cachedArticles) {
      return {
        articles: cachedArticles,
        pagination: {
          currentPage: page,
          hasNextPage: false,
          hasPreviousPage: page > 1,
          pageSize: 10,
          totalArticles: cachedArticles.length,
          totalPages: 1,
        },
      };
    }
    return {
      articles: [],
      pagination: {
        currentPage: page,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize: 10,
        totalArticles: 0,
        totalPages: 0,
      },
    };
  }

  try {
    const params: Record<string, string | number | null> = {
      page,
      pageSize: 10,
      ...(category && { category }),
    };

    const data = await apiRequest<ApiResponse<RawArticle>>(
      '/.netlify/functions/getNews',
      params
    );

    if (data.articles && Array.isArray(data.articles)) {
      const articles = data.articles.map(transformArticle);
      const pagination: Pagination = data.pagination || {
        currentPage: page,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize: 10,
        totalArticles: 0,
        totalPages: 0,
      };

      await cacheNewsList(articles, page);

      return { articles, pagination };
    }

    return {
      articles: [],
      pagination: {
        currentPage: page,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize: 10,
        totalArticles: 0,
        totalPages: 0,
      },
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    const cachedArticles = await getCachedNewsList(page);
    if (cachedArticles) {
      return {
        articles: cachedArticles,
        pagination: {
          currentPage: page,
          hasNextPage: false,
          hasPreviousPage: page > 1,
          pageSize: 10,
          totalArticles: cachedArticles.length,
          totalPages: 1,
        },
      };
    }

    return {
      articles: [],
      pagination: {
        currentPage: page,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize: 10,
        totalArticles: 0,
        totalPages: 0,
      },
    };
  }
};

export const getArticleById = async (
  id: string
): Promise<{ article: NewsItem } | null> => {
  if (!id) {
    return null;
  }

  const isOnline = await checkNetworkStatus();

  if (!isOnline) {
    console.log('Offline mode: Loading cached article');
    const cachedArticle = await getCachedArticleDetail(id);
    if (cachedArticle) {
      return { article: cachedArticle };
    }
    return null;
  }

  try {
    const data = await apiRequest<ApiResponse<RawArticle>>(
      '/.netlify/functions/getArticleById',
      {
        id,
      }
    );

    if (data.article) {
      const transformedArticle = transformArticle(data.article);
      await cacheArticleDetail(id, transformedArticle);
      return { article: transformedArticle };
    }

    return null;
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    const cachedArticle = await getCachedArticleDetail(id);
    if (cachedArticle) {
      return { article: cachedArticle };
    }
    return null;
  }
};

export const searchNews = async (query: string): Promise<NewsItem[]> => {
  if (!query || query.trim() === '') {
    return [];
  }

  const isOnline = await checkNetworkStatus();

  if (!isOnline) {
    console.log('Offline mode: Loading cached search results');
    const cachedResults = await getCachedSearchResults(query);
    if (cachedResults) {
      return cachedResults;
    }
    return [];
  }

  try {
    const params = {
      q: query.trim(),
    };

    const data = await apiRequest<ApiResponse<RawArticle>>(
      '/.netlify/functions/searchNews',
      params
    );

    if (data.articles && Array.isArray(data.articles)) {
      const articles = data.articles.map(transformArticle);
      await cacheSearchResults(query, articles);
      return articles;
    }

    return [];
  } catch (error) {
    console.error('Error searching news:', error);
    const cachedResults = await getCachedSearchResults(query);
    if (cachedResults) {
      return cachedResults;
    }
    return [];
  }
};

export const getCategories = async (): Promise<Category[]> => {
  const isOnline = await checkNetworkStatus();
  const endpoint = '.netlify/functions/getCategories';

  try {
    if (!isOnline) {
      const cachedCategories = await SecureStore.getItemAsync(
        'cached_categories'
      );
      if (cachedCategories) {
        try {
          const parsed = JSON.parse(cachedCategories);
          return parsed.categories || [];
        } catch {
          return [];
        }
      }
      return [];
    }

    const response = await apiRequest<GetCategoriesResponse>(endpoint);

    if (response.success && response.categories) {
      await SecureStore.setItemAsync(
        'cached_categories',
        JSON.stringify({
          categories: response.categories,
          timestamp: Date.now(),
        })
      );
      return response.categories;
    }

    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    try {
      const cachedCategories = await SecureStore.getItemAsync(
        'cached_categories'
      );
      if (cachedCategories) {
        const parsed = JSON.parse(cachedCategories);
        return parsed.categories || [];
      }
    } catch {}
    return [];
  }
};

export const getSliderArticles = async (): Promise<NewsItem[]> => {
  const isOnline = await checkNetworkStatus();

  if (!isOnline) {
    console.log('Offline mode: Loading cached slider articles');
    const cachedArticles = await getCachedSliderArticles();
    if (cachedArticles) {
      return cachedArticles;
    }
    return [];
  }

  try {
    const data = await apiRequest<ApiResponse<RawArticle>>(
      '/.netlify/functions/getSliderArticles'
    );

    if (data.articles && Array.isArray(data.articles)) {
      const articles = data.articles.map(transformArticle);
      await cacheSliderArticles(articles);
      return articles;
    }

    return [];
  } catch (error) {
    console.error('Error fetching slider articles:', error);
    const cachedArticles = await getCachedSliderArticles();
    if (cachedArticles) {
      return cachedArticles;
    }
    return [];
  }
};
