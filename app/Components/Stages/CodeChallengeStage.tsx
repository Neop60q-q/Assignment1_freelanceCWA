'use client';
import React, { useState } from 'react';
import TextEditor from '../Texteditor';
import SimpleTextBox from '../ui/simpleTextBox';
import PreviewModal from '../PreviewModal';
import { Button } from '../ui/button';

interface CodeChallengeStageProps {
  stageId: number;
  storageKeyPrefix?: string;
}

export default function CodeChallengeStage({ 
  stageId, 
  storageKeyPrefix 
}: CodeChallengeStageProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [codeContent, setCodeContent] = useState('');

  const keyPrefix = storageKeyPrefix || `stage_${stageId}`;

  return (
    <>
      <div>
        <SimpleTextBox
          label="Enter your Question:"
          placeholder="Enter text..."
          onChange={(e) => setQuestionText(e.target.value)}
          storageKey={`${keyPrefix}_question`}
        />
      </div>
      <div className="mt-4">
        <TextEditor 
          stageId={stageId}
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

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        questionText={questionText}
        codeContent={codeContent}
      />
    </>
  );
}
