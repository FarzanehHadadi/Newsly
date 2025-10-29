import * as FileSystem from 'expo-file-system/legacy';
import * as SecureStore from 'expo-secure-store';

const CACHE_IMAGE_DIR = `${FileSystem.cacheDirectory}newsly_images/`;
const IMAGE_CACHE_KEY_PREFIX = 'cached_image_';

const ensureCacheDir = async (): Promise<void> => {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_IMAGE_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(CACHE_IMAGE_DIR, { intermediates: true });
    }
};

const getCacheKey = (url: string): string => {
    const urlHash = url.split('').reduce((acc, char) => {
        const hash = ((acc << 5) - acc) + char.charCodeAt(0);
        return hash & hash;
    }, 0);
    return `${IMAGE_CACHE_KEY_PREFIX}${Math.abs(urlHash)}`;
};

const getLocalFilePath = (url: string): string => {
    const extension = url.split('.').pop()?.split('?')[0] || 'jpg';
    const cacheKey = getCacheKey(url);
    return `${CACHE_IMAGE_DIR}${cacheKey}.${extension}`;
};

export const cacheImage = async (url: string): Promise<string | null> => {
    if (!url || !url.startsWith('http')) {
        return null;
    }

    try {
        await ensureCacheDir();
        const localUri = getLocalFilePath(url);

        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (fileInfo.exists) {
            await SecureStore.setItemAsync(getCacheKey(url), localUri);
            return localUri;
        }

        const downloadResult = await FileSystem.downloadAsync(url, localUri);

        if (downloadResult.status === 200) {
            await SecureStore.setItemAsync(getCacheKey(url), downloadResult.uri);
            return downloadResult.uri;
        }

        return null;
    } catch (error) {
        console.error(`Error caching image ${url}:`, error);
        return null;
    }
};

export const getCachedImageUri = async (url: string): Promise<string> => {
    if (!url || !url.startsWith('http')) {
        return url;
    }

    try {
        const cacheKey = getCacheKey(url);
        const cachedUri = await SecureStore.getItemAsync(cacheKey);

        if (cachedUri) {
            const fileInfo = await FileSystem.getInfoAsync(cachedUri);
            if (fileInfo.exists) {
                return cachedUri;
            } else {
                await SecureStore.deleteItemAsync(cacheKey);
            }
        }

        const localUri = getLocalFilePath(url);
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (fileInfo.exists) {
            await SecureStore.setItemAsync(cacheKey, localUri);
            return localUri;
        }

        return url;
    } catch (error) {
        console.error(`Error getting cached image ${url}:`, error);
        return url;
    }
};

export const cacheImages = async (urls: string[]): Promise<void> => {
    const validUrls = urls.filter(url => url && url.startsWith('http'));
    const batchSize = 5;
    for (let i = 0; i < validUrls.length; i += batchSize) {
        const batch = validUrls.slice(i, i + batchSize);
        await Promise.all(batch.map(url => cacheImage(url)));
    }
};

export const clearImageCache = async (): Promise<void> => {
    try {
        const dirInfo = await FileSystem.getInfoAsync(CACHE_IMAGE_DIR);
        if (dirInfo.exists) {
            await FileSystem.deleteAsync(CACHE_IMAGE_DIR, { idempotent: true });
        }
    } catch (error) {
        console.error('Error clearing image cache:', error);
    }
};

