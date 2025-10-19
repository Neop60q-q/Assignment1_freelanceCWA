'use client';

import React, { useState } from 'react';
import { gameConfig } from '../config/gameConfig';
const { totalStages } = gameConfig;


interface ProgressBarProps {
  currentStage: number;
  gameStarted?: boolean;
  onGameStart?: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStage, 
  gameStarted = false,
  onGameStart
}) => {
  const progress = ((currentStage - 1) / (totalStages - 1)) * 100; // minus 1 to make it starting from 0%

  const startGame = () => {
    if (onGameStart) onGameStart();
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm font-medium text-primary">
          Stage {currentStage} of {totalStages}
        </span>
        <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-4 bg-secondary overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500 relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-primary/30"></div>
        </div>
      </div>
      {/* Stage indicators */}
      <div className="relative w-full mt-2 flex justify-between px-2">
        {[...Array(totalStages)].map((_, index) => (
          <div
            key={index}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
              ${
                index < currentStage
                  ? 'bg-primary text-primary-foreground'
                  : index === currentStage 
                  ? 'bg-primary/50 text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
