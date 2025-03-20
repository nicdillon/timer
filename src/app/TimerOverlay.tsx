// "use client";

// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import Tooltip from "@mui/material/Tooltip";
// import Switch from "@mui/material/Switch";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import PauseIcon from "@mui/icons-material/Pause";
// import StopIcon from "@mui/icons-material/Stop";
// import { usePathname } from "next/navigation";
// import { useTimer } from "./TimerContext";

// export default function TimerOverlay() {
//     const [hasMounted, setHasMounted] = useState(false);
//     const [isMinimized, setIsMinimized] = useState(false);
//     const pathname = usePathname();
//     const [clockType, setClockType] = useState<"digital" | "analog">("digital");
//     const [overlaySize, setOverlaySize] = useState({ width: 200, height: 200 });
//     const isTimerPage = pathname === "/timer";

//     const {
//         duration,
//         timeLeft,
//         isActive,
//         isPaused,
//         category,
//         handleStart,
//         handlePause,
//         handleResume,
//         handleStop,
//         handleDurationChange,
//         handleCategoryChange,
//         formatTime,
//         timerMode,
//         elapsedTime,
//         pomodoroConfig,
//         overlayPosition,
//         setOverlayPosition,
//     } = useTimer();

//     useEffect(() => {
//         setHasMounted(true);
//     }, []);

//     useEffect(() => {
//         if (pathname === "/timer") {
//             setIsMinimized(false);
//         }
//     }, [pathname]);

//     const computeOverlaySize = () => {
//         if (typeof window !== "undefined") {
//             if (isMinimized) {
//                 return { width: 60, height: 60 };
//             }

//             let width: number, height: number;
//             if (isTimerPage) {
//                 width =
//                     document.documentElement.clientWidth < 600
//                         ? document.documentElement.clientWidth * 0.9
//                         : 400;
//                 height =
//                     document.documentElement.clientHeight < 600
//                         ? document.documentElement.clientHeight * 0.5
//                         : 400;
//             } else {
//                 width =
//                     document.documentElement.clientWidth < 600
//                         ? document.documentElement.clientWidth * 0.7
//                         : 250;
//                 height =
//                     document.documentElement.clientHeight < 600
//                         ? document.documentElement.clientHeight * 0.3
//                         : 250;
//             }
//             return { width, height };
//         } else {
//             return { width: 0, height: 0 };
//         }
//     };

//     useEffect(() => {
//         const handleResize = () => {
//             setOverlaySize(computeOverlaySize());
//         };
//         setOverlaySize(computeOverlaySize());
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, [isTimerPage, isMinimized]);

//     if (!hasMounted) return null;

//     const computeTargetPosition = () => {
//         if (isTimerPage) {
//             return {
//                 x: document.documentElement.clientWidth / 2,
//                 y: document.documentElement.clientHeight / 2,
//             };
//         } else {
//             return {
//                 x:
//                     document.documentElement.clientWidth < 600
//                         ? (document.documentElement.clientWidth -
//                               overlaySize.width) /
//                           2
//                         : document.documentElement.clientWidth / 2 - 10,
//                 y: document.documentElement.clientHeight / 2 - 10,
//             };
//         }
//     };

//     const targetPosition = computeTargetPosition();

//     function DigitalClock({ time, label }: { time: number; label?: string }) {
//         return (
//             <span
//                 className={`text-6xl font-bold ${!isPaused && isActive ? "text-white" : "text-gray-400"}`}
//             >
//                 {formatTime(time)} {label && `(${label})`}
//             </span>
//         );
//     }

//     function AnalogClock({ time }: { time: number }) {
//         const progress = time / (duration * 60);
//         const radius = 50;
//         const circumference = 2 * Math.PI * radius;
//         const offset = circumference * (1 - progress);

//         const renderTickMarks = (radius: number) => {
//             return (
//                 <>
//                     {[...Array(12)].map((_, i) => {
//                         const angle = (i * 360) / 12;
//                         const rad = (angle * Math.PI) / 180;
//                         const x1 = 60 + radius * 1 * Math.cos(rad);
//                         const y1 = 60 + radius * 1 * Math.sin(rad);
//                         const x2 = 60 + radius * 0.8 * Math.cos(rad);
//                         const y2 = 60 + radius * 0.8 * Math.sin(rad);
//                         return (
//                             <line
//                                 key={i}
//                                 x1={x1}
//                                 y1={y1}
//                                 x2={x2}
//                                 y2={y2}
//                                 stroke="gray"
//                                 strokeWidth="2"
//                             />
//                         );
//                     })}
//                 </>
//             );
//         };

