'use client';

import React, { useState, useEffect } from 'react';

export default function RootPage() {
  const [duration, setDuration] = useState(25); // Default duration in minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Time left in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [category, setCategory] = useState('Category');

  // Use useEffect to set the initial state from localStorage on the client side
  useEffect(() => {
    const savedDuration = localStorage.getItem('duration');
    const savedTimeLeft = localStorage.getItem('timeLeft');
    const savedIsActive = localStorage.getItem('isActive');
    const savedIsPaused = localStorage.getItem('isPaused');
    const savedCategory = localStorage.getItem('category');

    if (savedDuration) setDuration(parseInt(savedDuration));
    if (savedTimeLeft) setTimeLeft(parseInt(savedTimeLeft));
    if (savedIsActive) setIsActive(JSON.parse(savedIsActive));
    if (savedIsPaused) setIsPaused(JSON.parse(savedIsPaused));
    if (savedCategory) setCategory(savedCategory);
  }, []);

  useEffect(() => {
    localStorage.setItem('duration', duration.toString());
    localStorage.setItem('timeLeft', timeLeft.toString());
    localStorage.setItem('isActive', JSON.stringify(isActive));
    localStorage.setItem('isPaused', JSON.stringify(isPaused));
    localStorage.setItem('category', category);
  }, [duration, timeLeft, isActive, isPaused, category]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => {
          if (timeLeft > 0) {
            return timeLeft - 1;
          } else {
            handleTimerFinish();
            return 0;
          }
        });
      }, 1000);
    } else if (!isActive && timeLeft !== 0) {
      clearInterval(interval!);
    }

    return () => clearInterval(interval!);
  }, [isActive, isPaused, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(e.target.value);
    setDuration(newDuration);
    setTimeLeft(newDuration * 60);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleTimerFinish = () => {
    alert('Time is up!');
    const audio = new Audio('/alarm.mp3');
    audio.play();
    setIsActive(false);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-5">
      <div className="p-10 text-center" style={{ width: '300px', height: '300px' }}>
        <div className="p-4 mb-4 border-purple-500 bg-white bg-opacity-30 rounded-lg shadow-lg text-6xl flex flex-col items-center justify-center h-full text-black">
          <div className="mb-5 text-black bg-opacity-100 w-full relative">
            {!isActive ? (
              <div className="relative w-full">
                <input
                  type="text"
                  value={category}
                  onChange={handleCategoryChange}
                  placeholder="Category"
                  className="text-lg p-2 border border-purple-500 rounded w-full bg-transparent text-center focus:outline-none focus:border-purple-700"
                />
                {category === 'Category' && (
                  <img src="/edit-pencil.svg" alt="edit-pencil" className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                )}
              </div>
            ) : (
              <span className="text-lg">{category}</span>
            )}
          </div>
          <div className="mb-5 text-black bg-opacity-100 w-full">
            {!isActive ? (
              <input
                type="number"
                value={duration}
                onChange={handleDurationChange}
                className="text-6xl text-center w-full border border-purple-500 rounded focus:outline-none bg-transparent bg-opacity-30 appearance-none focus:border-purple-700"
                min="1"
              />
            ) : (
              <span>{formatTime(timeLeft)}</span>
            )}
          </div>
        </div>
        <div className="flex gap-3 mb-5 justify-center">
          {!isActive && <button onClick={handleStart} className="px-4 py-2 bg-purple-500 text-white rounded">Start</button>}
          {isActive && !isPaused && <button onClick={handlePause} className="px-4 py-2 bg-yellow-500 text-white rounded">Pause</button>}
          {isActive && isPaused && <button onClick={handleResume} className="px-4 py-2 bg-green-500 text-white rounded">Resume</button>}
          {isActive && <button onClick={handleStop} className="px-4 py-2 bg-red-500 text-white rounded">Stop</button>}
        </div>
      </div>
    </main>
  );
}

// Future Cloud DB Integration
// To integrate with a cloud backend, you can add API calls in the handleStart, handleStop, and handleCategoryChange functions
// Example:
// const saveSession = async () => {
//   await fetch('/api/save-session', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ duration, category, timeLeft }),
//   });
// };
// Call saveSession() in the appropriate places to save the session data