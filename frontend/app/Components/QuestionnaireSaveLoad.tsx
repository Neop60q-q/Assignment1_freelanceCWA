'use client';
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import QuestionManager, { Question } from './apiFetch';
import { collectQuestionnaireFromStorage, loadQuestionnaireToStorage, clearQuestionnaireStorage, QuestionnaireData } from '../lib/questionnaireStorage';

interface QuestionnaireSaveLoadProps {
  className?: string;
}

export default function QuestionnaireSaveLoadCombined({ 
  className = "" 
}: QuestionnaireSaveLoadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showQuestionsList, setShowQuestionsList] = useState(false);

  // Use the QuestionManager hook
  const {
    questions,
    newQuestion,
    setNewQuestion,
    fetchQuestions,
    updateTimer,
    addQuestion,
    deleteQuestion
  } = QuestionManager();

  useEffect(() => {
    fetchQuestions();
  }, []);

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
      title: 'Imported Questionnaire',
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
      const questionsToSave = questionnaireToQuestions(questionnaireData);

      // Save each question to the API
      for (const question of questionsToSave) {
        await addQuestion(question.timer, question.question, question.expectedAnswers);
      }

      alert('Questionnaire saved successfully as questions!');
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
      // Fetch latest questions
      await fetchQuestions();
      
      if (questions.length > 0) {
        const questionnaireData = questionsToQuestionnaire(questions);
        loadQuestionnaireToStorage(questionnaireData);
        alert('Questions loaded as questionnaire! (Refresh page to see changes)');
      } else {
        alert('No questions found to load');
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Error loading questions');
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

  const handleClearAllQuestions = async () => {
    if (confirm('This will delete ALL questions from the database. Are you sure?')) {
      try {
        for (const question of questions) {
          await deleteQuestion(question.id);
        }
        alert('All questions cleared from database!');
      } catch (error) {
        console.error('Error clearing questions:', error);
        alert('Error clearing questions');
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Save/Load Controls */}
      <div className="flex gap-2 flex-wrap">
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
          {isLoading ? 'Loading...' : 'Load from API'}
        </Button>
        
        <Button 
          onClick={handleSave}
          disabled={isLoading || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save to API'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleExport}
          disabled={isLoading || isSaving}
        >
          Export JSON
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleImport}
          disabled={isLoading || isSaving}
        >
          Import JSON
        </Button>

        <Button 
          variant="outline" 
          onClick={() => setShowQuestionsList(!showQuestionsList)}
          disabled={isLoading || isSaving}
        >
          {showQuestionsList ? 'Hide' : 'Show'} Questions ({questions.length})
        </Button>
      </div>

      {/* Questions List */}
      {showQuestionsList && (
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Questions in Database</h3>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleClearAllQuestions}
              disabled={questions.length === 0}
            >
              Clear All
            </Button>
          </div>

          {questions.length === 0 ? (
            <p className="text-gray-500">No questions found in database.</p>
          ) : (
            <div className="space-y-2">
              {questions.map((question) => (
                <div key={question.id} className="flex justify-between items-start p-3 border rounded">
                  <div className="flex-1">
                    <p className="font-medium">{question.question}</p>
                    <p className="text-sm text-gray-500">Timer: {question.timer}s</p>
                    <p className="text-sm text-gray-500">
                      Expected: {question.expectedAnswers.join(', ')}
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteQuestion(question.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
