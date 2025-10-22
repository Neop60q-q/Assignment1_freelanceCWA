'use client';
import React from 'react';
import SimpleTextBox from '../ui/simpleTextBox';
import { Button } from '../ui/button';
import PreviewModal from '../PreviewModal';

type MultipleChoiceOption = {
  id: string;
  text: string;
};

type MultipleChoiceQuestion = {
  prompt: string;
  options: MultipleChoiceOption[];
  correctOptionIds: string[]; // supports single or multiple correct
};

interface MultipleChoiceStageProps {
  storageKeyPrefix?: string;
}

export default function MultipleChoiceStage({ storageKeyPrefix = 'mcq_stage_2' }: MultipleChoiceStageProps) {
  const [question, setQuestion] = React.useState<MultipleChoiceQuestion>({
    prompt: '',
    options: [
      { id: crypto.randomUUID(), text: '' },
      { id: crypto.randomUUID(), text: '' },
    ],
    correctOptionIds: [],
  });

  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  const addOption = () => {
    setQuestion(prev => ({
      ...prev,
      options: [...prev.options, { id: crypto.randomUUID(), text: '' }],
    }));
  };

  const removeOption = (id: string) => {
    setQuestion(prev => ({
      ...prev,
      options: prev.options.filter(o => o.id !== id),
      correctOptionIds: prev.correctOptionIds.filter(cid => cid !== id),
    }));
  };

  const updateOptionText = (id: string, text: string) => {
    setQuestion(prev => ({
      ...prev,
      options: prev.options.map(o => (o.id === id ? { ...o, text } : o)),
    }));
  };

  const toggleCorrect = (id: string) => {
    setQuestion(prev => ({
      ...prev,
      correctOptionIds: prev.correctOptionIds.includes(id)
        ? prev.correctOptionIds.filter(cid => cid !== id)
        : [...prev.correctOptionIds, id],
    }));
  };

  const isValid = () => {
    const hasPrompt = question.prompt.trim().length > 0;
    const nonEmptyOptions = question.options.filter(o => o.text.trim().length > 0);
    const hasAtLeastTwo = nonEmptyOptions.length >= 2;
    const hasCorrect = question.correctOptionIds.length >= 1;
    return hasPrompt && hasAtLeastTwo && hasCorrect;
  };

  return (
    <div className="space-y-4">
      <SimpleTextBox
        label="Enter your Question:"
        placeholder="Type the multiple-choice question prompt"
        storageKey={`${storageKeyPrefix}_prompt`}
        onChange={(e) => setQuestion(prev => ({ ...prev, prompt: e.target.value }))}
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Options</h3>
          <Button variant="outline" onClick={addOption}>Add option</Button>
        </div>

        <div className="space-y-2">
          {question.options.map((opt, index) => (
            <div key={opt.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                aria-label="Mark as correct"
                checked={question.correctOptionIds.includes(opt.id)}
                onChange={() => toggleCorrect(opt.id)}
              />
              <SimpleTextBox
                placeholder={`Option ${index + 1}`}
                className="flex-1"
                storageKey={`${storageKeyPrefix}_opt_${opt.id}`}
                onChange={(e) => updateOptionText(opt.id, e.target.value)}
              />
              <Button
                variant="ghost"
                onClick={() => removeOption(opt.id)}
                disabled={question.options.length <= 2}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => setIsPreviewOpen(true)}
          aria-disabled={!isValid()} 
          disabled={!isValid()}
        >
          Preview Question
        </Button>
      </div>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        multipleChoiceQuestion={question}
      />
    </div>
  );
}


