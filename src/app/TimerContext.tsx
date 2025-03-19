"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { FocusSession } from "./lib/dataTypes";
import { useAuth } from './AuthContext'


// Define types for each timer state
interface TimerState {
  duration: number;
  timeLeft: number;
  category: string;
  clockType: "digital" | "analog";
}

interface StopwatchState {
  elapsedTime: number;
  category: string;
  clockType: "digital" | "analog";
}

interface PomodoroState {
  focusTime: number;
  breakTime: number;
  isBreak: boolean;
  category: string;
  timeLeft: number;
  clockType: "digital" | "analog";
}

interface TimerContextProps {
  overlayPosition: OverlayPosition;
  setOverlayPosition: (position: OverlayPosition) => void;
  // Common state
  isActive: boolean;
  isPaused: boolean;
  timerMode: "timer" | "stopwatch" | "pomodoro";
  setTimerMode: (mode: "timer" | "stopwatch" | "pomodoro") => void;

  // Timer-specific state getters
  duration: number;
  timeLeft: number;
  timerTimeLeft: number;
  pomodoroTimeLeft: number;
  elapsedTime: number;
  category: string;
  pomodoroConfig: {
    focusTime: number;
    breakTime: number;
    isBreak: boolean;
  };

  // Timer-specific state setters
  handleDurationChange: (duration: number) => void;
  handleCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setPomodoroConfig: (config: { focusTime: number; breakTime: number; isBreak: boolean }) => void;
  setClockTypeForMode: (mode: "timer" | "stopwatch" | "pomodoro", clockType: "digital" | "analog") => void;

  // Timer controls
  handleStart: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleStop: () => void;
  formatTime: (seconds: number) => string;

  // Helper functions to get the appropriate state based on timer mode
  getTimeLeftForMode: (mode: "timer" | "stopwatch" | "pomodoro") => number;
  getDurationForMode: (mode: "timer" | "stopwatch" | "pomodoro") => number;
  getCategoryForMode: (mode: "timer" | "stopwatch" | "pomodoro") => string;
  getClockTypeForMode: (mode: "timer" | "stopwatch" | "pomodoro") => "digital" | "analog";
}

interface OverlayPosition {
  x: number;
  y: number;
}

const TimerContext = createContext<TimerContextProps | undefined>(undefined);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimerContext must be used within a TimerProvider");
  }
  return context;
}

