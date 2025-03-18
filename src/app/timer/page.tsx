"use client";

import React from "react";
import Timer from "../components/Timer";

export default function TimerPage() {
  return (
    <div className="flex flex-col w-full h-full p-4 bg-[var(--background)] rounded">
      <h1 className="font-bold text-6xl text-white">TIMER</h1>
      <Timer />
    </div>
  );
}
