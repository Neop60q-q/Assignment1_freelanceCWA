'use client';
import React from 'react';
import TextEditor from '../Texteditor';
import SimpleTextBox from '../ui/simpleTextBox';

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
            <>
              <div>
                <SimpleTextBox
                  label="Enter your Question:"
                  placeholder="Enter text..."
                />
              </div>
              <div className="mt-4">
                <TextEditor 
                  stageId={1}
                  initialCode="function unlockMainFrame() {\n  // Your code here\n}"
                  onChange={(newCode) => {
                    console.log('Code changed:', newCode);
                  }}
                  onSave={async (code) => {
                    // This is where you'll add your database save logic later
                    // For example:
                    // await saveCodeToDatabase(stageId, code);
                  }}
                />
              </div>
            </>
          )}

          
          {stageNumber === 2 && (
            <>
              <p>Bypass the firewall by fixing this function:</p>
              <pre className="mt-2 bg-background p-2 rounded">
                {`function bypassFirewall() {
  // Your code here
}`}
              </pre>
            </>
          )}
          
          {stageNumber === 3 && (
            <>
              <p>Final step - override the escape pod controls:</p>
              <pre className="mt-2 bg-background p-2 rounded">
                {`function launchEscapePod() {
  // Your code here
}`}
              </pre>
            </>
          )}
        </div>
      </div>

      {/* Placeholder for code editor (we'll add this later) */}
      <div className="code-editor-area min-h-[200px] bg-muted p-4 rounded">
        <p className="text-muted-foreground">Code editor will be added here</p>
      </div>

      {/* Placeholder for test results */}
      <div className="test-results mt-4 p-4 bg-muted rounded">
        <p className="text-muted-foreground">Test results will appear here</p>
      </div>
    </div>
  );
}