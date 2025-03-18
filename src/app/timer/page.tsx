
"use client";

import React from "react";
import TimerOverlay from "../components/TimerOverlay";

export default function TimerPage() {
  return (
    <div className="flex flex-col w-full h-full p-4 bg-[var(--background)] rounded">
      <h1 className="font-bold text-6xl text-white mb-8">TIMER</h1>
      <TimerOverlay isTimerPage={true} />
    </div>
  );
}
