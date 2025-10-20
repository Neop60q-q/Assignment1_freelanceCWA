'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

const Timer: React.FC = () => {
  const [timerCount, setTimer] = useState(60); // Start with 60 seconds
  const [isPaused, setIsPaused] = useState(true);
  const [customTime, setCustomTime] = useState('');
  const storageKey = 'questionnaire_timer_state';

  // Load saved timer state on component mount
  useEffect(() => {
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      try {
        const { timerCount: savedTimer, isPaused: savedPaused } = JSON.parse(savedState);
        setTimer(savedTimer);
        setIsPaused(savedPaused);
      } catch (error) {
        console.error('Error loading timer state:', error);
      }
    }
  }, [storageKey]);

  // Save timer state whenever it changes
  useEffect(() => {
    const timerState = {
      timerCount,
      isPaused,
      timestamp: Date.now()
    };
    localStorage.setItem(storageKey, JSON.stringify(timerState));
  }, [timerCount, isPaused, storageKey]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    
    if (!isPaused) {
      interval = setInterval(() => {
        setTimer(lastTimerCount => {
          if (lastTimerCount <= 0) {
            if (interval) clearInterval(interval);
            setIsPaused(true);
            return 0;
          }
          return lastTimerCount - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused]);

  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    const pad = (num: number): string => num.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const handleSetCustomTime = () => {
    const newTime = parseInt(customTime);
    if (!isNaN(newTime) && newTime > 0) {
      setTimer(newTime);
      setCustomTime('');
    }
  };

  const handleReset = () => {
    setTimer(60);
    setIsPaused(true);
    setCustomTime('');
  };

  return (
    <div className="text-center p-4 space-y-4">
      <div className="inline-block px-4 py-2 rounded-lg bg-secondary text-secondary-foreground">
        <span className="text-xl font-mono font-bold">{timerCount}</span>
      </div>
      
      <div className="flex flex-col space-y-4">
        {/* Time Input */}
        <div className="flex justify-center space-x-2">
          <input
            type="number"
            min="1"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            className="w-24 px-2 py-1 border rounded text-center bg-background text-foreground"
            placeholder="Seconds"
          />
          <Button
            variant="outline"
            onClick={handleSetCustomTime}
          >
            Set Time
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Timer;
