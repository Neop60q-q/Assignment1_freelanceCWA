'use client';
import React, { useState } from 'react';

interface Stage1Props {
  onComplete: () => void;
}

export default function Stage1({ onComplete }: Stage1Props) {
  const [code, setCode] = useState(`function checkSecuritySystem(  ){
console.log("Starting system check"
let status="operational"
if(status="operational"){
console.log(System ready)
}
}`);
  
  const correctCode = `function checkSecuritySystem() {
  console.log("Starting system check");
  let status = "operational";
  if (status === "operational") {
    console.log("System ready");
  }
}`;

  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState('');

  const checkCode = () => {
    setAttempts(prev => prev + 1);
    
    // Remove whitespace and new lines for comparison
    const normalizedUserCode = code.replace(/\s/g, '');
    const normalizedCorrectCode = correctCode.replace(/\s/g, '');
    
    if (normalizedUserCode === normalizedCorrectCode) {
      onComplete();
    } else {
      setError('Code formatting is not quite right. Try again!');
      setShowHint(true);
    }
  };

  const getHint = () => {
    const hints = [
      'Check your parentheses and curly braces',
      'Make sure strings are properly quoted',
      'Assignment (=) vs comparison (===)',
      'Don\'t forget your semicolons',
      'Proper indentation helps readability'
    ];
    return hints[Math.min(attempts, hints.length - 1)];
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Stage 1: Hack the Security System</h2>
        <p className="text-muted-foreground mb-4">
          Fix the corrupted code to bypass the security system. Pay attention to proper formatting and syntax.
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
              Submit Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}