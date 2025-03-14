'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode
} from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FocusSession } from './api/sessions/route';

interface TimerContextProps {
  overlayPosition: OverlayPosition;
  setOverlayPosition: (position: OverlayPosition) => void;
  duration: number;
  timeLeft: number;
  isActive: boolean;
  isPaused: boolean;
  category: string;
  handleStart: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleStop: () => void;
  handleTest: () => void;
  handleDurationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatTime: (seconds: number) => string;
}

interface OverlayPosition {
  x: number;
  y: number;
}

const TimerContext = createContext<TimerContextProps | undefined>(undefined);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
}

export default function TimerProvider({ children }: { children: ReactNode }) {
  // This state ensures we only render on the client.
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  const [overlayPosition, setOverlayPosition] = useState<OverlayPosition>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('overlayPosition');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    else {
      return {x: 0, y: 0};
    }
    return {
      x: document.documentElement.clientWidth / 2,
      y: document.documentElement.clientHeight,
    };
  });
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [category, setCategory] = useState('Category');
  const hasFinished = useRef(false);
  const { user, isLoading, error } = useUser();

  // Load saved overlayPosition from localStorage on mount.
  useEffect(() => {
    const savedOverlayPosition = localStorage.getItem('overlayPosition');
    if (savedOverlayPosition) {
      setOverlayPosition(JSON.parse(savedOverlayPosition));
    }
  }, []);

  // Persist overlayPosition changes to localStorage.
  useEffect(() => {
    localStorage.setItem('overlayPosition', JSON.stringify(overlayPosition));
  }, [overlayPosition]);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedDuration = localStorage.getItem('duration');
    const savedTimeLeft = localStorage.getItem('timeLeft');
    const savedIsActive = localStorage.getItem('isActive');
    const savedIsPaused = localStorage.getItem('isPaused');
    const savedCategory = localStorage.getItem('category');

    if (savedDuration) setDuration(parseInt(savedDuration));
    if (savedTimeLeft) setTimeLeft(parseInt(savedTimeLeft));
    if (savedIsActive) setIsActive(JSON.parse(savedIsActive));
    if (savedIsPaused) setIsPaused(JSON.parse(savedIsPaused));
    if (savedCategory) setCategory(savedCategory);
  }, []);

  // Sync state to localStorage when values change
  useEffect(() => {
    localStorage.setItem('duration', duration.toString());
    localStorage.setItem('timeLeft', timeLeft.toString());
    localStorage.setItem('isActive', JSON.stringify(isActive));
    localStorage.setItem('isPaused', JSON.stringify(isPaused));
    localStorage.setItem('category', category);
  }, [duration, timeLeft, isActive, isPaused, category]);

  // Timer interval logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 1) return prevTime - 1;
          else {
            if (interval) clearInterval(interval);
            if (prevTime === 1) handleTimerFinish();
            return 0;
          }
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isPaused]);

  const handleTest = () => {
    console.log('Test');
    // Set a very short duration for testing (duration in minutes)
    // Here we set duration to a fraction (e.g. 0.1 minute = 6 seconds), and force time left to 1 second for rapid testing.
    setDuration(0.1);
    setTimeLeft(1);
    setIsActive(true);
    setIsPaused(false);
    hasFinished.current = false;
  
    // After a short delay, trigger the timer finish logic
    setTimeout(() => {
      handleTimerFinish();
    }, 100); // 100ms delay
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    hasFinished.current = false;
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    hasFinished.current = false;
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(e.target.value);
    setDuration(newDuration);
    setTimeLeft(newDuration * 60);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleTimerFinish = async () => {
    if (hasFinished.current) return;
    hasFinished.current = true;

    setTimeLeft(duration * 60);

    const audio = new Audio('/alarm.wav');
    audio.play();

    setIsActive(false);

    if (isLoading) return;

    if (error) {
      console.error('Error fetching user:', error);
      return;
    }

    const userId = user ? user.sub : null;

    if (!userId) {
      console.error('User is not authenticated. Focus session not saved.');
      return;
    }

    const sessionData: FocusSession = {
      id: null, // This will be generated by the database
      user_id: userId,
      category,
      duration,
      start_time: new Date(),
    };

    console.log('Saving focus session:', sessionData);

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save session');
      }

    } catch (err) {
      console.error('Error saving focus session:', err);
    }
  };

  // Until we've mounted, render nothing (or a placeholder)
  if (!hasMounted) return null;

  return (
    <TimerContext.Provider
      value={{
        overlayPosition,
        setOverlayPosition,
        duration,
        timeLeft,
        isActive,
        isPaused,
        category,
        handleStart,
        handlePause,
        handleResume,
        handleStop,
        handleDurationChange,
        handleCategoryChange,
        formatTime,
        handleTest,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}