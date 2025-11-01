import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';
import type { NewsItem } from './static-data';

const BOOKMARK_KEY = 'bookmarks';

export const addBookmark = async (article: NewsItem): Promise<void> => {
  try {
    const bookmarks = await getBookmarks();
    const isBookmarked = bookmarks.some((item) => item._id === article._id);

    if (!isBookmarked) {
      const updatedBookmarks = [...bookmarks, article];
      await SecureStore.setItemAsync(
        BOOKMARK_KEY,
        JSON.stringify(updatedBookmarks)
      );
    }
  } catch (error) {
    console.error('Error adding bookmark:', error);
  }
};

export const removeBookmark = async (articleId: string): Promise<void> => {
  try {
    const bookmarks = await getBookmarks();
    const updatedBookmarks = bookmarks.filter((item) => item._id !== articleId);
    await SecureStore.setItemAsync(
      BOOKMARK_KEY,
      JSON.stringify(updatedBookmarks)
    );
  } catch (error) {
    console.error('Error removing bookmark:', error);
  }
};

export const getBookmarks = async (): Promise<NewsItem[]> => {
  try {
    const bookmarksJson = await SecureStore.getItemAsync(BOOKMARK_KEY);
    return bookmarksJson ? JSON.parse(bookmarksJson) : [];
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
};

export const isBookmarked = async (articleId: string): Promise<boolean> => {
  try {
    const bookmarks = await getBookmarks();
    return bookmarks.some((item) => item._id === articleId);
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return false;
  }
};

export const toggleBookmark = async (article: NewsItem): Promise<boolean> => {
  try {
    const isBookmark = await isBookmarked(article._id);

    if (isBookmark) {
      await removeBookmark(article._id);
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch {}
      return false;
    } else {
      await addBookmark(article);
      try {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
      } catch {}
      return true;
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return false;
  }
};
