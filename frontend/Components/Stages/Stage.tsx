'use client';
import React from 'react';
import MultipleChoiceStage from './MultipleChoiceStage';
import CodeChallengeStage from './CodeChallengeStage';

interface StageProps {
  stageNumber: number;
  // We'll add more props as needed for code challenges
}

export default function Stage({ stageNumber }: StageProps) {

  return (
    <div className="stage-content p-6 bg-card rounded-lg">
      <h2 className="text-xl font-bold mb-4">Challenge {stageNumber}</h2>
      
      {/* Placeholder for code challenge */}
      <div className="code-challenge-area mb-4">
        <p className="text-muted-foreground mb-2">Your mission:</p>
        <div className="challenge-description bg-muted p-4 rounded">
          {stageNumber === 1 && (
            <CodeChallengeStage stageId={1} />
          )}

          {stageNumber === 2 && (
            <>
              <MultipleChoiceStage />
            </>
          )}
          
          {stageNumber === 3 && (
            <CodeChallengeStage stageId={3} />
          )}
        </div>
      </div>
    </div>
  );
}