export default function TimerProvider({ children }: { children: ReactNode }) {
  const {user, isLoading} = useAuth();
  // This state ensures we only render on the client.
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [overlayPosition, setOverlayPosition] = useState<OverlayPosition>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("overlayPosition");
        if (saved) {
          return JSON.parse(saved);
        }
      } else {
        return { x: 0, y: 0 };
      }
      return {
        x: document.documentElement.clientWidth / 2,
        y: document.documentElement.clientHeight / 2,
      };
    },
  );

  // Common state
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timerMode, setTimerMode] = useState<
    "timer" | "stopwatch" | "pomodoro"
  >("timer");

  // Separate state for each timer type
  const [timerState, setTimerState] = useState<TimerState>({
    duration: 25,
    timeLeft: 25 * 60,
    category: "Focus",
    clockType: "digital"
  });

  const [stopwatchState, setStopwatchState] = useState<StopwatchState>({
    elapsedTime: 0,
    category: "Focus",
    clockType: "digital"
  });

  const [pomodoroState, setPomodoroState] = useState<PomodoroState>({
    focusTime: 25 * 60,
    breakTime: 5 * 60,
    isBreak: false,
    category: "Focus",
    timeLeft: 25 * 60,
    clockType: "digital"
  });

  const hasFinished = useRef(false);

  // Load saved overlayPosition from localStorage on mount.
  useEffect(() => {
    const savedOverlayPosition = localStorage.getItem("overlayPosition");
    if (savedOverlayPosition) {
      setOverlayPosition(JSON.parse(savedOverlayPosition));
    }
  }, []);

  // Persist overlayPosition changes to localStorage.
  useEffect(() => {
    localStorage.setItem("overlayPosition", JSON.stringify(overlayPosition));
  }, [overlayPosition]);

  // Load saved state from localStorage on mount
  useEffect(() => {
    // Load timer state
    const savedTimerState = localStorage.getItem("timerState");
    if (savedTimerState) {
      setTimerState(JSON.parse(savedTimerState));
    }

    // Load stopwatch state
    const savedStopwatchState = localStorage.getItem("stopwatchState");
    if (savedStopwatchState) {
      setStopwatchState(JSON.parse(savedStopwatchState));
    }

    // Load pomodoro state
    const savedPomodoroState = localStorage.getItem("pomodoroState");
    if (savedPomodoroState) {
      setPomodoroState(JSON.parse(savedPomodoroState));
    }

    // Load common state
    const savedIsActive = localStorage.getItem("isActive");
    const savedIsPaused = localStorage.getItem("isPaused");
    const savedTimerMode = localStorage.getItem("timerMode");

    if (savedIsActive) setIsActive(JSON.parse(savedIsActive));
    if (savedIsPaused) setIsPaused(JSON.parse(savedIsPaused));
    if (savedTimerMode) setTimerMode(JSON.parse(savedTimerMode) as "timer" | "stopwatch" | "pomodoro");
  }, []);

  // Sync state to localStorage when values change
  useEffect(() => {
    localStorage.setItem("timerState", JSON.stringify(timerState));
    localStorage.setItem("stopwatchState", JSON.stringify(stopwatchState));
    localStorage.setItem("pomodoroState", JSON.stringify(pomodoroState));
    localStorage.setItem("isActive", JSON.stringify(isActive));
    localStorage.setItem("isPaused", JSON.stringify(isPaused));
    localStorage.setItem("timerMode", JSON.stringify(timerMode));
  }, [timerState, stopwatchState, pomodoroState, isActive, isPaused, timerMode]);

  // Update pomodoro timeLeft when config changes
  useEffect(() => {
    if (timerMode === "pomodoro" && !isActive) {
      setPomodoroState(prev => ({
        ...prev,
        timeLeft: prev.isBreak ? prev.breakTime : prev.focusTime
      }));
    }
  }, [pomodoroState.focusTime, pomodoroState.breakTime, pomodoroState.isBreak, isActive, timerMode]);

  // Timer interval logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        if (timerMode === "timer") {
          setTimerState(prev => {
            const newTimeLeft = prev.timeLeft > 1 ? prev.timeLeft - 1 : 0;
            if (newTimeLeft === 0 && prev.timeLeft === 1) {
              handleTimerFinish();
            }
            return {
              ...prev,
              timeLeft: newTimeLeft
            };
          });
        } else if (timerMode === "stopwatch") {
          setStopwatchState(prev => ({
            ...prev,
            elapsedTime: prev.elapsedTime + 1
          }));
        } else if (timerMode === "pomodoro") {
          setPomodoroState(prev => {
            const newTimeLeft = prev.timeLeft > 1 ? prev.timeLeft - 1 : 0;
            if (newTimeLeft === 0 && prev.timeLeft === 1) {
              handleTimerFinish();
            }
            return {
              ...prev,
              timeLeft: newTimeLeft
            };
          });
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isPaused, timerMode]);

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

  const handleStop = async () => {
    const userId = user ? user.id : null;

    if (userId && !isLoading) {
      let sessionDuration = 0;
      let sessionCategory = "";

      if (timerMode === "timer") {
        sessionDuration = Math.round((timerState.duration * 60 - timerState.timeLeft) / 60);
        sessionCategory = timerState.category;
      } else if (timerMode === "stopwatch") {
        sessionDuration = Math.round(stopwatchState.elapsedTime / 60);
        sessionCategory = stopwatchState.category;
      } else if (timerMode === "pomodoro") {
        const totalTime = pomodoroState.isBreak ? pomodoroState.breakTime : pomodoroState.focusTime;
        sessionDuration = Math.round((totalTime - pomodoroState.timeLeft) / 60);
        sessionCategory = pomodoroState.category;
      }

      const sessionData: FocusSession = {
        id: null,
        user_id: userId,
        category: sessionCategory,
        duration: sessionDuration,
        start_time: new Date(),
      };

      try {
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in the request
          body: JSON.stringify(sessionData),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to save session");
        }
      } catch (err) {
        console.error("Error saving focus session:", err);
      }
    }

    setIsActive(false);
    setIsPaused(false);

    // Reset the appropriate state based on timer mode
    if (timerMode === "timer") {
      setTimerState(prev => ({
        ...prev,
        timeLeft: prev.duration * 60
      }));
    } else if (timerMode === "stopwatch") {
      setStopwatchState(prev => ({
        ...prev,
        elapsedTime: 0
      }));
    } else if (timerMode === "pomodoro") {
      setPomodoroState(prev => ({
        ...prev,
        timeLeft: prev.isBreak ? prev.breakTime : prev.focusTime
      }));
    }
  };

  const handleDurationChange = (newDuration: number) => {
    if (timerMode === "timer") {
      setTimerState({
        ...timerState,
        duration: newDuration,
        timeLeft: newDuration * 60
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCategory = e.target.value;

    if (timerMode === "timer") {
      setTimerState(prev => ({
        ...prev,
        category: newCategory
      }));
    } else if (timerMode === "stopwatch") {
      setStopwatchState(prev => ({
        ...prev,
        category: newCategory
      }));
    } else if (timerMode === "pomodoro") {
      setPomodoroState(prev => ({
        ...prev,
        category: newCategory
      }));
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleTimerFinish = async () => {
    if (hasFinished.current) return;
    hasFinished.current = true;

    const audio = new Audio("/alarm.wav");
    audio.play();

    if (timerMode === "pomodoro") {
      // Toggle between focus and break
      setPomodoroState(prev => {
        const newIsBreak = !prev.isBreak;
        return {
          ...prev,
          isBreak: newIsBreak,
          timeLeft: newIsBreak ? prev.breakTime : prev.focusTime
        };
      });
    } else if (timerMode === "timer") {
      // Reset timer
      setTimerState(prev => ({
        ...prev,
        timeLeft: prev.duration * 60
      }));
      setIsActive(false);
    }

    if (isLoading) return;

    const userId = user ? user.id : null;

    if (!userId) {
      console.error("User is not authenticated. Focus session not saved.");
      return;
    }

    let sessionCategory = "";
    let sessionDuration = 0;

    if (timerMode === "timer") {
      sessionCategory = timerState.category;
      sessionDuration = timerState.duration;
    } else if (timerMode === "stopwatch") {
      sessionCategory = stopwatchState.category;
      sessionDuration = Math.round(stopwatchState.elapsedTime / 60);
    } else if (timerMode === "pomodoro") {
      sessionCategory = pomodoroState.category;
      sessionDuration = Math.round(pomodoroState.isBreak ? pomodoroState.breakTime / 60 : pomodoroState.focusTime / 60);
    }

    const sessionData: FocusSession = {
      id: null, // This will be generated by the database
      user_id: userId,
      category: sessionCategory,
      duration: sessionDuration,
      start_time: new Date(),
    };

    console.log("Saving focus session:", sessionData);

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify(sessionData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save session");
      }
    } catch (err) {
      console.error("Error saving focus session:", err);
    }
  };

  // Computed properties to expose the current state based on timer mode
  const duration = timerMode === "timer" ? timerState.duration : 0;
  const timerTimeLeft = timerState.timeLeft;
  const pomodoroTimeLeft = pomodoroState.timeLeft;
  const timeLeft = timerMode === "timer"
    ? timerState.timeLeft
    : timerMode === "pomodoro"
      ? pomodoroState.timeLeft
      : 0;
  const elapsedTime = timerMode === "stopwatch" ? stopwatchState.elapsedTime : 0;
  const category = timerMode === "timer"
    ? timerState.category
    : timerMode === "stopwatch"
      ? stopwatchState.category
      : pomodoroState.category;
  const pomodoroConfig = {
    focusTime: Math.round(pomodoroState.focusTime / 60),
    breakTime: Math.round(pomodoroState.breakTime / 60),
    isBreak: pomodoroState.isBreak
  };

  // Helper functions to get the appropriate state based on timer mode
  const getTimeLeftForMode = (mode: "timer" | "stopwatch" | "pomodoro") => {
    if (mode === "timer") {
      return timerState.timeLeft;
    } else if (mode === "pomodoro") {
      return pomodoroState.timeLeft;
    } else if (mode === "stopwatch") {
      return stopwatchState.elapsedTime;
    }
    return 0;
  };

  const getDurationForMode = (mode: "timer" | "stopwatch" | "pomodoro") => {
    if (mode === "timer") {
      return timerState.duration;
    } else if (mode === "pomodoro") {
      return pomodoroState.isBreak ? Math.round(pomodoroState.breakTime / 60) : Math.round(pomodoroState.focusTime / 60);
    }
    return 0;
  };

  const getCategoryForMode = (mode: "timer" | "stopwatch" | "pomodoro") => {
    if (mode === "timer") {
      return timerState.category;
    } else if (mode === "pomodoro") {
      return pomodoroState.category;
    } else if (mode === "stopwatch") {
      return stopwatchState.category;
    }
    return "";
  };

  const getClockTypeForMode = (mode: "timer" | "stopwatch" | "pomodoro") => {
    if (mode === "timer") {
      return timerState.clockType;
    } else if (mode === "pomodoro") {
      return pomodoroState.clockType;
    } else if (mode === "stopwatch") {
      return stopwatchState.clockType;
    }
    return "digital";
  };

  const setClockTypeForMode = (mode: "timer" | "stopwatch" | "pomodoro", clockType: "digital" | "analog") => {
    if (mode === "timer") {
      setTimerState(prev => ({
        ...prev,
        clockType
      }));
    } else if (mode === "pomodoro") {
      setPomodoroState(prev => ({
        ...prev,
        clockType
      }));
    } else if (mode === "stopwatch") {
      setStopwatchState(prev => ({
        ...prev,
        clockType
      }));
    }
  };

  // Function to update pomodoro config
  const setPomodoroConfig = (config: { focusTime: number; breakTime: number; isBreak: boolean }) => {
    setPomodoroState({
      ...pomodoroState,
      focusTime: config.focusTime * 60,
      breakTime: config.breakTime * 60,
      isBreak: config.isBreak,
      timeLeft: config.isBreak ? config.breakTime * 60 : config.focusTime * 60
    });
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
        timerTimeLeft,
        pomodoroTimeLeft,
        isActive,
        isPaused,
        category,
        timerMode,
        setTimerMode,
        pomodoroConfig,
        setPomodoroConfig,
        elapsedTime,
        handleStart,
        handlePause,
        handleResume,
        handleStop,
        handleDurationChange,
        handleCategoryChange,
        setClockTypeForMode,
        formatTime,
        getTimeLeftForMode,
        getDurationForMode,
        getCategoryForMode,
        getClockTypeForMode,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
