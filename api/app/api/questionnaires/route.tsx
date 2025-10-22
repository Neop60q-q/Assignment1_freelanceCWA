// api/app/api/questionnaires/route.tsx - Questionnaire CRUD API for frontend integration


//This code is a Next.js API route handler that defines a RESTful API for managing user data in a database using Prisma as the ORM (Object-Relational Mapping) tool. 
// It handles HTTP requests (GET, POST, PATCH, DELETE, and OPTIONS) for a /api/questionaires endpoint and includes CORS (Cross-Origin Resource Sharing) support to allow requests from any origin

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ✅ Import only

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// OPTIONS – CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Questionnaire model variables:
// id: number;
// timer: number;
// question: string;
// expectedAnswers: string;

// GET – Get all questionnaires or one by ID (?id=uuid)
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (id) {
      const questionnaire = await prisma.questionnaire.findUnique({
        where: { id }, // UUID string
      });

      if (!questionnaire) {
        return new NextResponse('Questionnaire not found', { status: 404, headers: corsHeaders });
      }

      return NextResponse.json(questionnaire, { headers: corsHeaders });
    }

    const questionnaires = await prisma.questionnaire.findMany();
    return NextResponse.json(questionnaires, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}

// POST – Create new questionnaire
export async function POST(request: NextRequest) {
  try {
    const { timer, question, expectedAnswer } = await request.json();

    if (!timer || !question || !expectedAnswer) {
      return new NextResponse('Missing timer, question or expectedAnswer', { status: 400, headers: corsHeaders });
    }    const newQuestionnaire = await prisma.questionnaire.create({
      data: { 
        title: question, // Map your 'question' to 'title'
        timerCount: parseInt(timer), // Map your 'timer' to 'timerCount'
        challenge1Question: expectedAnswer, // Map your 'expectedAnswer' to 'challenge1Question' 
        challenge1Code: "// Default code", // Required field, provide default
        challenge2Prompt: "Default prompt" // Required field, provide default
      },
    });

    return NextResponse.json(newQuestionnaire, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request body', { status: 400, headers: corsHeaders });
  }
}

// PATCH – Update questionnaire by ID (?id=uuid)
export async function PATCH(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return new NextResponse('Missing id', { status: 400, headers: corsHeaders });
    }

    const { timer, question, expectedAnswer } = await request.json();

    const updatedQuestionnaire = await prisma.questionnaire.update({
      where: { id }, // UUID string
      data: {
        ...(timer !== undefined && { timerCount: parseInt(timer) }),
        ...(question !== undefined && { title: question }),
        ...(expectedAnswer !== undefined && { challenge1Question: expectedAnswer }),
      },
    });

    return NextResponse.json(updatedQuestionnaire, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request', { status: 400, headers: corsHeaders });
  }
}

// DELETE – Delete questionnaire by ID (?id=uuid)
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return new NextResponse('Missing id', { status: 400, headers: corsHeaders });
    }

    await prisma.questionnaire.delete({
      where: { id }, // UUID string
    });

    return new NextResponse(null, { status: 204, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request', { status: 400, headers: corsHeaders });
  }
}