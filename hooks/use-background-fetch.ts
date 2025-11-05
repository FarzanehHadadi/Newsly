import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { registerBackgroundTaskAsync } from '@/app/(background)/background-register';

export function useBackgroundFetch() {
  useEffect(() => {
    const init = async () => {
      // Ask permission for notifications
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permission not granted');
      }

      // Register the background task
      await registerBackgroundTaskAsync();
    };

    init();
  }, []);
}
