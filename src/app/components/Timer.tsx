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
import AnalogClock from '../components/AnalogClock';
import DigitalClock from '../components/DigitalClock';

export interface TimerProps {
    timerMode: "timer" | "stopwatch" | "pomodoro"; // you can narrow the type if needed
}

export default function Timer({ timerMode }: TimerProps) {
    const [hasMounted, setHasMounted] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const pathname = usePathname();
    // Clock type is now managed in the context
    const isTimerPage = pathname === "/timer";
    const [isDisabled, setIsDisabled] = useState(true);

    const {
        isActive,
        isPaused,
        handleStart,
        handlePause,
        handleResume,
        handleStop,
        handleDurationChange,
        handleCategoryChange,
        elapsedTime,
        pomodoroConfig,
        setPomodoroConfig,
        getTimeLeftForMode,
        getDurationForMode,
        getCategoryForMode,
        getClockTypeForMode,
        setClockTypeForMode,
    } = useTimer();
    
    // Get the clock type for the current timer mode
    const clockType = getClockTypeForMode(timerMode);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const disabledTimer = timerMode === 'timer' && getDurationForMode('timer') === 0;
        const disabledPomodoro = timerMode === 'pomodoro' && (pomodoroConfig.focusTime === 0 || pomodoroConfig.breakTime === 0);
        const emptyCategory = getCategoryForMode(timerMode) === "";

        setIsDisabled(disabledTimer || disabledPomodoro || emptyCategory);
    }, [timerMode, pomodoroConfig, getDurationForMode, getCategoryForMode]);

    useEffect(() => {
        if (pathname === "/timer") {
            setIsMinimized(false);
        }
    }, [pathname]);

    if (!hasMounted) return null;

    const renderPomodoroConfig = () => {
        return (
            <div className="flex flex-col w-auto h-auto justify-center items-center gap-4">
                <Tooltip title="Enter focus time duration" placement="left">
                    <input
                        placeholder="Focus Time"
                        type="number"
                        className="text-white text-lg p-1 border-2 border-[var(--accent)] rounded w-full bg-transparent text-center focus:outline-none focus:border-[var(--accent)] shadow-lg"
                        value={pomodoroConfig.focusTime === 0 ? "" : pomodoroConfig.focusTime}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setPomodoroConfig({ focusTime: 0, breakTime: pomodoroConfig.breakTime, isBreak: pomodoroConfig.isBreak });
                                return;
                            }
                            setPomodoroConfig({ focusTime: Number.parseInt(e.target.value), breakTime: pomodoroConfig.breakTime, isBreak: pomodoroConfig.isBreak });
                        }}
                    />
                </Tooltip>
                <Tooltip title="Enter break time duration" placement="left">
                    <input
                        placeholder="Break Time"
                        type="number"
                        className="text-white text-lg p-1 border-2 border-[var(--accent)] rounded w-full bg-transparent text-center focus:outline-none focus:border-[var(--accent)] shadow-lg"
                        value={pomodoroConfig.breakTime === 0 ? "" : pomodoroConfig.breakTime}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setPomodoroConfig({ focusTime: pomodoroConfig.focusTime, breakTime: 0, isBreak: pomodoroConfig.isBreak });
                                return;
                            }
                            setPomodoroConfig({ focusTime: pomodoroConfig.focusTime, breakTime: Number.parseInt(e.target.value), isBreak: pomodoroConfig.isBreak });
                        }}
                    />
                </Tooltip>
            </div>
        );
    };

    return (
        <motion.div
            className={`z-45 h-auto w-full flex justify-center items-center ${isMinimized ? "hidden" : ""}`}
        >
            <div className={`bg-[var(--paper-background)] rounded-lg shadow-lg ${isMinimized ? "p-0" : "p-2"} h-auto flex flex-col items-center justify-center ${!isTimerPage && isMinimized ? "cursor-pointer" : ""}`}>

                <div className="flex flex-col items-center h-auto w-auto justify-center">
                    <div className="mb-2 w-auto flex flex-col items-center justify-center">
                        <div className="mb-4 w-full flex justify-center items-center">
                            {clockType === "digital" ? (
                                <DigitalClock
                                    time={getTimeLeftForMode(timerMode)}
                                    label={
                                        timerMode === "pomodoro"
                                            ? pomodoroConfig.isBreak
                                                ? "Break"
                                                : "Focus"
                                            : ""
                                    }
                                    isActive={isActive && !isPaused}
                                />
                            ) : (
                                <div className="flex flex-col justify-center items-center w-auto">
                                    <AnalogClock
                                        timeLeft={getTimeLeftForMode(timerMode)}
                                        duration={timerMode === "timer" ? getDurationForMode("timer") : pomodoroConfig.focusTime}
                                        isActive={isActive && !isPaused}
                                        elapsedTime={elapsedTime}
                                        isCountingDown={timerMode !== 'stopwatch'}
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
                                        {
                                            const newClockType = clockType === "digital" ? "analog" : "digital";
                                            setClockTypeForMode(timerMode, newClockType);
                                        }
                                    }
                                />
                            }
                            label="Analog | Digital"
                            className="mt-2"
                        />
                    </div>
                    {!isActive && (
                        <div className="mb-2 w-1/2 flex flex-col items-center justify-center gap-4">
                            <Tooltip title="Enter a category" placement="left" arrow>
                                <input
                                    type="text"
                                    placeholder="Category"
                                    value={getCategoryForMode(timerMode)}
                                    onChange={handleCategoryChange}
                                    className="text-white text-lg p-1 border-2 border-[var(--accent)] rounded w-full bg-transparent text-center focus:outline-none focus:border-[var(--accent)] shadow-lg"
                                />
                            </Tooltip>
                            {timerMode === "timer" && (
                                <Tooltip title="Set duration" placement="left" arrow>
                                    <input
                                        type="number"
                                        placeholder="Duration"
                                        value={
                                            getDurationForMode(timerMode) === 0 ? "" : getDurationForMode(timerMode)
                                        }
                                        onChange={(e) => {
                                            if (e.target.value === "") {
                                                handleDurationChange(0);
                                                return;
                                            }
                                            const newDuration = parseInt(
                                                e.target.value
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
                            <Tooltip title="Start Timer" placement="left">
                                <button
                                    disabled={isDisabled}
                                    onClick={handleStart}
                                    className={`p-2 rounded shadow-lg w-12 ${isDisabled ? "bg-gray-400 text-gray-600" : "bg-[var(--accent)] text-white"}`}
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
            </div>
        </motion.div>
    );
}
