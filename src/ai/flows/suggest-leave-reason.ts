'use server';

/**
 * @fileOverview AI agent that suggests leave reasons based on user input.
 *
 * - suggestLeaveReason - A function that suggests leave reasons.
 * - SuggestLeaveReasonInput - The input type for the suggestLeaveReason function.
 * - SuggestLeaveReasonOutput - The return type for the suggestLeaveReason function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLeaveReasonInputSchema = z.object({
  userInput: z
    .string()
    .describe(
      'The user input describing the reason or situation for the leave request.'
    ),
});
export type SuggestLeaveReasonInput = z.infer<typeof SuggestLeaveReasonInputSchema>;

const SuggestLeaveReasonOutputSchema = z.object({
  suggestedReason: z
    .string()
    .describe('A suggested leave reason based on the user input.'),
  rewordingSuggestion: z
    .string()
    .describe(
      'A suggestion for rewording the leave request reason for clarity and completeness.'
    ),
});
export type SuggestLeaveReasonOutput = z.infer<typeof SuggestLeaveReasonOutputSchema>;

export async function suggestLeaveReason(
  input: SuggestLeaveReasonInput
): Promise<SuggestLeaveReasonOutput> {
  return suggestLeaveReasonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLeaveReasonPrompt',
  input: {schema: SuggestLeaveReasonInputSchema},
  output: {schema: SuggestLeaveReasonOutputSchema},
  prompt: `You are an AI assistant designed to help employees craft clear and complete leave requests.

  Based on the employee's initial input, provide a concise suggested reason for the leave and a reworded suggestion for clarity.

  User Input: {{{userInput}}}

  Respond with a suggested reason and a rewording suggestion, each no more than 2 sentences.
`,
});

const suggestLeaveReasonFlow = ai.defineFlow(
  {
    name: 'suggestLeaveReasonFlow',
    inputSchema: SuggestLeaveReasonInputSchema,
    outputSchema: SuggestLeaveReasonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
