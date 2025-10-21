# Questionnaire API Integration Guide

## Overview
I've created a complete API integration for your questionnaire builder application. Here's what was implemented:

## Files Created/Modified

### 1. **API Backend** (`api/app/api/questionnaires/route.tsx`)
- Complete CRUD API for questionnaires
- Matches your frontend `QuestionnaireData` interface
- Proper error handling and validation
- CORS configuration for frontend integration

### 2. **Database Schema** (`api/prisma/schema.prisma`)
- Updated to match your questionnaire structure
- `Questionnaire` model with all your fields
- `Option` model for multiple choice questions
- Proper relationships and constraints

### 3. **Frontend API Helper** (`app/lib/questionnaireApi.ts`)
- Easy-to-use API functions
- `QuestionnaireApiStorage` class for seamless integration
- Automatic fallback to localStorage if API fails
- TypeScript interfaces matching your data

### 4. **Enhanced Component** (`app/Components/QuestionnaireSaveLoadApi.tsx`)
- Drop-in replacement for your existing save/load component
- Shows list of saved questionnaires
- Delete functionality
- Better error handling

## How to Use

### 1. **Update Your Database**
```bash
cd api
npx prisma db push
```

### 2. **Replace Your Save/Load Component**
In your questionnaire page, replace:
```tsx
import QuestionnaireSaveLoad from './Components/QuestionnaireSaveLoad';
```
with:
```tsx
import QuestionnaireSaveLoadApi from './Components/QuestionnaireSaveLoadApi';
```

### 3. **Use the API Helper Directly**
```tsx
import { questionnaireApi } from '../lib/questionnaireApi';

// Save a questionnaire
const saved = await questionnaireApi.save(questionnaireData);

// Load all questionnaires
const questionnaires = await questionnaireApi.getAll();

// Load specific questionnaire
const questionnaire = await questionnaireApi.getById('some-id');
```

## API Endpoints

- `GET /api/questionnaires` - Get all questionnaires
- `GET /api/questionnaires?id=uuid` - Get specific questionnaire
- `POST /api/questionnaires` - Create new questionnaire
- `PATCH /api/questionnaires?id=uuid` - Update questionnaire
- `DELETE /api/questionnaires?id=uuid` - Delete questionnaire

## Features

✅ **Complete CRUD operations**
✅ **Input validation**
✅ **Error handling**
✅ **CORS configuration**
✅ **TypeScript support**
✅ **localStorage fallback**
✅ **Request logging**
✅ **Consistent API responses**

## Testing

1. Start your services: `docker-compose up --build`
2. Frontend: http://localhost:80
3. API: http://localhost:4080
4. Test the save/load functionality in your questionnaire builder

## Next Steps

1. Run `npx prisma db push` to update your database
2. Replace the save/load component in your questionnaire page
3. Test the integration
4. Customize the API as needed for your specific requirements

The API is designed to be a drop-in replacement for your localStorage-based system while providing persistent storage and better data management.
