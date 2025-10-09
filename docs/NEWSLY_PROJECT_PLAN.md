# 📰 Newsly — Offline News Reader with Smart Sync

## 📘 Overview

**Goal:**  
Build a mobile app that fetches news articles, stores them locally, allows offline reading, syncs updates automatically in background, and notifies the user about breaking news.

**Framework:** Expo + React Native + TypeScript  
**Focus Areas:** Offline-first architecture, background sync, notifications, performance.

---

## ⚙️ Tech Stack

| Layer               | Tools                                        |
| ------------------- | -------------------------------------------- |
| **Framework**       | Expo (latest SDK)                            |
| **Language**        | TypeScript                                   |
| **State & Data**    | React Query + Zustand                        |
| **Offline Storage** | WatermelonDB / SQLite / MMKV                 |
| **Networking**      | Axios / Fetch                                |
| **Background Jobs** | Expo Task Manager + Background Fetch         |
| **Notifications**   | Expo Notifications                           |
| **UI**              | React Native Paper / Shadcn RN / Tailwind RN |
| **Animations**      | Reanimated 3                                 |
| **Dev Tools**       | Expo Router, ESLint, Prettier, Reactotron    |

---

## 🧭 Phase-by-Phase Task Plan

### **Phase 1 — Setup & Base App Structure**

**Goal:** Create a clean, scalable Expo app skeleton.

#### Tasks

1. Initialize project:
   ```bash
   npx create-expo-app newsly --template expo-template-blank-typescript
   ```
2. Setup **Expo Router** with folder-based routing.
3. Configure **absolute imports** (`tsconfig.json` with `@/`).
4. Setup **ESLint + Prettier**.
5. Add UI framework (React Native Paper or Shadcn).
6. Add Tailwind RN or StyleX for styling.
7. Create folders:
   ```
   src/
     components/
     screens/
     hooks/
     services/
     store/
     db/
     utils/
   ```
8. Setup navigation: `Home`, `Article`, `Bookmarks`, `Settings`.

✅ **Deliverable:** Clean, navigable app scaffold ready for integration.

---

### **Phase 2 — Fetch & Display News**

**Goal:** Integrate a real news API and display content.

#### Tasks

1. Choose API (NewsAPI, GNews, or custom backend).
2. Create `src/services/api.ts` using Axios or Fetch.
3. Setup **React Query**:
   ```tsx
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
   ```
4. Create hook `useNewsList()` for fetching articles.
5. Display headlines list:
   - Image
   - Title
   - Source
   - Published time
6. Add pull-to-refresh using `refetch()`.

✅ **Deliverable:** Online news feed with refresh.

---

### **Phase 3 — Offline Storage & Caching**

**Goal:** Enable full offline reading.

#### Tasks

1. Install **WatermelonDB** or **expo-sqlite + drizzle-orm**.
2. Define schema:
   ```
   articles (id, title, content, image, source, timestamp, isBookmarked)
   ```
3. Persist fetched data in DB.
4. On app launch:
   - Load from DB first
   - Sync with API if online
5. Implement pull-to-refresh to update DB.
6. Add Bookmark button for offline saves.

✅ **Deliverable:** App works offline with cached content.

---

### **Phase 4 — Background Sync**

**Goal:** Sync new articles while app is in background.

#### Tasks

1. Install dependencies:
   ```bash
   expo install expo-task-manager expo-background-fetch
   ```
2. Define background task:
   ```ts
   TaskManager.defineTask('background-sync', async () => {
     await syncNewsArticles();
     return BackgroundFetchResult.NewData;
   });
   ```
3. Register task in `App.tsx`:
   ```ts
   BackgroundFetch.registerTaskAsync('background-sync', {
     minimumInterval: 15 * 60,
   });
   ```
4. Update local DB during background sync.
5. Log background runs for debugging.

✅ **Deliverable:** App auto-syncs news periodically.

---

### **Phase 5 — Push Notifications**

**Goal:** Notify users about breaking news or category updates.

#### Tasks

1. Install **Expo Notifications**:
   ```bash
   expo install expo-notifications
   ```
2. Ask for permission on startup.
3. Schedule local notifications when:
   - Background task finds new article.
   - API reports “Breaking News.”
4. Customize notification sound and category.
5. Deep-link notification tap → article detail screen.

✅ **Deliverable:** User receives push alerts for new content.

---

### **Phase 6 — Advanced Features**

**Goal:** Add polish & performance optimization.

#### Tasks

1. Category filters + preferences stored in MMKV.
2. Dark mode toggle.
3. Reanimated transitions for article open/close.
4. Optimize image caching (`expo-image` or `react-native-fast-image`).
5. Implement Share Article (Expo Sharing API).
6. Optimize startup speed (Hermes + expo-dev-client).

✅ **Deliverable:** Production-ready, smooth, responsive UI.

---

### **Phase 7 — Optional Native Expansion**

**Goal:** Go beyond Expo when comfortable.

#### Tasks

1. Eject to prebuild (`npx expo prebuild`).
2. Add custom native modules:
   - File logger (Swift/Kotlin).
   - Native background service.
   - Native toast/snackbar.
3. Rebuild via Xcode/Android Studio.

✅ **Deliverable:** Native-augmented version of Newsly.

---

## 📦 Final Deliverables

| Feature                    | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| **Offline-first**          | Articles stored locally and accessible without internet. |
| **Background Sync**        | App fetches latest articles silently.                    |
| **Push Notifications**     | Alerts for breaking news or updates.                     |
| **Bookmarks**              | Offline saved articles.                                  |
| **Dark Mode & Categories** | User preferences with persistence.                       |
| **Optimized Performance**  | Cached images, fast load, smooth animations.             |

---

## 📂 Suggested Folder Structure

```
newsly/
│
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── article/[id].tsx
│   ├── bookmarks.tsx
│   └── settings.tsx
│
├── src/
│   ├── components/
│   ├── screens/
│   ├── hooks/
│   ├── services/
│   │   ├── api.ts
│   │   └── background.ts
│   ├── db/
│   │   └── schema.ts
│   ├── store/
│   │   └── newsStore.ts
│   └── utils/
│       └── formatDate.ts
│
├── assets/
│   ├── icons/
│   ├── fonts/
│   └── images/
│
├── package.json
├── tsconfig.json
├── app.config.js
└── NEWSLY_PROJECT_PLAN.md
```

---

## 🚀 Recommended Learning Order

| Level         | Focus                                 |
| ------------- | ------------------------------------- |
| **Phase 1–2** | Expo, routing, React Query basics     |
| **Phase 3**   | Offline database, sync logic          |
| **Phase 4–5** | Background fetch + push notifications |
| **Phase 6**   | Performance, caching, animations      |
| **Phase 7**   | Native bridging & extensions          |

---
