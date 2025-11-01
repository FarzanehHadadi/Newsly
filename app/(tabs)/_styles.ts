import { StyleSheet } from 'react-native';
import type { Theme } from '@react-navigation/native';

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    stickySearchContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      paddingTop: 10,
      paddingBottom: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    stickySearchInner: {
      paddingHorizontal: 16,
    },
    searchContainer: {
      width: '100%',
      marginBottom: 15,
      paddingHorizontal: 16,
      marginTop: 10,
    },
    inputWrapper: {
      width: '100%',
      position: 'relative',
      justifyContent: 'center',
    },
    searchInput: {
      width: '100%',
      backgroundColor: '#eaeaea',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      paddingRight: 40,
      fontSize: 16,
    },
    iconWrapper: {
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: [{ translateY: -12 }],
    },
    categoryContainer: {
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 8,
      marginBottom: 20,
    },
    list: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
      width: '100%',
      marginVertical: 15,
      paddingHorizontal: 16,
    },
    listContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
    },
    bookmarkButton: {
      padding: 4,
    },
    itemImage: {
      width: 56,
      height: 56,
      borderRadius: 12,
      backgroundColor: '#e0e0e0',
    },
    textContainer: {
      flex: 1,
      gap: 6,
    },
    itemTitle: {
      color: theme.colors.text,
      fontWeight: '500',
      fontSize: 18,
    },
    itemDescription: {
      fontWeight: '400',
      color: theme.colors.text,
      fontSize: 12,
    },
    contentContainer: {
      paddingBottom: 80,
    },
    loadingContainer: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    listLoadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 400,
      paddingVertical: 40,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 400,
      paddingVertical: 60,
      paddingHorizontal: 32,
    },
    emptyStateTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginTop: 24,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyStateMessage: {
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
    },
    offlineBadge: {
      backgroundColor: '#ff4444',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      gap: 6,
    },
    offlineBadgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    stickyOfflineBadge: {
      backgroundColor: '#ff4444',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 4,
      paddingHorizontal: 8,
      gap: 4,
      borderRadius: 4,
      marginBottom: 8,
      alignSelf: 'flex-start',
    },
    stickyOfflineBadgeText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: '600',
    },
  });

