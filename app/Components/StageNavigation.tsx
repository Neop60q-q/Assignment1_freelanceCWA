'use client';
import React from 'react';
import { Button } from './ui/button';

interface StageNavigationProps {
  currentStage: number;
  onStageChange: (stage: number) => void;
  isFirstStage: boolean;
  isLastStage: boolean;
}

export default function StageNavigation({
  currentStage,
  onStageChange,
  isFirstStage,
  isLastStage,
}: StageNavigationProps) {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <Button
        variant="outline"
        onClick={() => onStageChange(currentStage - 1)}
        disabled={isFirstStage}
      >
        Previous Stage
      </Button>
      <Button
        variant="outline"
        onClick={() => onStageChange(currentStage + 1)}
        disabled={isLastStage}
      >
        Next Stage
      </Button>
    </div>
  );
}