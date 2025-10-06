'use client';
import React, { useState, useEffect } from 'react';

interface TimerProps {
  isRunning: boolean;
  onTick: (time: number) => void;
}

export default function Timer({ isRunning, onTick }: TimerProps) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          onTick(newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, onTick]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-lg font-mono bg-card border border-border rounded-lg px-4 py-2">
      <span className="text-primary font-semibold">Mission Time: </span>
      {formatTime(time)}
    </div>
  );
}