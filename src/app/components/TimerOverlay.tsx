
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import { useTimer } from "../TimerContext";

export default function TimerOverlay({ isTimerPage = false }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [overlaySize, setOverlaySize] = useState({ width: 200, height: 200 });
  const {
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
    overlayPosition,
    setOverlayPosition,
  } = useTimer();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (isTimerPage) {
      setIsMinimized(false);
    }
  }, [isTimerPage]);

  const computeOverlaySize = () => {
    if (typeof window !== "undefined") {
      if (isMinimized) {
        return { width: 60, height: 60 };
      }

      let width: number, height: number;
      if (isTimerPage) {
        width = document.documentElement.clientWidth < 600 ? document.documentElement.clientWidth * 0.9 : 400;
        height = document.documentElement.clientHeight < 600 ? document.documentElement.clientHeight * 0.5 : 400;
      } else {
        width = document.documentElement.clientWidth < 600 ? document.documentElement.clientWidth * 0.7 : 250;
        height = document.documentElement.clientHeight < 600 ? document.documentElement.clientHeight * 0.3 : 250;
      }
      return { width, height };
    }
    return { width: 0, height: 0 };
  };

  useEffect(() => {
    const handleResize = () => {
      setOverlaySize(computeOverlaySize());
    };
    setOverlaySize(computeOverlaySize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isTimerPage, isMinimized]);

  if (!hasMounted || (!isActive && !isTimerPage)) return null;

  const computeTargetPosition = () => {
    if (isTimerPage) {
      return {
        x: (document.documentElement.clientWidth - overlaySize.width) / 2 - 20,
        y: (document.documentElement.clientHeight - overlaySize.height) / 2,
      };
    }
    return {
      x: document.documentElement.clientWidth < 600
        ? (document.documentElement.clientWidth - overlaySize.width) / 2
        : document.documentElement.clientWidth - overlaySize.width - 87,
      y: document.documentElement.clientHeight - overlaySize.height - 10,
    };
  };

  const targetPosition = computeTargetPosition();

  return (
    <motion.div
      layout
      initial={{ x: overlayPosition.x, y: overlayPosition.y }}
      animate={targetPosition}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky z-45 h-auto w-auto"
      onAnimationComplete={() => setOverlayPosition(targetPosition)}
    >
      <div
        className={`bg-[var(--paper-background)] rounded-lg shadow-lg ${
          isMinimized ? "p-0" : "p-2"
        } h-full flex flex-col items-center justify-center ${
          !isTimerPage && isMinimized ? "cursor-pointer" : ""
        }`}
        onClick={() => !isTimerPage && isMinimized && setIsMinimized(false)}
      >
        {!isMinimized && !isTimerPage && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="absolute top-2 right-2 text-[var(--accent)] hover:text-[var(--accent-dark)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        <div className="flex flex-col items-center gap-4">
          {!isMinimized && (
            <>
              <input
                type="number"
                value={duration}
                onChange={handleDurationChange}
                className="w-20 text-center bg-[var(--background)] text-[var(--text)] p-2 rounded"
              />
              <input
                type="text"
                value={category}
                onChange={handleCategoryChange}
                placeholder="Category"
                className="w-32 text-center bg-[var(--background)] text-[var(--text)] p-2 rounded"
              />
            </>
          )}
          <div className="text-4xl font-bold text-[var(--text)]">
            {formatTime(timeLeft)}
          </div>
          <div className="flex gap-2">
            {!isActive ? (
              <button
                onClick={handleStart}
                className="bg-[var(--accent)] text-white p-2 rounded hover:bg-[var(--accent-dark)]"
              >
                <PlayArrowIcon />
              </button>
            ) : (
              <>
                <button
                  onClick={isPaused ? handleResume : handlePause}
                  className="bg-[var(--accent)] text-white p-2 rounded hover:bg-[var(--accent-dark)]"
                >
                  {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
                </button>
                <button
                  onClick={handleStop}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  <StopIcon />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