//         return (
//             <svg width="100%" height="100%" viewBox={`0 0 120 120`}>
//                 <circle
//                     cx="60"
//                     cy="60"
//                     r={radius}
//                     stroke="black"
//                     strokeWidth="8"
//                     fill="black"
//                 />
//                 <circle
//                     cx="60"
//                     cy="60"
//                     r={radius}
//                     stroke="red"
//                     strokeWidth="12"
//                     fill="none"
//                     strokeDasharray={circumference}
//                     strokeDashoffset={offset}
//                     transform="rotate(-90,60,60)"
//                 />
//                 {renderTickMarks(radius)}
//                 <text
//                     x="60"
//                     y={60 + radius / 6}
//                     textAnchor="middle"
//                     fill={isActive ? "white" : "gray"}
//                     fontSize={radius / 2}
//                 >
//                     {formatTime(time)}
//                 </text>
//             </svg>
//         );
//     }

//     const renderModeSelector = () => {
//         return (
//             <div className="mb-4 flex flex-row gap-2">
//                 <button
//                     className="rounded border-1 border-[var(--accent)] shadow-lg bg-none"
//                     onClick={() => handleTimerModeChange("standard")}
//                 >
//                     Standard
//                 </button>
//                 <button onClick={() => handleTimerModeChange("stopwatch")}>
//                     Stopwatch
//                 </button>
//                 <button onClick={() => handleTimerModeChange("pomodoro")}>
//                     Pomodoro
//                 </button>
//             </div>
//         );
//     };

//     const renderPomodoroConfig = () => {
//         return (
//             <div>
//                 <label>
//                     Focus Time:
//                     <input
//                         type="number"
//                         value={pomodoroConfig.focusTime}
//                         onChange={(e) =>
//                             handlePomodoroConfigChange(
//                                 "focusTime",
//                                 parseInt(e.target.value, 10),
//                             )
//                         }
//                     />
//                 </label>
//                 <label>
//                     Break Time:
//                     <input
//                         type="number"
//                         value={pomodoroConfig.breakTime}
//                         onChange={(e) =>
//                             handlePomodoroConfigChange(
//                                 "breakTime",
//                                 parseInt(e.target.value, 10),
//                             )
//                         }
//                     />
//                 </label>
//             </div>
//         );
//     };

//     if (!isActive && !isTimerPage) return <div></div>;

