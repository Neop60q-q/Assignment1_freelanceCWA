// Utility functions for managing questionnaire builder state
// Handles the transition between localStorage (draft) and PostgreSQL (published)

export interface QuestionnaireData {
  id?: string;
  title: string;
  timer: {
    count: number;
    isPaused: boolean;
  };
  background: string | null;
  challenge1: {
    question: string;
    code: string;
  };
  challenge2: {
    prompt: string;
    options: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
    }>;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Collect all current localStorage data into a questionnaire object
export function collectQuestionnaireFromStorage(): QuestionnaireData {
  // Timer state
  const timerState = localStorage.getItem('questionnaire_timer_state');
  const timer = timerState ? JSON.parse(timerState) : { timerCount: 60, isPaused: true };
  
  // Background
  const background = localStorage.getItem('customBackground');
  
  // Challenge 1 (Code Challenge)
  const challenge1Question = localStorage.getItem('stage_1_question') || '';
  const challenge1Code = localStorage.getItem('stage_1_code') || '';
  
  // Challenge 2 (Multiple Choice)
  const challenge2Prompt = localStorage.getItem('mcq_stage_2_prompt') || '';
  
  // Collect all MCQ options
  const options: Array<{id: string, text: string, isCorrect: boolean}> = [];
  const optionKeys = Object.keys(localStorage).filter(key => key.startsWith('mcq_stage_2_opt_'));
  
  optionKeys.forEach(key => {
    const optionId = key.replace('mcq_stage_2_opt_', '');
    const text = localStorage.getItem(key) || '';
    // Note: You'll need to track correct answers separately
    options.push({ id: optionId, text, isCorrect: false });
  });

  return {
    title: 'Untitled Questionnaire', // You might want to add a title field
    timer: {
      count: timer.timerCount,
      isPaused: timer.isPaused
    },
    background,
    challenge1: {
      question: challenge1Question,
      code: challenge1Code
    },
    challenge2: {
      prompt: challenge2Prompt,
      options
    }
  };
}

// Load questionnaire data into localStorage
export function loadQuestionnaireToStorage(data: QuestionnaireData): void {
  // Timer
  localStorage.setItem('questionnaire_timer_state', JSON.stringify({
    timerCount: data.timer.count,
    isPaused: data.timer.isPaused,
    timestamp: Date.now()
  }));
  
  // Background
  if (data.background) {
    localStorage.setItem('customBackground', data.background);
  }
  
  // Challenge 1
  localStorage.setItem('stage_1_question', data.challenge1.question);
  localStorage.setItem('stage_1_code', data.challenge1.code);
  
  // Challenge 2
  localStorage.setItem('mcq_stage_2_prompt', data.challenge2.prompt);
  
  // Clear existing options first
  const existingKeys = Object.keys(localStorage).filter(key => key.startsWith('mcq_stage_2_opt_'));
  existingKeys.forEach(key => localStorage.removeItem(key));
  
  // Set new options
  data.challenge2.options.forEach(option => {
    localStorage.setItem(`mcq_stage_2_opt_${option.id}`, option.text);
  });
}

// Clear all questionnaire-related localStorage
export function clearQuestionnaireStorage(): void {
  const keysToRemove = [
    'questionnaire_timer_state',
    'customBackground',
    'stage_1_question',
    'stage_1_code',
    'mcq_stage_2_prompt'
  ];
  
  // Add all MCQ option keys
  const optionKeys = Object.keys(localStorage).filter(key => key.startsWith('mcq_stage_2_opt_'));
  keysToRemove.push(...optionKeys);
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
}
