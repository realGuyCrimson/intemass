import { z } from 'zod';
import type { AiPoweredEssayScoringOutput } from '@/ai/flows/ai-powered-essay-scoring';
import type { AutomatedFeedbackOutput } from '@/ai/flows/automated-feedback-generation';
import type { AnalyzeDiagramOutput } from '@/ai/flows/canvas-diagram-analysis';

export const essayScoringSchema = z.object({
  essayText: z.string().min(50, 'Essay text must be at least 50 characters.'),
  markScheme: z.string().min(10, 'Mark scheme must be at least 10 characters.'),
});

export const feedbackSchema = z.object({
  essay: z.string().min(50, 'Essay text must be at least 50 characters.'),
  gradeLevel: z.string().min(1, 'Grade level is required.'),
  topic: z.string().min(3, 'Topic is required.'),
});

export const diagramSchema = z.object({
  diagramDataUri: z.string().startsWith('data:image', 'Invalid image data. Please upload a valid image.'),
  expectedComponents: z.string().min(3, 'Expected components are required.'),
});

// Schema for Step 1 of the Create Question form
export const createQuestionStep1Schema = z.object({
    title: z.string().min(10, 'Question title must be at least 10 characters.'),
    subject: z.string().min(1, 'Please select a subject.'),
    curriculum: z.string().min(1, 'Please select a curriculum.'),
    maxPoints: z.coerce.number().min(1, 'Max points must be at least 1.').max(100, 'Max points cannot exceed 100.'),
    questionText: z.string().min(20, 'Full question text must be at least 20 characters.'),
});

export type CreateQuestionStep1 = z.infer<typeof createQuestionStep1Schema>;

export type EssayScoringState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  data?: AiPoweredEssayScoringOutput;
};

export type FeedbackState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  data?: AutomatedFeedbackOutput;
};

export type DiagramState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  data?: AnalyzeDiagramOutput;
};
