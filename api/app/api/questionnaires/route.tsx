// api/app/api/questionnaires/route.tsx - Questionnaire CRUD API for frontend integration

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// CORS headers for frontend integration
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'http://localhost:80' 
    : '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// TypeScript interfaces matching your frontend
interface QuestionnaireData {
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

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

// Helper function for consistent API responses
function createResponse<T>(
  data?: T, 
  error?: string, 
  message?: string, 
  status: number = 200
): NextResponse {
  const response: ApiResponse<T> = {
    success: !error,
    timestamp: new Date().toISOString(),
    ...(data && { data }),
    ...(error && { error }),
    ...(message && { message }),
  };

  return NextResponse.json(response, { 
    status, 
    headers: corsHeaders 
  });
}

// Input validation
function validateQuestionnaireData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }
  
  if (data.timer) {
    if (typeof data.timer.count !== 'number' || data.timer.count < 0) {
      errors.push('Timer count must be a non-negative number');
    }
    if (typeof data.timer.isPaused !== 'boolean') {
      errors.push('Timer isPaused must be a boolean');
    }
  }
  
  if (data.challenge1) {
    if (!data.challenge1.question || typeof data.challenge1.question !== 'string') {
      errors.push('Challenge 1 question is required');
    }
    if (typeof data.challenge1.code !== 'string') {
      errors.push('Challenge 1 code must be a string');
    }
  }
  
  if (data.challenge2) {
    if (!data.challenge2.prompt || typeof data.challenge2.prompt !== 'string') {
      errors.push('Challenge 2 prompt is required');
    }
    if (!Array.isArray(data.challenge2.options)) {
      errors.push('Challenge 2 options must be an array');
    } else {
      data.challenge2.options.forEach((option: any, index: number) => {
        if (!option.text || typeof option.text !== 'string') {
          errors.push(`Option ${index + 1} text is required`);
        }
        if (typeof option.isCorrect !== 'boolean') {
          errors.push(`Option ${index + 1} isCorrect must be a boolean`);
        }
      });
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

// Transform database model to frontend format
function transformToFrontendFormat(dbQuestionnaire: any): QuestionnaireData {
  return {
    id: dbQuestionnaire.id,
    title: dbQuestionnaire.title,
    timer: {
      count: dbQuestionnaire.timerCount,
      isPaused: dbQuestionnaire.timerPaused,
    },
    background: dbQuestionnaire.background,
    challenge1: {
      question: dbQuestionnaire.challenge1Question,
      code: dbQuestionnaire.challenge1Code,
    },
    challenge2: {
      prompt: dbQuestionnaire.challenge2Prompt,
      options: dbQuestionnaire.options.map((option: any) => ({
        id: option.id,
        text: option.text,
        isCorrect: option.isCorrect,
      })),
    },
    createdAt: dbQuestionnaire.createdAt,
    updatedAt: dbQuestionnaire.updatedAt,
  };
}

// OPTIONS - CORS preflight
export async function OPTIONS(request: NextRequest) {
  console.log(`[${new Date().toISOString()}] OPTIONS ${request.url}`);
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET - Get all questionnaires or one by ID
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    
    if (id) {
      // Get single questionnaire
      const questionnaire = await prisma.questionnaire.findUnique({
        where: { id },
        include: { options: true },
      });

      if (!questionnaire) {
        return createResponse(null, 'Questionnaire not found', undefined, 404);
      }

      return createResponse(transformToFrontendFormat(questionnaire));
    }

    // Get all questionnaires
    const questionnaires = await prisma.questionnaire.findMany({
      include: { options: true },
      orderBy: { updatedAt: 'desc' },
    });

    const transformedQuestionnaires = questionnaires.map(transformToFrontendFormat);
    return createResponse(transformedQuestionnaires);

  } catch (error) {
    console.error('GET /api/questionnaires error:', error);
    return createResponse(null, 'Internal server error', undefined, 500);
  }
}

// POST - Create new questionnaire
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateQuestionnaireData(body);
    
    if (!validation.isValid) {
      return createResponse(null, validation.errors.join(', '), undefined, 400);
    }

    const { title, timer, background, challenge1, challenge2 } = body;

    const questionnaire = await prisma.questionnaire.create({
      data: {
        title: title.trim(),
        timerCount: timer?.count || 60,
        timerPaused: timer?.isPaused ?? true,
        background,
        challenge1Question: challenge1.question,
        challenge1Code: challenge1.code,
        challenge2Prompt: challenge2.prompt,
        options: {
          create: challenge2.options.map((option: any, index: number) => ({
            text: option.text,
            isCorrect: option.isCorrect,
            order: index,
          })),
        },
      },
      include: { options: true },
    });

    return createResponse(
      transformToFrontendFormat(questionnaire),
      undefined,
      'Questionnaire created successfully',
      201
    );

  } catch (error) {
    console.error('POST /api/questionnaires error:', error);
    return createResponse(null, 'Failed to create questionnaire', undefined, 500);
  }
}

// PATCH - Update questionnaire by ID
export async function PATCH(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return createResponse(null, 'Missing questionnaire ID', undefined, 400);
    }

    const body = await request.json();
    const validation = validateQuestionnaireData(body);
    
    if (!validation.isValid) {
      return createResponse(null, validation.errors.join(', '), undefined, 400);
    }

    const { title, timer, background, challenge1, challenge2 } = body;

    // First, delete existing options
    await prisma.option.deleteMany({
      where: { questionnaireId: id },
    });

    // Update questionnaire and recreate options
    const questionnaire = await prisma.questionnaire.update({
      where: { id },
      data: {
        title: title.trim(),
        timerCount: timer?.count || 60,
        timerPaused: timer?.isPaused ?? true,
        background,
        challenge1Question: challenge1.question,
        challenge1Code: challenge1.code,
        challenge2Prompt: challenge2.prompt,
        options: {
          create: challenge2.options.map((option: any, index: number) => ({
            text: option.text,
            isCorrect: option.isCorrect,
            order: index,
          })),
        },
      },
      include: { options: true },
    });

    return createResponse(
      transformToFrontendFormat(questionnaire),
      undefined,
      'Questionnaire updated successfully'
    );

  } catch (error) {
    console.error('PATCH /api/questionnaires error:', error);
    return createResponse(null, 'Failed to update questionnaire', undefined, 500);
  }
}

// DELETE - Delete questionnaire by ID
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return createResponse(null, 'Missing questionnaire ID', undefined, 400);
    }

    await prisma.questionnaire.delete({
      where: { id },
    });

    return createResponse(
      null,
      undefined,
      'Questionnaire deleted successfully',
      204
    );

  } catch (error) {
    console.error('DELETE /api/questionnaires error:', error);
    return createResponse(null, 'Failed to delete questionnaire', undefined, 500);
  }
}
