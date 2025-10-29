import { useState, useEffect } from 'react';

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

