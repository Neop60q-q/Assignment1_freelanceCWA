'use client';

import React, { useState } from 'react';

interface ProgressBarProps {
  onStageChange?: (stage: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ onStageChange }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const totalStages = 3;

  const progress = (currentStage / totalStages) * 100;

  const startGame = () => {
    setGameStarted(true);
    if (onStageChange) onStageChange(currentStage);
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
          {/* Glowing effect for space theme */}
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
                  ? 'bg-primary/80 text-primary-foreground'
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
