'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Tooltip from '@mui/material/Tooltip';
import { useTimer } from './TimerContext'; // adjust if needed
import { useTimerContext } from './TimerContext';
import { usePathname } from 'next/navigation';

export default function TimerOverlay() {
    // This state ensures we only render on the client.
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);

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
    } = useTimer();

    const { overlayPosition, setOverlayPosition } = useTimerContext();

    const [overlaySize, setOverlaySize] = useState({ width: 200, height: 200 });
    // const [currentPosition, setCurrentPosition] = useState({ x: overlayPosition.x, y: overlayPosition.y });

    const pathname = usePathname();
    const isRoot = pathname === '/';

    const computeOverlaySize = () => {
        if (typeof window !== 'undefined') {
            const width = document.documentElement.clientWidth < 600 ? document.documentElement.clientWidth * 0.9 : 300;
            const height = document.documentElement.clientWidth < 600 ? 150 : 150;
            return { width, height };
        }
        else {
            return {width: 0, height: 0};
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setOverlaySize(computeOverlaySize());
        };
        setOverlaySize(computeOverlaySize());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Until we've mounted, render nothing (or a placeholder)
    if (!hasMounted) return null;

    const computeTargetPosition = () => {
        if (isRoot) {
            return {
                x: (document.documentElement.clientWidth - overlaySize.width) / 2,
                y: (document.documentElement.clientHeight - overlaySize.height) / 2,
            };
        } else {
            return {
                x: document.documentElement.clientWidth < 600
                    ? (document.documentElement.clientWidth - overlaySize.width) / 2
                    : (document.documentElement.clientWidth - overlaySize.width - 10),
                y: 10,
            };
        }
    };

    const targetPosition = computeTargetPosition();

    return (
        <motion.div
            layout
            initial={{ x: overlayPosition.x, y: overlayPosition.y }}
            animate={targetPosition}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed z-45"
            style={{ width: overlaySize.width, height: overlaySize.height }}
            onAnimationComplete={() => setOverlayPosition(targetPosition)}
        >
            {/* Overlay content here */}
            <div className="bg-white bg-opacity-50 rounded-lg shadow-lg p-2 h-full flex flex-col items-center justify-center">
                <div className="flex flex-col items-center h-full justify-center">
                    <div className="mb-2">
                        {isActive ? (
                            <span className="text-2xl font-bold text-black">{formatTime(timeLeft)}</span>
                        ) : (
                            <Tooltip title="Enter a category" arrow>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={handleCategoryChange}
                                    placeholder="Category"
                                    className="text-black text-lg p-1 border border-purple-500 rounded w-auto bg-transparent text-center focus:outline-none focus:border-purple-700"
                                />
                            </Tooltip>
                        )}
                    </div>
                    <div className="mb-2">
                        {isActive ? null : (
                            <Tooltip title="Set duration" arrow>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={handleDurationChange}
                                    className="text-black text-lg text-center border border-purple-500 rounded focus:outline-none bg-transparent bg-opacity-30 appearance-none focus:border-purple-700"
                                    min="1"
                                />
                            </Tooltip>
                        )}
                    </div>
                    <div className="flex gap-1">
                        {!isActive && (
                            <button onClick={handleStart} className="px-2 py-1 bg-purple-500 text-white rounded text-md">
                                Start
                            </button>
                        )}
                        {isActive && !isPaused && (
                            <button onClick={handlePause} className="px-2 py-1 bg-yellow-500 text-white rounded text-md">
                                Pause
                            </button>
                        )}
                        {isActive && isPaused && (
                            <button onClick={handleResume} className="px-2 py-1 bg-green-500 text-white rounded text-md">
                                Resume
                            </button>
                        )}
                        {isActive && (
                            <button onClick={handleStop} className="px-2 py-1 bg-red-500 text-white rounded text-md">
                                Stop
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}