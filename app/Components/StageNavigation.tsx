'use client';
import React from 'react';
import { Button } from './ui/button';
import { gameConfig } from '../config/gameConfig';

export interface StageNavigationProps {
  currentStage: number;
  onStageChange: (stage: number) => void;
}

export default function StageNavigation({

  currentStage,
  onStageChange,

}: StageNavigationProps) {
  // Debug log when component renders
//   console.log('StageNavigation rendered with:', { currentStage, isFirstStage, isLastStage });

  const handlePreviousStage = () => {
     onStageChange(currentStage - 1);
  };

  const handleNextStage = () => {
    onStageChange(Math.min(gameConfig.totalStages, currentStage + 1));
  };

  return (
    <div className="flex justify-center gap-4 mt-4">
      <Button
        variant="outline"
        onClick={handlePreviousStage}
        disabled={currentStage <= 1}
      >
        Previous Stage
      </Button>
      <Button
        variant="outline"
        onClick={handleNextStage}
        disabled={currentStage >= 3}
      >
        Next Stage
      </Button>
    </div>
  );
}