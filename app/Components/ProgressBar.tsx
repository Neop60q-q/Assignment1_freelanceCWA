'use client';
import React from 'react';

interface ProgressBarProps {
  currentStage: number;
  totalStages: number;
}

export default function ProgressBar({ currentStage, totalStages }: ProgressBarProps) {
  const progress = (currentStage / totalStages) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progress: Stage {currentStage} of {totalStages}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between px-1">
        {Array.from({ length: totalStages }, (_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div 
              className={`w-4 h-4 rounded-full ${
                i < currentStage ? 'bg-primary' : 
                i === currentStage ? 'bg-primary/50' : 
                'bg-secondary'
              }`}
            />
            <span className="text-xs text-muted-foreground mt-1">
              Stage {i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}