import type { NewsItem, NewsSource } from './static-data';

// Constants
const BASE_URL = 'https://newslyrn.netlify.app/';
const DEFAULT_LANGUAGE = 'en';

// Type definitions
interface ApiResponse<T> {
  success: boolean;
  articles?: T[];
  article?: T;
  pagination?: Pagination;
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

// Helper function to transform raw API article to NewsItem
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

    return source || {
      id: null,
      name: 'Unknown',
      url: '',
      country: '',
    };
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

// Helper function to build query string
const buildQueryString = (params: Record<string, string | number | null>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Helper function for making API requests
const apiRequest = async <T>(endpoint: string, params?: Record<string, string | number | null>): Promise<T> => {
  const queryString = params ? buildQueryString(params) : '';
  const url = `${BASE_URL}${endpoint}${queryString}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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

/**
 * Fetches news articles with optional category and pagination
 * @param category - Optional category filter
 * @param page - Page number (default: 1)
 * @returns Promise with articles array and pagination info
 */
export const fetchNews = async (
  category: string | null = null,
  page: number = 1
): Promise<FetchNewsResponse> => {
  try {
    const params: Record<string, string | number | null> = {
      page,
      ...(category && { category }),
    };

    const data = await apiRequest<ApiResponse<RawArticle>>('/.netlify/functions/getNews', params);

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

/**
 * Fetches a single article by ID
 * @param id - Article ID
 * @returns Promise with article object or null if not found
 */
export const getArticleById = async (id: string): Promise<{ article: NewsItem } | null> => {
  try {
    if (!id) {
      throw new Error('Article ID is required');
    }

    const data = await apiRequest<ApiResponse<RawArticle>>('/.netlify/functions/getArticleById', {
      id,
    });

    if (data.article) {
      const transformedArticle = transformArticle(data.article);
      return { article: transformedArticle };
    }

    return null;
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    return null;
  }
};

/**
 * Searches for news articles by query string
 * @param query - Search query string
 * @returns Promise with array of matching articles
 */
export const searchNews = async (query: string): Promise<NewsItem[]> => {
  try {
    if (!query || query.trim() === '') {
      return [];
    }

    const params = {
      q: query.trim(),
    };

    const data = await apiRequest<ApiResponse<RawArticle>>('/.netlify/functions/searchNews', params);

    if (data.articles && Array.isArray(data.articles)) {
      return data.articles.map(transformArticle);
    }

    return [];
  } catch (error) {
    console.error('Error searching news:', error);
    return [];
  }
};
