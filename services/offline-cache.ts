import * as SecureStore from 'expo-secure-store';
import type { NewsItem } from './static-data';

const CACHE_KEYS = {
    NEWS_LIST: 'cached_news_list',
    SLIDER_ARTICLES: 'cached_slider_articles',
    SEARCH_RESULTS: 'cached_search_results',
    ARTICLE_DETAIL: 'cached_article_detail_',
    NEWS_PAGE: 'cached_news_page_',
} as const;

interface CacheMetadata {
    timestamp: number;
    data: any;
}

const CACHE_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000;

const isCacheValid = (metadata: CacheMetadata): boolean => {
    const now = Date.now();
    return now - metadata.timestamp < CACHE_EXPIRY_TIME;
};

export const getCachedData = async <T>(key: string): Promise<T | null> => {
    try {
        const cachedJson = await SecureStore.getItemAsync(key);
        if (!cachedJson) return null;

        const metadata: CacheMetadata = JSON.parse(cachedJson);

        if (!isCacheValid(metadata)) {
            await SecureStore.deleteItemAsync(key);
            return null;
        }

        return metadata.data as T;
    } catch (error) {
        console.error(`Error getting cached data for ${key}:`, error);
        return null;
    }
};

export const saveToCache = async <T>(key: string, data: T): Promise<void> => {
    try {
        const metadata: CacheMetadata = {
            timestamp: Date.now(),
            data,
        };
        await SecureStore.setItemAsync(key, JSON.stringify(metadata));
    } catch (error) {
        console.error(`Error saving to cache for ${key}:`, error);
    }
};

export const cacheNewsList = async (articles: NewsItem[], page: number = 1): Promise<void> => {
    const key = page === 1 ? CACHE_KEYS.NEWS_LIST : `${CACHE_KEYS.NEWS_PAGE}${page}`;
    await saveToCache(key, articles);
};

export const getCachedNewsList = async (page: number = 1): Promise<NewsItem[] | null> => {
    const key = page === 1 ? CACHE_KEYS.NEWS_LIST : `${CACHE_KEYS.NEWS_PAGE}${page}`;
    return getCachedData<NewsItem[]>(key);
};

export const cacheSliderArticles = async (articles: NewsItem[]): Promise<void> => {
    await saveToCache(CACHE_KEYS.SLIDER_ARTICLES, articles);
};

export const getCachedSliderArticles = async (): Promise<NewsItem[] | null> => {
    return getCachedData<NewsItem[]>(CACHE_KEYS.SLIDER_ARTICLES);
};

export const cacheArticleDetail = async (articleId: string, article: NewsItem): Promise<void> => {
    await saveToCache(`${CACHE_KEYS.ARTICLE_DETAIL}${articleId}`, article);
};

export const getCachedArticleDetail = async (articleId: string): Promise<NewsItem | null> => {
    return getCachedData<NewsItem>(`${CACHE_KEYS.ARTICLE_DETAIL}${articleId}`);
};

export const cacheSearchResults = async (query: string, articles: NewsItem[]): Promise<void> => {
    await saveToCache(`${CACHE_KEYS.SEARCH_RESULTS}_${query.toLowerCase()}`, articles);
};

export const getCachedSearchResults = async (query: string): Promise<NewsItem[] | null> => {
    return getCachedData<NewsItem[]>(`${CACHE_KEYS.SEARCH_RESULTS}_${query.toLowerCase()}`);
};

export const clearCache = async (): Promise<void> => {
    try {
        const keys = Object.values(CACHE_KEYS);
        await Promise.all(keys.map(key => SecureStore.deleteItemAsync(key)));

        for (let i = 2; i <= 10; i++) {
            try {
                await SecureStore.deleteItemAsync(`${CACHE_KEYS.NEWS_PAGE}${i}`);
            } catch {
            }
        }
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
};