//     return (
//         <motion.div
//             layout
//             initial={{ x: overlayPosition.x, y: overlayPosition.y }}
//             animate={targetPosition}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className="fixed z-45 h-auto w-auto"
//             onAnimationComplete={() => setOverlayPosition(targetPosition)}
//         >
//             <div
//                 className={`bg-[var(--paper-background)] rounded-lg shadow-lg ${isMinimized ? "p-0" : "p-2"} h-full flex flex-col items-center justify-center ${!isTimerPage && isMinimized ? "cursor-pointer" : ""}`}
//                 onClick={() =>
//                     !isTimerPage && isMinimized && setIsMinimized(false)
//                 }
//             >
//                 {!isMinimized && !isTimerPage && (
//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             setIsMinimized(true);
//                         }}
//                         className="absolute top-2 right-2 text-[var(--accent)] hover:text-[var(--accent-dark)]"
//                     >
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="24"
//                             height="24"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M19 9l-7 7-7-7"
//                             />
//                         </svg>
//                     </button>
//                 )}
//                 {isMinimized ? (
//                     <div className="w-full h-full flex items-center justify-center">
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="32"
//                             height="32"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                         >
//                             <circle cx="12" cy="12" r="10" strokeWidth={2} />
//                             <path
//                                 strokeLinecap="round"
//                                 strokeWidth={2}
//                                 d="M12 6v6l4 2"
//                             />
//                         </svg>
//                     </div>
//                 ) : (
//                     <div className="flex flex-col items-center h-full w-full justify-center">
//                         <div className="mb-2 w-full flex flex-col items-center justify-center">
//                             {renderModeSelector()}
//                             {timerMode === "pomodoro" && renderPomodoroConfig()}
//                             <div className="mb-4">
//                                 {isActive ? (
//                                     clockType === "digital" ? (
//                                         <DigitalClock
//                                             time={
//                                                 timerMode === "stopwatch"
//                                                     ? elapsedTime
//                                                     : timeLeft
//                                             }
//                                             label={
//                                                 timerMode === "pomodoro"
//                                                     ? pomodoroConfig.isBreak
//                                                         ? "Break"
//                                                         : "Focus"
//                                                     : ""
//                                             }
//                                         />
//                                     ) : (
//                                         <div className="flex flex-col justify-center items-center w-1/2">
//                                             <AnalogClock
//                                                 time={
//                                                     timerMode === "stopwatch"
//                                                         ? elapsedTime
//                                                         : timeLeft
//                                                 }
//                                             />
//                                         </div>
//                                     )
//                                 ) : clockType === "digital" ? (
//                                     <DigitalClock time={timeLeft} />
//                                 ) : (
//                                     <div className="flex flex-col justify-center items-center w-1/2">
//                                         <AnalogClock time={timeLeft} />
//                                     </div>
//                                 )}
//                             </div>
//                             <FormControlLabel
//                                 control={
//                                     <Switch
//                                         color="default"
//                                         checked={clockType === "digital"}
//                                         onChange={() =>
//                                             setClockType((prev) =>
//                                                 prev === "digital"
//                                                     ? "analog"
//                                                     : "digital",
//                                             )
//                                         }
//                                     />
//                                 }
//                                 label="Analog | Digital"
//                                 className="mt-2"
//                             />
//                         </div>
//                         {!isActive && (
//                             <div className="mb-2 w-1/2 flex flex-col items-center justify-center gap-4">
//                                 <Tooltip title="Enter a category" arrow>
//                                     <input
//                                         type="text"
//                                         value={category}
//                                         onChange={handleCategoryChange}
//                                         placeholder="Category"
//                                         className="text-white text-lg p-1 border-2 border-[var(--accent)] rounded w-full bg-transparent text-center focus:outline-none focus:border-[var(--accent)] shadow-lg"
//                                     />
//                                 </Tooltip>
//                                 <Tooltip title="Set duration" arrow>
//                                     <input
//                                         type="number"
//                                         value={duration === 0 ? "" : duration}
//                                         onChange={handleDurationChange}
//                                         className="text-white text-lg p-1 border-2 border-[var(--accent)] rounded w-full bg-transparent text-center focus:outline-none focus:border-[var(--accent)] shadow-lg"
//                                         min="1"
//                                     />
//                                 </Tooltip>
//                             </div>
//                         )}
//                         <div className="flex gap-1">
//                             {!isActive && (
//                                 <Tooltip title="Start Timer">
//                                     <button
//                                         disabled={
//                                             duration === 0 || category === ""
//                                         }
//                                         onClick={handleStart}
//                                         className={`p-2 rounded shadow-lg ${duration === 0 || category === "" ? "bg-gray-400 text-gray-600" : "bg-[var(--accent)] text-white"}`}
//                                     >
//                                         <PlayArrowIcon />
//                                     </button>
//                                 </Tooltip>
//                             )}
//                             {isActive && !isPaused && (
//                                 <Tooltip title="Pause Timer">
//                                     <button
//                                         onClick={handlePause}
//                                         className="p-2 bg-[var(--accent)] text-white rounded shadow-lg"
//                                     >
//                                         <PauseIcon />
//                                     </button>
//                                 </Tooltip>
//                             )}
//                             {isActive && isPaused && (
//                                 <Tooltip title="Resume Timer">
//                                     <button
//                                         onClick={handleResume}
//                                         className="p-2 bg-[var(--accent)] text-white rounded shadow-lg"
//                                     >
//                                         <PlayArrowIcon />
//                                     </button>
//                                 </Tooltip>
//                             )}
//                             {isActive && (
//                                 <Tooltip title="Stop Timer">
//                                     <button
//                                         onClick={handleStop}
//                                         className="p-2 bg-none border-2 border-[var(--accent)] text-white rounded shadow-lg"
//                                     >
//                                         <StopIcon />
//                                     </button>
//                                 </Tooltip>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </motion.div>
//     );
// }
