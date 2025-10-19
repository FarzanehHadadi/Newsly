
# 📰 Newsly — Full Project Task Breakdown

This document defines **all tasks** required to complete the Newsly app using **Expo + React Native**.  
Each task is designed to take around **2 hours** to complete and includes **clear step-by-step instructions**.

---

## 🏁 Phase 1 — Project Setup (Total: ~6 hours)

### Task 1 — Initialize Expo Project (2 hours)
**Steps:**
1. Install Expo CLI (`npm install -g expo-cli`).
2. Run `npx create-expo-app newsly`.
3. Choose TypeScript template.
4. Clean up boilerplate files.
5. Configure ESLint, Prettier, and Husky for code quality.
6. Test by running on simulator or device.

### Task 2 — Setup Folder Structure (2 hours)
**Steps:**
1. Create `/src` folder.
2. Add subfolders: `screens`, `components`, `services`, `store`, `hooks`, `utils`, `types`, `constants`.
3. Move `App.tsx` to root level and refactor to import from `/src/navigation/AppNavigator`.
4. Create placeholder files for each folder.

### Task 3 — Install Core Dependencies (2 hours)
**Steps:**
1. Install `@react-navigation/native`, `react-native-paper`, `expo-font`, `axios`, `zustand`, `expo-notifications`.
2. Configure NavigationContainer.
3. Verify app runs correctly with navigation stack.

---

## 📱 Phase 2 — Core UI Screens (Total: ~12 hours)

### Task 4 — Home Screen UI (2 hours)
**Steps:**
1. Create `HomeScreen.tsx`.
2. Add top bar with category tabs.
3. Fetch sample articles from mock data.
4. Display news cards in a `FlatList`.

### Task 5 — Article Detail Screen (2 hours)
**Steps:**
1. Create `ArticleScreen.tsx`.
2. Display article image, title, and content.
3. Add a “Bookmark” button.
4. Handle navigation from `HomeScreen`.

### Task 6 — Bookmarks Screen (2 hours)
**Steps:**
1. Create `BookmarkScreen.tsx`.
2. Load bookmarks from Zustand store.
3. Display in list view.
4. Add option to remove bookmarks.

### Task 7 — Profile Screen (2 hours)
**Steps:**
1. Create `ProfileScreen.tsx`.
2. Show user info and saved categories.
3. Add logout and preferences sections.

### Task 8 — Bottom Tab Navigation (2 hours)
**Steps:**
1. Create `BottomTabs.tsx`.
2. Add Home, Bookmarks, and Profile icons.
3. Integrate into `AppNavigator`.

### Task 9 — Create Reusable Components (2 hours)
**Steps:**
1. Build `NewsCard`, `BookmarkButton`, `CategoryTabs`.
2. Test all components in HomeScreen.

---

## 🌐 Phase 3 — API Integration (Total: ~10 hours)

### Task 10 — Setup News API Service (2 hours)
**Steps:**
1. Register at [newsapi.org](https://newsapi.org).
2. Create `services/newsService.ts`.
3. Add `getTopHeadlines`, `getByCategory` functions.

### Task 11 — Integrate API into HomeScreen (2 hours)
**Steps:**
1. Fetch live news using Axios.
2. Implement loading state.
3. Handle API errors gracefully.

### Task 12 — Implement Infinite Scroll & Pull Refresh (2 hours)
**Steps:**
1. Use FlatList `onEndReached` and `refreshing` props.
2. Manage page number state.

### Task 13 — Implement Local Storage for Bookmarks (2 hours)
**Steps:**
1. Use `expo-secure-store` or `AsyncStorage`.
2. Save and retrieve bookmarks persistently.

### Task 14 — Add Search Functionality (2 hours)
**Steps:**
1. Create `SearchBar` component.
2. Fetch filtered results from API.

---

## 🔔 Phase 4 — Native & Background Features (Total: ~12 hours)

### Task 15 — Push Notifications (2 hours)
**Steps:**
1. Configure `expo-notifications`.
2. Request permission from user.
3. Schedule daily breaking news alerts.

### Task 16 — Background Fetch (2 hours)
**Steps:**
1. Use `expo-background-fetch`.
2. Fetch top headlines periodically.
3. Save latest headlines to storage.

### Task 17 — Offline Mode (2 hours)
**Steps:**
1. Use local storage caching.
2. Display cached data when offline.

### Task 18 — Custom Native Module (2 hours)
**Steps:**
1. Create small native module (e.g., vibration pattern on bookmark).
2. Bridge with React Native via `NativeModules`.

### Task 19 — Theme & Dark Mode (2 hours)
**Steps:**
1. Implement theming with React Native Paper.
2. Store preference in AsyncStorage.

### Task 20 — Animation & Transitions (2 hours)
**Steps:**
1. Use `react-native-reanimated` for smooth transitions.
2. Add fade or slide animation on navigation.

---

## 🚀 Phase 5 — Optimization & Release (Total: ~8 hours)

### Task 21 — Performance Optimization (2 hours)
**Steps:**
1. Memoize heavy components.
2. Use `React.memo` and `useCallback`.
3. Profile app using Flipper.

### Task 22 — Testing (2 hours)
**Steps:**
1. Add Jest for unit tests.
2. Write tests for services and hooks.

### Task 23 — App Icons & Splash Screen (2 hours)
**Steps:**
1. Add logo in `app.json`.
2. Configure splash screens for Android/iOS.

### Task 24 — Build and Publish (2 hours)
**Steps:**
1. Run `expo build:android` and `expo build:ios`.
2. Test on both platforms.
3. Prepare store listing.

---

✅ **Total Estimated Time: ~48 hours (~6 full working days)**

Each task is independent, modular, and ideal for real-world development learning.
