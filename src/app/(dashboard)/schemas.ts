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
