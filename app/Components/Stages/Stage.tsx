'use client';
import React, { useState } from 'react';
import TextEditor from '../Texteditor';
import SimpleTextBox from '../ui/simpleTextBox';
import PreviewModal from '../PreviewModal';
import { Button } from '../ui/button';

interface StageProps {
  stageNumber: number;
  // We'll add more props as needed for code challenges
}

export default function Stage({ stageNumber }: StageProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [codeContent, setCodeContent] = useState('');

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
                  onChange={(e) => setQuestionText(e.target.value)}
                  storageKey={`question_stage_${stageNumber}`}
                />
              </div>
              <div className="mt-4">
                <TextEditor 
                  stageId={1}
                  initialCode="// Enter expected answer code input here"
                  onChange={(newCode) => {
                    setCodeContent(newCode);
                  }}
                  onSave={async (code) => {
                    // This is where you'll add your database save logic later
                    // For example:
                    // await saveCodeToDatabase(stageId, code);
                  }}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => setIsPreviewOpen(true)}
                  variant="outline"
                >
                  Preview Challenge
                </Button>
              </div>
            </>
          )}

          
          {stageNumber === 2 && (
            <>
              <div>
                <SimpleTextBox
                  label="Enter your Question:"
                  placeholder="Enter text..."
                  onChange={(e) => setQuestionText(e.target.value)}
                  storageKey={`question_stage_${stageNumber}`}
                />
              </div>
              <div className="mt-4">
                <TextEditor 
                  stageId={2}
                  initialCode="function bypassFirewall() {\n  // Your code here\n}"
                  onChange={(newCode) => {
                    setCodeContent(newCode);
                  }}
                  onSave={async (code) => {
                    // This is where you'll add your database save logic later
                  }}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => setIsPreviewOpen(true)}
                  variant="outline"
                >
                  Preview Challenge
                </Button>
              </div>
            </>
          )}
          
          {stageNumber === 3 && (
            <>
              <div>
                <SimpleTextBox
                  label="Enter your Question:"
                  placeholder="Enter text..."
                  onChange={(e) => setQuestionText(e.target.value)}
                  storageKey={`question_stage_${stageNumber}`}
                />
              </div>
              <div className="mt-4">
                <TextEditor 
                  stageId={3}
                  initialCode="function launchEscapePod() {\n  // Your code here\n}"
                  onChange={(newCode) => {
                    setCodeContent(newCode);
                  }}
                  onSave={async (code) => {
                    // This is where you'll add your database save logic later
                  }}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => setIsPreviewOpen(true)}
                  variant="outline"
                >
                  Preview Challenge
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        questionText={questionText}
        codeContent={codeContent}
      />
    </div>
  );
}