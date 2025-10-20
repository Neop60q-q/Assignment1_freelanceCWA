'use client';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { collectQuestionnaireFromStorage, loadQuestionnaireToStorage, clearQuestionnaireStorage, QuestionnaireData } from '../lib/questionnaireStorage';

interface QuestionnaireSaveLoadProps {
  onSave?: (data: QuestionnaireData) => Promise<void>;
  onLoad?: () => Promise<QuestionnaireData | null>;
  className?: string;
}

export default function QuestionnaireSaveLoad({ 
  onSave, 
  onLoad, 
  className = "" 
}: QuestionnaireSaveLoadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const questionnaireData = collectQuestionnaireFromStorage();
      
      if (onSave) {
        await onSave(questionnaireData);
      } else {
        // Default behavior: just log to console
        console.log('Saving questionnaire:', questionnaireData);
        alert('Questionnaire saved successfully! (Currently just logged to console)');
      }
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      alert('Error saving questionnaire');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = async () => {
    setIsLoading(true);
    try {
      let questionnaireData: QuestionnaireData | null = null;
      
      if (onLoad) {
        questionnaireData = await onLoad();
      } else {
        // Default behavior: load example data
        questionnaireData = {
          title: 'Example Questionnaire',
          timer: { count: 120, isPaused: true },
          background: null,
          challenge1: { question: 'What is 2+2?', code: 'console.log(4);' },
          challenge2: { 
            prompt: 'Which is correct?', 
            options: [
              { id: '1', text: 'Option A', isCorrect: true },
              { id: '2', text: 'Option B', isCorrect: false }
            ]
          }
        };
      }
      
      if (questionnaireData) {
        loadQuestionnaireToStorage(questionnaireData);
        alert('Questionnaire loaded! (Refresh page to see changes)');
      }
    } catch (error) {
      console.error('Error loading questionnaire:', error);
      alert('Error loading questionnaire');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNew = () => {
    if (confirm('This will clear all current data. Are you sure?')) {
      clearQuestionnaireStorage();
      alert('Questionnaire cleared! (Refresh page to see changes)');
    }
  };

  const handleExport = () => {
    try {
      const questionnaireData = collectQuestionnaireFromStorage();
      const dataStr = JSON.stringify(questionnaireData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'questionnaire.json';
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting questionnaire:', error);
      alert('Error exporting questionnaire');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const questionnaireData = JSON.parse(e.target?.result as string) as QuestionnaireData;
          loadQuestionnaireToStorage(questionnaireData);
          alert('Questionnaire imported! (Refresh page to see changes)');
        } catch (error) {
          console.error('Error importing questionnaire:', error);
          alert('Error importing questionnaire file');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button 
        variant="outline" 
        onClick={handleNew}
        disabled={isLoading || isSaving}
      >
        New
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleLoad}
        disabled={isLoading || isSaving}
      >
        {isLoading ? 'Loading...' : 'Load'}
      </Button>
      
      <Button 
        onClick={handleSave}
        disabled={isLoading || isSaving}
      >
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleExport}
        disabled={isLoading || isSaving}
      >
        Export
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleImport}
        disabled={isLoading || isSaving}
      >
        Import
      </Button>
    </div>
  );
}
