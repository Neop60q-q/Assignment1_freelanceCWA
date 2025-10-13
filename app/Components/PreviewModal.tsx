'use client';

import React from 'react';
import { Button } from './ui/button';

type MultipleChoiceOption = {
  id: string;
  text: string;
};

type MultipleChoiceQuestion = {
  prompt: string;
  options: MultipleChoiceOption[];
  correctOptionIds: string[];
};

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionText?: string;
  codeContent?: string;
  multipleChoiceQuestion?: MultipleChoiceQuestion;
}

export default function PreviewModal({
  isOpen,
  onClose,
  questionText,
  codeContent,
  multipleChoiceQuestion,
}: PreviewModalProps) {
  if (!isOpen) return null;

  const renderContent = () => {
    if (multipleChoiceQuestion) {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Question:</h3>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
              {multipleChoiceQuestion.prompt || 'No question entered'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Options:</h3>
            <div className="space-y-2">
              {multipleChoiceQuestion.options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="preview-answer"
                    disabled
                    className="cursor-not-allowed"
                  />
                  <span className="text-sm">
                    {option.text || `Option ${index + 1} (empty)`}
                  </span>
                  {multipleChoiceQuestion.correctOptionIds.includes(option.id) && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      ✓ Correct
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Question:</h3>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
            {questionText}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Code:</h3>
          <pre className="text-sm bg-muted p-3 rounded overflow-x-auto">
            <code>{codeContent}</code>
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className="flex flex-col space-y-4">
          <h2 className="text-lg font-semibold">Preview</h2>
          
          {renderContent()}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}