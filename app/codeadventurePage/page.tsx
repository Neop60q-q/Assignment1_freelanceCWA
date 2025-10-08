'use client';
import React from 'react';
import Navbar from '../Components/navBar';
import ProgressBar from '../Components/ProgressBar';
import Timer from '../Components/Timer';
import StageNavigation from '../Components/StageNavigation';
import Stage from '../Components/Stages/Stage';
import { gameConfig } from '../config/gameConfig';

export default function CodeAdventure() {
  const [currentStage, setCurrentStage] = React.useState(1);
  const [gameStarted, setGameStarted] = React.useState(false);
  
  const handleStageChange = (stage: number) => {
    setCurrentStage(stage);
  };

  const handleGameStart = () => {
    setGameStarted(true);
  };

  const { totalStages } = gameConfig;


  return (
    <div className="page-container">
      <Navbar />
      
      <main className="main-content">
        <div className="section-header">
          <h1 className="section-title">
            Spaceship Breakout
          </h1>
          <p className="section-description">
            You're trapped in a high-security space prison. Use your coding skills to hack
            the systems, rewire the circuits, and make your escape. But hurry - time is running out!
          </p>
        </div>

        <div className="space-y-6">
          <ProgressBar 
            currentStage={currentStage}
            gameStarted={gameStarted}
            onGameStart={handleGameStart}
          />
          <StageNavigation
            currentStage={currentStage}
            onStageChange={handleStageChange}
          />
          <Timer />
        </div>

        <div className="content-box p-4">
          <Stage stageNumber={currentStage} />
        </div>
      </main>
    </div>
  );
}

// plan
