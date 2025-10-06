'use client';
import React, { useState } from 'react';
import Navbar from '../Components/navBar';
import ProgressBar from '../Components/ProgressBar';
import Timer from '../Components/Timer';

export default function CodeAdventure() {
  const [currentStage, setCurrentStage] = useState(0);

  const handleStageChange = (stage: number) => {
    setCurrentStage(stage);
  };

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
          <ProgressBar onStageChange={handleStageChange} />
          <Timer />
        </div>

        <div className="content-box">
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">Stage {currentStage} content loading...</p>
          </div>
        </div>
      </main>
    </div>
  );
}