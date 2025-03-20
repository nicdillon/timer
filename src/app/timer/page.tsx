"use client";

import React from "react";
import TimerCarousel from "../components/TimerCarousel";

export default function TimerPage() {
  return (
    <div className="flex flex-col w-full h-full md:rounded p-4 bg-[var(--background)] ">
      <h1 className="font-bold text-3xl text-white mb-8">TIMER</h1>
      <TimerCarousel />
    </div>
  );
}
