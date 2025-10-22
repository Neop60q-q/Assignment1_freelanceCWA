'use client';
import React, { useState } from 'react';
import { Button } from './ui/button';
import QuestionManager, { Question } from './apiFetch';
import { collectQuestionnaireFromStorage, loadQuestionnaireToStorage, clearQuestionnaireStorage, QuestionnaireData } from '../lib/questionnaireStorage';

interface QuestionnaireSaveLoadProps {
  onSave?: (data: QuestionnaireData) => Promise<void>;
  onLoad?: () => Promise<QuestionnaireData | null>;
  className?: string;
  useApi?: boolean; // New prop to enable API integration
}

export default function QuestionnaireSaveLoad({ 
  onSave, 
  onLoad, 
  className = "",
  useApi = false 
}: QuestionnaireSaveLoadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Use the QuestionManager hook when API is enabled
  const apiManager = useApi ? QuestionManager() : null;

  // Convert QuestionnaireData to Question format
  const questionnaireToQuestions = (questionnaire: QuestionnaireData): Omit<Question, 'id'>[] => {
    const questionsList: Omit<Question, 'id'>[] = [];

    // Add Code Challenge as a question
    if (questionnaire.challenge1?.question) {
      questionsList.push({
        timer: questionnaire.timer?.count || 60,
        question: `Code Challenge: ${questionnaire.challenge1.question}`,
        expectedAnswers: [questionnaire.challenge1.code || '']
      });
    }

    // Add Multiple Choice as a question
    if (questionnaire.challenge2?.prompt) {
      const correctAnswers = questionnaire.challenge2.options
        ?.filter(opt => opt.isCorrect)
        .map(opt => opt.text) || [];
      
      questionsList.push({
        timer: questionnaire.timer?.count || 60,
        question: `Multiple Choice: ${questionnaire.challenge2.prompt}`,
        expectedAnswers: correctAnswers
      });
    }

    return questionsList;
  };

  // Convert Questions back to QuestionnaireData format
  const questionsToQuestionnaire = (questionsList: Question[]): QuestionnaireData => {
    const codeChallenge = questionsList.find(q => q.question.startsWith('Code Challenge:'));
    const multipleChoice = questionsList.find(q => q.question.startsWith('Multiple Choice:'));

    return {
      title: 'Loaded Questionnaire',
      timer: {
        count: questionsList[0]?.timer || 60,
        isPaused: true
      },
      background: null,
      challenge1: {
        question: codeChallenge?.question.replace('Code Challenge: ', '') || '',
        code: codeChallenge?.expectedAnswers[0] || ''
      },
      challenge2: {
        prompt: multipleChoice?.question.replace('Multiple Choice: ', '') || '',
        options: [
          { id: '1', text: multipleChoice?.expectedAnswers[0] || 'Option A', isCorrect: true },
          { id: '2', text: 'Option B', isCorrect: false }
        ]
      }
    };
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const questionnaireData = collectQuestionnaireFromStorage();
      
      if (onSave) {
        await onSave(questionnaireData);
      } else if (useApi && apiManager) {
        // Use API to save as questions
        const questionsToSave = questionnaireToQuestions(questionnaireData);
        for (const question of questionsToSave) {
          await apiManager.addQuestion(question.timer, question.question, question.expectedAnswers);
        }
        alert('Questionnaire saved successfully to API as questions!');
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
      } else if (useApi && apiManager) {
        // Load from API
        await apiManager.fetchQuestions();
        if (apiManager.questions.length > 0) {
          questionnaireData = questionsToQuestionnaire(apiManager.questions);
        } else {
          alert('No questions found in API');
          return;
        }
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
        {isLoading ? 'Loading...' : useApi ? 'Load from API' : 'Load'}
      </Button>
      
      <Button 
        onClick={handleSave}
        disabled={isLoading || isSaving}
      >
        {isSaving ? 'Saving...' : useApi ? 'Save to API' : 'Save'}
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
