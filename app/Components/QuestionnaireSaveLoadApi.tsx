// app/Components/QuestionnaireSaveLoadApi.tsx - API integration using the new question-based structure

'use client';
import React from 'react';
import QuestionnaireSaveLoad from './QuestionnaireSaveLoad';

interface QuestionnaireSaveLoadApiProps {
  onSave?: (data: QuestionnaireData) => Promise<QuestionnaireData | null>;
  onLoad?: () => Promise<QuestionnaireData | null>;
  className?: string;
}

export default function QuestionnaireSaveLoadApi({ 
  onSave, 
  onLoad, 
  className = "" 
}: QuestionnaireSaveLoadApiProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireData[]>([]);
  const [showLoadMenu, setShowLoadMenu] = useState(false);

  // Load questionnaires from API
  const loadQuestionnaires = async () => {
    try {
      const data = await QuestionnaireApiStorage.getAll();
      setQuestionnaires(data);
    } catch (error) {
      console.error('Failed to load questionnaires:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const questionnaireData = collectQuestionnaireFromStorage();
      
      if (onSave) {
        await onSave(questionnaireData);
      } else {
        // Use API storage
        const savedQuestionnaire = await QuestionnaireApiStorage.save(questionnaireData);
        
        if (savedQuestionnaire) {
          alert('Questionnaire saved successfully!');
          // Refresh the questionnaires list
          await loadQuestionnaires();
        } else {
          alert('Failed to save questionnaire');
        }
      }
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      alert('Error saving questionnaire');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = async (questionnaire?: QuestionnaireData) => {
    setIsLoading(true);
    try {
      let questionnaireData: QuestionnaireData | null = null;
      
      if (questionnaire) {
        // Load specific questionnaire
        questionnaireData = questionnaire;
      } else if (onLoad) {
        questionnaireData = await onLoad();
      } else {
        // Load most recent from API
        questionnaireData = await QuestionnaireApiStorage.load();
      }
      
      if (questionnaireData) {
        loadQuestionnaireToStorage(questionnaireData);
        alert('Questionnaire loaded! (Refresh page to see changes)');
        setShowLoadMenu(false);
      } else {
        alert('No questionnaire found to load');
      }
    } catch (error) {
      console.error('Error loading questionnaire:', error);
      alert('Error loading questionnaire');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this questionnaire?')) {
      return;
    }

    try {
      const success = await QuestionnaireApiStorage.delete(id);
      if (success) {
        alert('Questionnaire deleted successfully');
        await loadQuestionnaires();
      } else {
        alert('Failed to delete questionnaire');
      }
    } catch (error) {
      console.error('Error deleting questionnaire:', error);
      alert('Error deleting questionnaire');
    }
  };

  const handleNew = () => {
    if (confirm('This will clear all current data. Are you sure?')) {
      // Clear localStorage
      const keysToRemove = [
        'questionnaire_timer_state',
        'customBackground',
        'stage_1_question',
        'stage_1_code',
        'mcq_stage_2_prompt'
      ];
      
      const optionKeys = Object.keys(localStorage).filter(key => key.startsWith('mcq_stage_2_opt_'));
      keysToRemove.push(...optionKeys);
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      alert('New questionnaire created! (Refresh page to see changes)');
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors"
      >
        {isSaving ? 'Saving...' : '💾 Save'}
      </button>

      {/* Load Button */}
      <button
        onClick={() => {
          setShowLoadMenu(!showLoadMenu);
          if (!showLoadMenu) {
            loadQuestionnaires();
          }
        }}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors"
      >
        {isLoading ? 'Loading...' : '📂 Load'}
      </button>

      {/* New Button */}
      <button
        onClick={handleNew}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
      >
        ✨ New
      </button>

      {/* Load Menu */}
      {showLoadMenu && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-10 min-w-64">
          <div className="p-2">
            <h3 className="font-semibold mb-2">Saved Questionnaires</h3>
            {questionnaires.length === 0 ? (
              <p className="text-gray-500 text-sm">No saved questionnaires found</p>
            ) : (
              <div className="space-y-1">
                {questionnaires.map((questionnaire) => (
                  <div key={questionnaire.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{questionnaire.title}</div>
                      <div className="text-xs text-gray-500">
                        {questionnaire.updatedAt 
                          ? new Date(questionnaire.updatedAt).toLocaleDateString()
                          : 'Unknown date'
                        }
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleLoad(questionnaire)}
                        className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => questionnaire.id && handleDelete(questionnaire.id)}
                        className="text-red-600 hover:text-red-800 text-xs px-2 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
