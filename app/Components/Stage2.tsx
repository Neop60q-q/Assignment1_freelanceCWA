'use client';
import React, { useState } from 'react';

interface Stage2Props {
  onComplete: () => void;
}

export default function Stage2({ onComplete }: Stage2Props) {
  const [code, setCode] = useState(`// Write a loop to connect all 5 wire panels
// Use a for loop to check each panel's connection
// Each panel needs to be connected in sequence

function connectWirePanels() {
  // Your code here
}`);

  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState('');

  const checkCode = () => {
    setAttempts(prev => prev + 1);
    
    // Check if code contains required elements
    const hasForLoop = /for\s*\([^)]*\)/.test(code);
    const hasCounter = /let|var|const.*=.*0.*/.test(code);
    const hasIncrement = /i\+\+|i\s*=\s*i\s*\+\s*1/.test(code);
    const hasCondition = /i\s*<\s*5/.test(code);
    
    if (hasForLoop && hasCounter && hasIncrement && hasCondition) {
      onComplete();
    } else {
      setError('The wire panels aren\'t properly connected. Check your loop!');
      setShowHint(true);
    }
  };

  const getHint = () => {
    const hints = [
      'You need to use a for loop to connect all panels',
      'Start your counter at 0',
      'There are 5 panels to connect',
      'Make sure to increment your counter',
      'Each panel must be connected in sequence'
    ];
    return hints[Math.min(attempts, hints.length - 1)];
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Stage 2: Rewire the Panels</h2>
        <p className="text-muted-foreground mb-4">
          Write a loop to connect all 5 wire panels in sequence. This will redirect power from the security system.
        </p>
        
        <div className="space-y-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-48 font-mono text-sm bg-background border border-border rounded-lg p-4"
            spellCheck="false"
          />
          
          {error && (
            <div className="text-destructive text-sm">
              {error}
            </div>
          )}
          
          {showHint && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium">Hint:</p>
              <p className="text-sm text-muted-foreground">{getHint()}</p>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowHint(true)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Need a hint?
            </button>
            
            <button
              onClick={checkCode}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Test Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}