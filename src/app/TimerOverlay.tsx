"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useTimer } from "./TimerContext";
import { useTimerContext } from "./TimerContext";
import { usePathname } from "next/navigation";

export default function TimerOverlay() {
    // This state ensures we only render on the client.
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);

    // Get timer data and functions from context.
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
    // Size state will be updated responsively.
    const [overlaySize, setOverlaySize] = useState({ width: 200, height: 200 });
    const pathname = usePathname();
    const isTimerPage = pathname === "/timer";

    // Compute responsive overlay size based on viewport and current page.
    const computeOverlaySize = () => {
        if (typeof window !== "undefined") {
            let width: number, height: number;
            if (isTimerPage) {
                // On the root page, use more aggressive sizing.
                width =
                    document.documentElement.clientWidth < 600
                        ? document.documentElement.clientWidth * 0.9
                        : 400;
                height =
                    document.documentElement.clientHeight < 600
                        ? document.documentElement.clientHeight * 0.5
                        : 400;
            } else {
                // On other pages, keep the overlay a bit smaller.
                width =
                    document.documentElement.clientWidth < 600
                        ? document.documentElement.clientWidth * 0.7
                        : 250;
                height =
                    document.documentElement.clientHeight < 600
                        ? document.documentElement.clientHeight * 0.3
                        : 250;
            }
            return { width, height };
        } else {
            return { width: 0, height: 0 };
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setOverlaySize(computeOverlaySize());
        };
        setOverlaySize(computeOverlaySize());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isTimerPage]);

    // New state to toggle between digital and analogue clock display.
    const [clockType, setClockType] = useState<"digital" | "analog">("digital");

    // Until we've mounted, render nothing.
    if (!hasMounted) return null;

    // Compute the overlay target position (responsive positioning).
    const computeTargetPosition = () => {
        if (isTimerPage) {
            return {
                x:
                    (document.documentElement.clientWidth - overlaySize.width) /
                        2 -
                    20,
                y:
                    (document.documentElement.clientHeight -
                        overlaySize.height) /
                    2,
            };
        } else {
            return {
                x:
                    document.documentElement.clientWidth < 600
                        ? (document.documentElement.clientWidth -
                              overlaySize.width) /
                          2
                        : document.documentElement.clientWidth -
                          overlaySize.width -
                          87,
                y:
                    document.documentElement.clientHeight -
                    overlaySize.height -
                    10,
            };
        }
    };

    const targetPosition = computeTargetPosition();

    // Digital clock component with a stylized digital font.
    function DigitalClock({ timeLeft }: { timeLeft: number }) {
        return (
            <span
                className={`text-6xl font-bold ${!isPaused && isActive ? "text-white" : "text-gray-400"}`}
                style={{ fontFamily: "Orbitron, sans-serif" }}
            >
                {formatTime(timeLeft)}
            </span>
        );
    }

    // Analog clock component using an SVG circular progress style.
    // Here we calculate progress relative to one hour (3600 seconds).
    // E.g. for a 15 minute (900 sec) timer, progress = 900/3600 = 0.25.
    function AnalogClock({ timeLeft }: { timeLeft: number }) {
        // const oneHour = 3600;
        const progress = timeLeft / (duration * 60);
        const radius = 50;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference * (1 - progress);

        // Helper function to render tick marks (12 markers).
        const renderTickMarks = (radius: number) => {
            return (
                <>
                    {[...Array(12)].map((_, i) => {
                        const angle = (i * 360) / 12;
                        const rad = (angle * Math.PI) / 180;
                        // Outer tick point (just outside the circle).
                        const x1 = 60 + radius * 1 * Math.cos(rad);
                        const y1 = 60 + radius * 1 * Math.sin(rad);
                        // Inner tick point (on the circle).
                        const x2 = 60 + radius * 0.8 * Math.cos(rad);
                        const y2 = 60 + radius * 0.8 * Math.sin(rad);
                        return (
                            <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="gray"
                                strokeWidth="2"
                            />
                        );
                    })}
                </>
            );
        };

        return (
            <svg width="100%" height="100%" viewBox={`0 0 120 120`}>
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="black"
                    strokeWidth="8"
                    fill="black"
                />
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="red"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90,60,60)"
                />
                {renderTickMarks(radius)}

                <text
                    x="60"
                    y={60 + radius / 6}
                    textAnchor="middle"
                    fill={isActive ? "white" : "gray"}
                    fontSize={radius / 2}
                >
                    {formatTime(timeLeft)}
                </text>
            </svg>
        );
    }

    if (!isActive && !isTimerPage) return <div></div>;

    return (
        <motion.div
            layout
            initial={{ x: overlayPosition.x, y: overlayPosition.y }}
            animate={targetPosition}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed z-45"
            style={{ width: overlaySize.width, height: overlaySize.height }}
            onAnimationComplete={() => setOverlayPosition(targetPosition)}
        >
            <div className="bg-[var(--paper-background)] rounded-lg shadow-lg p-2 h-full flex flex-col items-center justify-center">
                <div className="flex flex-col items-center h-full w-full justify-center">
                    {/* Clock Display (digital or analogue) */}
                    <div className="mb-2 w-full flex flex-col items-center justify-center">
                        {isActive ? (
                            clockType === "digital" ? (
                                <DigitalClock timeLeft={timeLeft} />
                            ) : (
                                <div className="flex flex-col justify-center items-center w-1/2">
                                    <AnalogClock timeLeft={timeLeft} />
                                </div>
                            )
                        ) : // When timer is not active, show the digital clock as a preview.
                        clockType === "digital" ? (
                            <DigitalClock timeLeft={timeLeft} />
                        ) : (
                            <div className="flex flex-col justify-center items-center w-1/2">
                                <AnalogClock timeLeft={timeLeft} />
                            </div>
                        )}
                        {/* Toggle Switch available always (both when active or setting timer) */}
                        <FormControlLabel
                            control={
                                <Switch
                                    color="default"
                                    checked={clockType === "digital"}
                                    onChange={() =>
                                        setClockType((prev) =>
                                            prev === "digital"
                                                ? "analog"
                                                : "digital",
                                        )
                                    }
                                />
                            }
                            label="Analog | Digital"
                            className="mt-2"
                        />
                    </div>
                    {/* Duration input for non-active timer */}
                    {!isActive && (
                        <div className="mb-2 w-1/2 flex flex-col items-center justify-center gap-4">
                            <Tooltip title="Enter a category" arrow>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={handleCategoryChange}
                                    placeholder="Category"
                                    className="text-white text-lg p-1 border-2 border-[var(--accent)] rounded w-full bg-transparent text-center focus:outline-none focus:border-[var(--accent)] shadow-lg"
                                />
                            </Tooltip>
                            <Tooltip title="Set duration" arrow>
                                <input
                                    type="number"
                                    value={duration === 0 ? "" : duration}
                                    onChange={handleDurationChange}
                                    className="text-white text-lg p-1 border-2 border-[var(--accent)] rounded w-full bg-transparent text-center focus:outline-none focus:border-[var(--accent)] shadow-lg"
                                    min="1"
                                />
                            </Tooltip>
                        </div>
                    )}
                    <div className="flex gap-1">
                        {!isActive && (
                            <button
                                disabled={duration === 0 || category === ""}
                                onClick={handleStart}
                                className={`px-2 py-1 rounded text-md shadow-lg ${
                                    duration === 0 || category === ""
                                        ? "bg-gray-400 text-gray-600"
                                        : "bg-[var(--accent)] text-white"
                                }`}
                            >
                                Start
                            </button>
                        )}
                        {isActive && !isPaused && (
                            <button
                                onClick={handlePause}
                                className="px-2 py-1 bg-[var(--accent)] text-white rounded text-md shadow-lg"
                            >
                                Pause
                            </button>
                        )}
                        {isActive && isPaused && (
                            <button
                                onClick={handleResume}
                                className="px-2 py-1 bg-[var(--accent)] text-white rounded text-md shadow-lg"
                            >
                                Resume
                            </button>
                        )}
                        {isActive && (
                            <button
                                onClick={handleStop}
                                className="px-2 py-1 bg-none border-2 border-[var(--accent)] text-white rounded text-md shadow-lg"
                            >
                                Stop
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
