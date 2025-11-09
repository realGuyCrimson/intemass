'use server';

import { z } from 'zod';
import {
  aiPoweredEssayScoring,
  type AiPoweredEssayScoringOutput,
} from '@/ai/flows/ai-powered-essay-scoring';
import {
  automatedFeedbackGeneration,
  type AutomatedFeedbackOutput,
} from '@/ai/flows/automated-feedback-generation';
import {
  analyzeDiagram,
  type AnalyzeDiagramOutput,
} from '@/ai/flows/canvas-diagram-analysis';

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

export async function scoreEssayAction(
  prevState: EssayScoringState,
  formData: FormData
): Promise<EssayScoringState> {
  const validatedFields = essayScoringSchema.safeParse({
    essayText: formData.get('essayText'),
    markScheme: formData.get('markScheme'),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const message = errors.essayText?.[0] || errors.markScheme?.[0] || 'Invalid input.';
    return {
      status: 'error',
      message,
    };
  }

  try {
    const result = await aiPoweredEssayScoring(validatedFields.data);
    return {
      status: 'success',
      message: 'Essay scored successfully.',
      data: result,
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'An unknown error occurred while scoring.',
    };
  }
}

export type FeedbackState = {
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
    data?: AutomatedFeedbackOutput;
};

export async function generateFeedbackAction(
  prevState: FeedbackState,
  formData: FormData
): Promise<FeedbackState> {
    const validatedFields = feedbackSchema.safeParse({
        essay: formData.get('essay'),
        gradeLevel: formData.get('gradeLevel'),
        topic: formData.get('topic'),
    });

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        const message = errors.essay?.[0] || errors.gradeLevel?.[0] || errors.topic?.[0] || 'Invalid input.';
        return {
            status: 'error',
            message,
        };
    }

    try {
        const result = await automatedFeedbackGeneration(validatedFields.data);
        return {
            status: 'success',
            message: 'Feedback generated successfully.',
            data: result,
        };
    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'An unknown error occurred during feedback generation.',
        };
    }
}


export type DiagramState = {
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
    data?: AnalyzeDiagramOutput;
};

export async function analyzeDiagramAction(
  prevState: DiagramState,
  formData: FormData
): Promise<DiagramState> {
    const validatedFields = diagramSchema.safeParse({
        diagramDataUri: formData.get('diagramDataUri'),
        expectedComponents: formData.get('expectedComponents'),
    });

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        const message = errors.diagramDataUri?.[0] || errors.expectedComponents?.[0] || 'Invalid input.';
        return {
            status: 'error',
            message,
        };
    }

    try {
        const result = await analyzeDiagram(validatedFields.data);
        return {
            status: 'success',
            message: 'Diagram analyzed successfully.',
            data: result,
        };
    } catch (error) {
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'An unknown error occurred during diagram analysis.',
        };
    }
}