'use server';

/**
 * @fileOverview This file defines the Genkit flow for performing Optical Character Recognition (OCR) on an image or PDF.
 *
 * It takes a file data URI and returns the extracted text.
 *
 * @exports ocrFromFile - The main function to trigger the OCR flow.
 * @exports OcrFromFileInput - The input type for the ocrFromFile function.
 * @exports OcrFromFileOutput - The output type for the ocrFromFile function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const OcrFromFileInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A document (image or PDF), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type OcrFromFileInput = z.infer<typeof OcrFromFileInputSchema>;

const OcrFromFileOutputSchema = z.object({
  extractedText: z.string().describe('The text extracted from the file.'),
});
export type OcrFromFileOutput = z.infer<typeof OcrFromFileOutputSchema>;

export async function ocrFromFile(
  input: OcrFromFileInput
): Promise<OcrFromFileOutput> {
  return ocrFlow(input);
}

const ocrPrompt = ai.definePrompt({
  name: 'ocrPrompt',
  input: { schema: OcrFromFileInputSchema },
  output: { schema: OcrFromFileOutputSchema },
  prompt: `You are an Optical Character Recognition (OCR) specialist. Your task is to extract all the text from the following document.
  Preserve the original formatting, including paragraphs and line breaks, as accurately as possible.

  File: {{media url=fileDataUri}}`,
});

const ocrFlow = ai.defineFlow(
  {
    name: 'ocrFlow',
    inputSchema: OcrFromFileInputSchema,
    outputSchema: OcrFromFileOutputSchema,
  },
  async (input) => {
    const { output } = await ocrPrompt(input);
    return output!;
  }
);
