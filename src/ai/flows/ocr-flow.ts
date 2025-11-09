'use server';

/**
 * @fileOverview This file defines the Genkit flow for performing Optical Character Recognition (OCR) on an image.
 *
 * It takes an image data URI and returns the extracted text.
 *
 * @exports ocrFromImage - The main function to trigger the OCR flow.
 * @exports OcrFromImageInput - The input type for the ocrFromImage function.
 * @exports OcrFromImageOutput - The output type for the ocrFromImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OcrFromImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image of a document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type OcrFromImageInput = z.infer<typeof OcrFromImageInputSchema>;

const OcrFromImageOutputSchema = z.object({
  extractedText: z.string().describe('The text extracted from the image.'),
});
export type OcrFromImageOutput = z.infer<typeof OcrFromImageOutputSchema>;

export async function ocrFromImage(
  input: OcrFromImageInput
): Promise<OcrFromImageOutput> {
  return ocrFlow(input);
}

const ocrPrompt = ai.definePrompt({
  name: 'ocrPrompt',
  input: { schema: OcrFromImageInputSchema },
  output: { schema: OcrFromImageOutputSchema },
  prompt: `You are an Optical Character Recognition (OCR) specialist. Your task is to extract all the text from the following image.
  Preserve the original formatting, including paragraphs and line breaks, as accurately as possible.

  Image: {{media url=imageDataUri}}`,
});

const ocrFlow = ai.defineFlow(
  {
    name: 'ocrFlow',
    inputSchema: OcrFromImageInputSchema,
    outputSchema: OcrFromImageOutputSchema,
  },
  async (input) => {
    const { output } = await ocrPrompt(input);
    return output!;
  }
);
