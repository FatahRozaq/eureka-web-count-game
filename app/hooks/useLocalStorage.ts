import { useState, useEffect } from 'react';

export function useGameProgress(gameKey: string) {
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load dari localStorage saat mount (client-side only)
  useEffect(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(gameKey) : null;
      if (item) {
        const data = JSON.parse(item);
        setCompletedLevels(data.completedLevels || []);
        setTotalStars(data.totalStars || 0);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${gameKey}":`, error);
    }
    setIsLoaded(true);
  }, [gameKey]);

  // Save ke localStorage setiap kali ada perubahan
  useEffect(() => {
    if (isLoaded) {
      try {
        const data = {
          completedLevels,
          totalStars
        };
        window.localStorage.setItem(gameKey, JSON.stringify(data));
      } catch (error) {
        console.error(`Error setting localStorage key "${gameKey}":`, error);
      }
    }
  }, [gameKey, completedLevels, totalStars, isLoaded]);

  return {
    completedLevels,
    setCompletedLevels,
    totalStars,
    setTotalStars,
    isLoaded
  };
}

