// app/lib/questionnaireApi.ts - Frontend API helper for questionnaire integration

import { QuestionnaireData } from './questionnaireStorage';

// API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4080'
  : 'http://localhost:4080';

// API response interface
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

// Helper function to make API calls
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/questionnaires${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

// API functions for questionnaire management
export const questionnaireApi = {
  // Get all questionnaires
  async getAll(): Promise<QuestionnaireData[]> {
    const response = await apiCall<QuestionnaireData[]>('');
    return response.success ? response.data || [] : [];
  },

  // Get single questionnaire by ID
  async getById(id: string): Promise<QuestionnaireData | null> {
    const response = await apiCall<QuestionnaireData>(`?id=${id}`);
    return response.success ? response.data || null : null;
  },

  // Create new questionnaire
  async create(questionnaire: Omit<QuestionnaireData, 'id' | 'createdAt' | 'updatedAt'>): Promise<QuestionnaireData | null> {
    const response = await apiCall<QuestionnaireData>('', {
      method: 'POST',
      body: JSON.stringify(questionnaire),
    });
    return response.success ? response.data || null : null;
  },

  // Update existing questionnaire
  async update(id: string, questionnaire: Omit<QuestionnaireData, 'id' | 'createdAt' | 'updatedAt'>): Promise<QuestionnaireData | null> {
    const response = await apiCall<QuestionnaireData>(`?id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify(questionnaire),
    });
    return response.success ? response.data || null : null;
  },

  // Delete questionnaire
  async delete(id: string): Promise<boolean> {
    const response = await apiCall(`?id=${id}`, {
      method: 'DELETE',
    });
    return response.success;
  },

  // Save questionnaire (create or update)
  async save(questionnaire: QuestionnaireData): Promise<QuestionnaireData | null> {
    if (questionnaire.id) {
      // Update existing
      return this.update(questionnaire.id, questionnaire);
    } else {
      // Create new
      return this.create(questionnaire);
    }
  },
};

// Enhanced questionnaire storage that integrates with API
export class QuestionnaireApiStorage {
  // Save to both localStorage and API
  static async save(questionnaire: QuestionnaireData): Promise<QuestionnaireData | null> {
    try {
      // Save to API
      const savedQuestionnaire = await questionnaireApi.save(questionnaire);
      
      if (savedQuestionnaire) {
        // Also save to localStorage as backup
        localStorage.setItem('lastSavedQuestionnaire', JSON.stringify(savedQuestionnaire));
        return savedQuestionnaire;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to save questionnaire:', error);
      // Fallback to localStorage only
      localStorage.setItem('lastSavedQuestionnaire', JSON.stringify(questionnaire));
      return questionnaire;
    }
  }

  // Load from API or fallback to localStorage
  static async load(id?: string): Promise<QuestionnaireData | null> {
    try {
      if (id) {
        // Load specific questionnaire from API
        return await questionnaireApi.getById(id);
      } else {
        // Try to load from localStorage first
        const localData = localStorage.getItem('lastSavedQuestionnaire');
        if (localData) {
          return JSON.parse(localData);
        }
        
        // If no local data, get the most recent from API
        const questionnaires = await questionnaireApi.getAll();
        return questionnaires.length > 0 ? questionnaires[0] : null;
      }
    } catch (error) {
      console.error('Failed to load questionnaire:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem('lastSavedQuestionnaire');
      return localData ? JSON.parse(localData) : null;
    }
  }

  // Get all questionnaires from API
  static async getAll(): Promise<QuestionnaireData[]> {
    try {
      return await questionnaireApi.getAll();
    } catch (error) {
      console.error('Failed to load questionnaires:', error);
      return [];
    }
  }

  // Delete questionnaire
  static async delete(id: string): Promise<boolean> {
    try {
      const success = await questionnaireApi.delete(id);
      if (success) {
        // Clear localStorage if this was the last saved questionnaire
        const localData = localStorage.getItem('lastSavedQuestionnaire');
        if (localData) {
          const localQuestionnaire = JSON.parse(localData);
          if (localQuestionnaire.id === id) {
            localStorage.removeItem('lastSavedQuestionnaire');
          }
        }
      }
      return success;
    } catch (error) {
      console.error('Failed to delete questionnaire:', error);
      return false;
    }
  }
}

// Export the API for direct use
export default questionnaireApi;
