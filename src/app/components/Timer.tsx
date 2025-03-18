"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import { usePathname } from "next/navigation";
import { useTimer } from "../TimerContext";

export default function Timer() {
    const [hasMounted, setHasMounted] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const pathname = usePathname();
    const [clockType, setClockType] = useState<"digital" | "analog">("digital");
    const [overlaySize, setOverlaySize] = useState({ width: 200, height: 200 });
    const isTimerPage = pathname === "/timer";

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
        timerMode,
        setTimerMode,
        elapsedTime,
        pomodoroConfig,
        setPomodoroConfig,
        overlayPosition,
        setOverlayPosition,
    } = useTimer();

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (pathname === "/timer") {
            setIsMinimized(false);
        }
    }, [pathname]);

    // useEffect(() => {
    //     // const handleResize = () => {
    //     //     setOverlaySize(computeOverlaySize());
    //     // };
    //     // setOverlaySize(computeOverlaySize());
    //     // window.addEventListener("resize", handleResize);
    //     // return () => window.removeEventListener("resize", handleResize);
    // }, [isTimerPage, isMinimized]);

    if (!hasMounted) return null;

    function DigitalClock({ time, label }: { time: number; label?: string }) {
        return (
            <span
                className={`text-6xl font-bold ${!isPaused && isActive ? "text-white" : "text-gray-400"}`}
            >
                {formatTime(time)} {label && `(${label})`}
            </span>
        );
    }

    function AnalogClock({ time }: { time: number }) {
        let progress = time / (duration * 60);
        if (timerMode === "stopwatch") {
            progress = elapsedTime / 3600;
        }
        const radius = 50;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference * (1 - progress);

        const renderTickMarks = (radius: number) => {
            return (
                <>
                    {[...Array(12)].map((_, i) => {
                        const angle = (i * 360) / 12;
                        const rad = (angle * Math.PI) / 180;
                        const x1 = 60 + radius * 1 * Math.cos(rad);
                        const y1 = 60 + radius * 1 * Math.sin(rad);
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
                    {formatTime(time)}
                </text>
            </svg>
        );
    }

    const renderModeSelector = () => {
        return (
            <div className="mb-4 flex flex-row gap-2">
                <button
                    className={`p-2 rounded ${timerMode === "timer" ? "border-none text-white bg-[var(--accent)]" : "border border-[var(--accent)]"}  bg-none shadow-lg  rounded`}
                    onClick={() => setTimerMode("timer")}
                >
                    Standard
                </button>
                <button
                    className={`p-2 rounded ${timerMode === "stopwatch" ? "border-none text-white bg-[var(--accent)]" : "border border-[var(--accent)]"} shadow-lg rounded`}
                    onClick={() => setTimerMode("stopwatch")}
                >
                    Stopwatch
                </button>
                <button
                    className={`p-2 rounded ${timerMode === "pomodoro" ? "border-none text-white bg-[var(--accent)]" : "border border-[var(--accent)]"} shadow-lg rounded`}
                    onClick={() => setTimerMode("pomodoro")}
                >
                    Pomodoro
                </button>
            </div>
        );
    };

    const renderPomodoroConfig = () => {
        return (
            <div className="flex flex-col w-auto h-auto justify-center items-center gap-4">
                <input
                    placeholder="Focus Time"
                    type="number"
                    className="text-white text-lg p-1 border-2 border-[var(--accent)] rounded w-full bg-transparent text-center focus:outline-none focus:border-[var(--accent)] shadow-lg"
                    value={pomodoroConfig.focusTime}
                    onChange={(e) => {
                        if (e.target.value === "") {
                            setPomodoroConfig("focusTime", 10);
                            handleDurationChange(0);
                            return;
                        }
                        setPomodoroConfig(
                            "focusTime",
                            parseInt(e.target.value, 10),
                        );
                        handleDurationChange(parseInt(e.target.value, 10));
                    }}
                />

                <input
                    placeholder="Break Time"
                    type="number"
                    className="text-white text-lg p-1 border-2 border-[var(--accent)] rounded w-full bg-transparent text-center focus:outline-none focus:border-[var(--accent)] shadow-lg"
                    value={pomodoroConfig.breakTime}
                    onChange={(e) => {
                        if (e.target.value === "") {
                            setPomodoroConfig("breakTime", 5);
                            // handleDurationChange(0);
                            return;
                        }
                        setPomodoroConfig(
                            "breakTime",
                            parseInt(e.target.value, 5),
                        );
                        // handleDurationChange(pomodoroConfig.focusTime * 60);
                    }}
                />
            </div>
        );
    };

    return (
        <motion.div
            layout
            style={{ width: auto, height: auto }}
            className={`z-45 h-full w-full flex justify-center items-center ${isMinimized ? "hidden" : ""}`}
        >
            <div
                className={`bg-[var(--paper-background)] rounded-lg shadow-lg ${isMinimized ? "p-0" : "p-2"} h-auto flex flex-col items-center justify-center ${!isTimerPage && isMinimized ? "cursor-pointer" : ""}`}
                onClick={() =>
                    !isTimerPage && isMinimized && setIsMinimized(false)
                }
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
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                )}
                {isMinimized ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="12" cy="12" r="10" strokeWidth={2} />
                            <path
                                strokeLinecap="round"
                                strokeWidth={2}
                                d="M12 6v6l4 2"
                            />
                        </svg>
                    </div>
                ) : (
                    <div className="flex flex-col items-center h-auto w-auto justify-center">
                        <div className="mb-2 w-auto flex flex-col items-center justify-center">
                            {!isActive && renderModeSelector()}
                            <div className="mb-4 w-full flex justify-center items-center">
                                {isActive ? (
                                    clockType === "digital" ? (
                                        <DigitalClock
                                            time={
                                                timerMode === "stopwatch"
                                                    ? elapsedTime
                                                    : timeLeft
                                            }
                                            label={
                                                timerMode === "pomodoro"
                                                    ? pomodoroConfig.isBreak
                                                        ? "Break"
                                                        : "Focus"
                                                    : ""
                                            }
                                        />
                                    ) : (
                                        <div className="flex flex-col justify-center items-center w-auto">
                                            <AnalogClock
                                                time={
                                                    timerMode === "stopwatch"
                                                        ? elapsedTime
                                                        : timeLeft
                                                }
                                            />
                                        </div>
                                    )
                                ) : clockType === "digital" ? (
                                    <DigitalClock
                                        time={
                                            timerMode === "stopwatch"
                                                ? elapsedTime
                                                : timeLeft
                                        }
                                    />
                                ) : (
                                    <div className="flex flex-col justify-center items-center w-auto">
                                        <AnalogClock
                                            time={
                                                timerMode === "stopwatch"
                                                    ? elapsedTime
                                                    : timeLeft
                                            }
                                        />
                                    </div>
                                )}
                            </div>
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
                        {!isActive && (
                            <div className="mb-2 w-1/2 flex flex-col items-center justify-center gap-4">
                                <Tooltip title="Enter a category" arrow>
                                    <input
                                        type="text"
                                        placeholder="Category"
                                        value={category}
                                        onChange={handleCategoryChange}
                                        className="text-white text-lg p-1 border-2 border-[var(--accent)] rounded w-full bg-transparent text-center focus:outline-none focus:border-[var(--accent)] shadow-lg"
                                    />
                                </Tooltip>
                                {timerMode === "timer" && (
                                    <Tooltip title="Set duration" arrow>
                                        <input
                                            type="number"
                                            value={
                                                duration === 0 ? "" : duration
                                            }
                                            onChange={(e) => {
                                                if (e.target.value === "") {
                                                    handleDurationChange(0);
                                                    return;
                                                }
                                                const newDuration = parseInt(
                                                    e.target.value,
                                                    25,
                                                );
                                                handleDurationChange(
                                                    newDuration,
                                                );
                                            }}
                                            className="text-white text-lg p-1 border-2 border-[var(--accent)] rounded w-full bg-transparent text-center focus:outline-none focus:border-[var(--accent)] shadow-lg"
                                            min="1"
                                        />
                                    </Tooltip>
                                )}
                                {timerMode === "pomodoro" &&
                                    renderPomodoroConfig()}
                            </div>
                        )}
                        <div className="flex flex-row gap-1">
                            {!isActive && (
                                <Tooltip title="Start Timer">
                                    <button
                                        disabled={
                                            duration === 0 || category === ""
                                        }
                                        onClick={handleStart}
                                        className={`p-2 rounded shadow-lg w-12 ${duration === 0 || category === "" ? "bg-gray-400 text-gray-600" : "bg-[var(--accent)] text-white"}`}
                                    >
                                        <PlayArrowIcon />
                                    </button>
                                </Tooltip>
                            )}
                            {isActive && !isPaused && (
                                <Tooltip title="Pause Timer">
                                    <button
                                        onClick={handlePause}
                                        className="p-2 bg-[var(--accent)] text-white w-12 rounded shadow-lg"
                                    >
                                        <PauseIcon />
                                    </button>
                                </Tooltip>
                            )}
                            {isActive && isPaused && (
                                <Tooltip title="Resume Timer">
                                    <button
                                        onClick={handleResume}
                                        className="p-2 bg-[var(--accent)] text-white w-12 rounded shadow-lg"
                                    >
                                        <PlayArrowIcon />
                                    </button>
                                </Tooltip>
                            )}
                            {isActive && (
                                <Tooltip title="Stop Timer">
                                    <button
                                        onClick={handleStop}
                                        className="p-2 bg-none border-2 w-12 border-[var(--accent)] text-white rounded shadow-lg"
                                    >
                                        <StopIcon />
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
