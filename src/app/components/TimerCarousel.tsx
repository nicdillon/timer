"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTimer } from "../TimerContext";
import Timer from "./Timer";

export default function TimerCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const modes = ["timer", "stopwatch", "pomodoro"];
  const { setTimerMode } = useTimer();

  const handleSlideChange = (index: number) => {
    setCurrentIndex(index);
    setTimerMode(modes[index] as "timer" | "stopwatch" | "pomodoro");
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      {/* Desktop View */}
      <div className="hidden md:flex justify-center items-center gap-4 p-4">
        {modes.map((mode, index) => (
          <motion.div
            key={mode}
            className={`w-[300px] h-[400px] rounded-lg ${
              currentIndex === index
                ? "scale-100 opacity-100"
                : "scale-90 opacity-60"
            } flex flex-col justify-center items-center gap-4`}
            initial={false}
            animate={{
              scale: currentIndex === index ? 1 : 0.9,
              opacity: currentIndex === index ? 1 : 0.6,
            }}
            transition={{ duration: 0.3 }}
            onClick={() => handleSlideChange(index)}
          >
            <h2 className="text-xl capitalize">{mode}</h2>
            <Timer mode={mode} />
          </motion.div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden flex-col gap-4 p-4 overflow-y-auto max-h-screen">
        {modes.map((mode, index) => (
          <motion.div
            key={mode}
            className="w-full h-[400px] rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => handleSlideChange(index)}
          >
            <Timer mode={mode} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
