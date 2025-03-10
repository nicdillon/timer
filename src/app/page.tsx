'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { saveFocusSession, FocusSession } from './lib/saveFocusSession';

export default function RootPage() {
  const [duration, setDuration] = useState(25); // Default duration in minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Time left in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [category, setCategory] = useState('Category');
  const hasFinished = useRef(false);

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

    // Only start the interval if the timer is active and not paused
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          // If more than one second remains, decrease the timeLeft
          if (prevTime > 1) {
            return prevTime - 1;
          } else {
            // Clear the interval immediately to avoid calling handleTimerFinish more than once
            if (interval) {
              clearInterval(interval);
            }
            // Call handleTimerFinish once when timer reaches zero
            if (prevTime === 1) {
              handleTimerFinish();
            }
            return 0;
          }
        });
      }, 1000);
    }

    // Cleanup: clear the interval when the effect or component is unmounted
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft]);

  const { user, error } = useUser();

  if (error) {
    console.log("Error loading user:", error);
  }

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    hasFinished.current = false;
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    hasFinished.current = false;
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

  // Updated handleTimerFinish function to call saveFocusSession when a focus session ends
  const handleTimerFinish = async () => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    setTimeLeft(duration * 60);
    // Play an alarm sound
    const audio = new Audio('/alarm.wav');
    audio.play();

    // Deactivate the timer
    setIsActive(false);

    // Capture the user ID from the Auth0 authentication context
    // If the user is not authenticated, don't save the session
    const userId = user ? user.sub : null;
    if (!userId) {
      console.error('User is not authenticated. Focus session not saved.');
      return;
    }

    // Build the focus session data object
    const sessionData: FocusSession = {
      user_id: userId,          // Authenticated user's ID
      category,                 // Focus session category (from state)
      duration,                 // Duration of the session (from state)
      start_time: new Date(),   // Timestamp when the session started (update if you maintain a separate start time)
    };
    console.log('Saving focus session:', sessionData);
    // Attempt to save the focus session using the Supabase client
    try {
      await saveFocusSession(sessionData);
    } catch (err) {
      // Catch any unexpected errors during the API call
      console.error('Error saving focus session:', err);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 p-5">
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
          {!isActive && <button onClick={handleStart} className="px-4 py-2  bg-purple-600 text-white rounded">Start</button>}
          {isActive && !isPaused && <button onClick={handlePause} className="px-4 py-2  bg-yellow-600 text-white rounded">Pause</button>}
          {isActive && isPaused && <button onClick={handleResume} className="px-4 py-2  bg-green-600 text-white rounded">Resume</button>}
          {isActive && <button onClick={handleStop} className="px-4 py-2 bg-red-600  text-white rounded">Stop</button>}
        </div>
      </div>
    </main>
  );
}