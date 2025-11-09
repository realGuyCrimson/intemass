'use server';

import { aiPoweredEssayScoring } from '@/ai/flows/ai-powered-essay-scoring';
import { automatedFeedbackGeneration } from '@/ai/flows/automated-feedback-generation';
import { analyzeDiagram } from '@/ai/flows/canvas-diagram-analysis';
import { ocrFromImage } from '@/ai/flows/ocr-flow';
import {
  diagramSchema,
  essayScoringSchema,
  feedbackSchema,
  ocrSchema,
  type DiagramState,
  type EssayScoringState,
  type FeedbackState,
  type OcrState,
} from './schemas';

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
    const message =
      errors.essayText?.[0] ||
      errors.markScheme?.[0] ||
      'Invalid input.';
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
      message:
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while scoring.',
    };
  }
}

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
    const message =
      errors.essay?.[0] ||
      errors.gradeLevel?.[0] ||
      errors.topic?.[0] ||
      'Invalid input.';
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
      message:
        error instanceof Error
          ? error.message
          : 'An unknown error occurred during feedback generation.',
    };
  }
}

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
    const message =
      errors.diagramDataUri?.[0] ||
      errors.expectedComponents?.[0] ||
      'Invalid input.';
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
      message:
        error instanceof Error
          ? error.message
          : 'An unknown error occurred during diagram analysis.',
    };
  }
}

export async function ocrAction(
  prevState: OcrState,
  formData: FormData
): Promise<OcrState> {
  const validatedFields = ocrSchema.safeParse({
    imageDataUri: formData.get('imageDataUri'),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const message = errors.imageDataUri?.[0] || 'Invalid input.';
    return {
      status: 'error',
      message,
    };
  }

  try {
    const result = await ocrFromImage(validatedFields.data);
    return {
      status: 'success',
      message: 'Text extracted successfully.',
      data: result,
    };
  } catch (error) {
    return {
      status: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'An unknown error occurred during OCR processing.',
    };
  }
}
