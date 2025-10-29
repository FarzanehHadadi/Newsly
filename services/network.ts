import { useState, useEffect } from 'react';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

export const checkNetworkStatus = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    return false;
  }
};
/**
 * @deprecated Use `useOnlineStatusWithInterval` instead
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkStatus = async () => {
    setIsChecking(true);
    const status = await checkNetworkStatus();
    setIsOnline(status);
    setIsChecking(false);
  };

  useEffect(() => {
    checkStatus();

    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return { isOnline, isChecking, checkStatus };
};

export function useOnlineStatusWithInterval(intervalMs: number = 30000) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const checkConnection = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
      console.log('🚀 ~ checkConnection ~ state:', state);
    };

    // Initial check
    checkConnection();

    // Start interval
    interval = setInterval(checkConnection, intervalMs);

    // Cleanup
    return () => clearInterval(interval);
  }, [intervalMs]);

  return isConnected;
}
