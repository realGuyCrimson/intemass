'use server';
/**
 * @fileOverview This file defines the AI-powered essay scoring flow for the INTEMASS system.
 *
 * The flow uses advanced transformer models to semantically analyze essays, considering context,
 * coherence, and argumentation quality.
 *
 * @exported
 * - `aiPoweredEssayScoring`: The main function to trigger the essay scoring flow.
 * - `AiPoweredEssayScoringInput`: The input type for the `aiPoweredEssayScoring` function.
 * - `AiPoweredEssayScoringOutput`: The output type for the `aiPoweredEssayScoring` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPoweredEssayScoringInputSchema = z.object({
  essayText: z.string().describe('The text of the essay to be scored.'),
  markScheme: z.string().describe('The mark scheme to be used for scoring the essay.'),
});
export type AiPoweredEssayScoringInput = z.infer<typeof AiPoweredEssayScoringInputSchema>;

const AiPoweredEssayScoringOutputSchema = z.object({
  score: z.number().describe('The overall score of the essay.'),
  feedback: z.string().describe('Detailed feedback on the essay.'),
  strengths: z.string().describe('Strengths of the essay.'),
  weaknesses: z.string().describe('Weaknesses of the essay.'),
});
export type AiPoweredEssayScoringOutput = z.infer<typeof AiPoweredEssayScoringOutputSchema>;

export async function aiPoweredEssayScoring(input: AiPoweredEssayScoringInput): Promise<AiPoweredEssayScoringOutput> {
  return aiPoweredEssayScoringFlow(input);
}

const aiPoweredEssayScoringPrompt = ai.definePrompt({
  name: 'aiPoweredEssayScoringPrompt',
  input: {schema: AiPoweredEssayScoringInputSchema},
  output: {schema: AiPoweredEssayScoringOutputSchema},
  prompt: `You are an AI essay grading assistant. You will be provided an essay and a mark scheme. 
Your job is to provide a score, detailed feedback, strengths, and weaknesses based on the essay.

Essay:
{{essayText}}

Mark Scheme:
{{markScheme}}`,
});

const aiPoweredEssayScoringFlow = ai.defineFlow(
  {
    name: 'aiPoweredEssayScoringFlow',
    inputSchema: AiPoweredEssayScoringInputSchema,
    outputSchema: AiPoweredEssayScoringOutputSchema,
  },
  async input => {
    const {output} = await aiPoweredEssayScoringPrompt(input);
    return output!;
  }
);
