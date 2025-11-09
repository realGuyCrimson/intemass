'use server';

/**
 * @fileOverview Flow for analyzing diagrams and drawings in essays using computer vision.
 *
 * - analyzeDiagram - A function that handles the diagram analysis process.
 * - AnalyzeDiagramInput - The input type for the analyzeDiagram function.
 * - AnalyzeDiagramOutput - The return type for the analyzeDiagram function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDiagramInputSchema = z.object({
  diagramDataUri: z
    .string()
    .describe(
      "A diagram or drawing in an essay, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  expectedComponents: z
    .string()
    .describe('A comma separated list of components that should be present in the diagram.'),
});
export type AnalyzeDiagramInput = z.infer<typeof AnalyzeDiagramInputSchema>;

const AnalyzeDiagramOutputSchema = z.object({
  completenessScore: z
    .number()
    .describe(
      'A score between 0 and 1 representing the completeness of the diagram compared to the expected components.'
    ),
  accuracyFeedback: z
    .string()
    .describe(
      'Feedback on the accuracy of the diagram, including any missing or incorrect components.'
    ),
});
export type AnalyzeDiagramOutput = z.infer<typeof AnalyzeDiagramOutputSchema>;

export async function analyzeDiagram(
  input: AnalyzeDiagramInput
): Promise<AnalyzeDiagramOutput> {
  return analyzeDiagramFlow(input);
}

const analyzeDiagramPrompt = ai.definePrompt({
  name: 'analyzeDiagramPrompt',
  input: {schema: AnalyzeDiagramInputSchema},
  output: {schema: AnalyzeDiagramOutputSchema},
  prompt: `You are an expert in diagram analysis. You will analyze the provided diagram and compare it to the expected components.

  Provide a completeness score between 0 and 1.  Then, provide feedback on the accuracy of the diagram, including any missing or incorrect components.

  Diagram: {{media url=diagramDataUri}}

  Expected Components: {{{expectedComponents}}} `,
});

const analyzeDiagramFlow = ai.defineFlow(
  {
    name: 'analyzeDiagramFlow',
    inputSchema: AnalyzeDiagramInputSchema,
    outputSchema: AnalyzeDiagramOutputSchema,
  },
  async input => {
    const {output} = await analyzeDiagramPrompt(input);
    return output!;
  }
);
