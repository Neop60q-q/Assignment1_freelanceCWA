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
        where: { id: parseInt(id) }, // assumes id is number
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
    const { timer, question, expectedAnswers } = await request.json();

    if (!timer || !question || !expectedAnswers) {
      return new NextResponse('Missing timer, question or expectedAnswers', { status: 400, headers: corsHeaders });
    }

    const newQuestionnaire = await prisma.questionnaire.create({
      data: { timer, question, expectedAnswers },
    });

    return NextResponse.json(newQuestionnaire, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request body', { status: 400, headers: corsHeaders });
  }
}

// PATCH – Update questionnaire by ID (?id=number)
export async function PATCH(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return new NextResponse('Missing id', { status: 400, headers: corsHeaders });
    }

    const { timer, question, expectedAnswers } = await request.json();

    const updatedQuestionnaire = await prisma.questionnaire.update({
      where: { id: parseInt(id) },
      data: {
        ...(timer !== undefined && { timer }),
        ...(question !== undefined && { question }),
        ...(expectedAnswers !== undefined && { expectedAnswers }),
      },
    });

    return NextResponse.json(updatedQuestionnaire, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request', { status: 400, headers: corsHeaders });
  }
}

// DELETE – Delete questionnaire by ID (?id=number)
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return new NextResponse('Missing id', { status: 400, headers: corsHeaders });
    }

    await prisma.questionnaire.delete({
      where: { id: parseInt(id) },
    });

    return new NextResponse(null, { status: 204, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request', { status: 400, headers: corsHeaders });
  }
}