'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized feedback reports for student essays.
 *
 * The flow takes an essay as input and returns a feedback report identifying strengths and weaknesses,
 * along with specific suggestions for improvement.
 *
 * @exports automatedFeedbackGeneration - The main function to trigger the feedback generation flow.
 * @exports AutomatedFeedbackInput - The input type for the automatedFeedbackGeneration function.
 * @exports AutomatedFeedbackOutput - The output type for the automatedFeedbackGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedFeedbackInputSchema = z.object({
  essay: z.string().describe('The essay to be evaluated.'),
  gradeLevel: z.string().describe('The grade level of the essay.'),
  topic: z.string().describe('The topic of the essay.'),
});
export type AutomatedFeedbackInput = z.infer<typeof AutomatedFeedbackInputSchema>;

const AutomatedFeedbackOutputSchema = z.object({
  strengths: z.string().describe('Identified strengths in the essay.'),
  weaknesses: z.string().describe('Identified weaknesses in the essay.'),
  suggestions: z.string().describe('Specific suggestions for improving the essay.'),
});
export type AutomatedFeedbackOutput = z.infer<typeof AutomatedFeedbackOutputSchema>;

export async function automatedFeedbackGeneration(input: AutomatedFeedbackInput): Promise<AutomatedFeedbackOutput> {
  return automatedFeedbackFlow(input);
}

const automatedFeedbackPrompt = ai.definePrompt({
  name: 'automatedFeedbackPrompt',
  input: {schema: AutomatedFeedbackInputSchema},
  output: {schema: AutomatedFeedbackOutputSchema},
  prompt: `You are an AI-powered essay grading system that provides personalized feedback to students.

  Analyze the following essay and provide feedback on its strengths, weaknesses, and suggestions for improvement.

  Essay Grade Level: {{{gradeLevel}}}
  Essay Topic: {{{topic}}}
  Essay Text: {{{essay}}}

  Strengths:
  - Identify the key strengths of the essay, focusing on aspects like clarity, organization, argumentation, and use of evidence.

  Weaknesses:
  - Identify the main weaknesses of the essay, such as areas where the argumentation is weak, the organization is unclear, or the evidence is insufficient.

  Suggestions:
  - Provide specific, actionable suggestions for improving the essay, focusing on how the student can address the identified weaknesses and build on their strengths.`,
});

const automatedFeedbackFlow = ai.defineFlow(
  {
    name: 'automatedFeedbackFlow',
    inputSchema: AutomatedFeedbackInputSchema,
    outputSchema: AutomatedFeedbackOutputSchema,
  },
  async input => {
    const {output} = await automatedFeedbackPrompt(input);
    return output!;
  }
);
