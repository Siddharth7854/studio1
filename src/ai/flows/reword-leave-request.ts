// src/ai/flows/reword-leave-request.ts
'use server';

/**
 * @fileOverview Rewords a leave request to be more clear and professional.
 *
 * - rewordLeaveRequest - A function that handles the rewording of a leave request.
 * - RewordLeaveRequestInput - The input type for the rewordLeaveRequest function.
 * - RewordLeaveRequestOutput - The return type for the rewordLeaveRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewordLeaveRequestInputSchema = z.object({
  leaveRequest: z
    .string()
    .describe('The leave request to be reworded for clarity and professionalism.'),
});
export type RewordLeaveRequestInput = z.infer<typeof RewordLeaveRequestInputSchema>;

const RewordLeaveRequestOutputSchema = z.object({
  rewordedRequest: z
    .string()
    .describe('The reworded leave request that is more clear and professional.'),
});
export type RewordLeaveRequestOutput = z.infer<typeof RewordLeaveRequestOutputSchema>;

export async function rewordLeaveRequest(input: RewordLeaveRequestInput): Promise<RewordLeaveRequestOutput> {
  return rewordLeaveRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rewordLeaveRequestPrompt',
  input: {schema: RewordLeaveRequestInputSchema},
  output: {schema: RewordLeaveRequestOutputSchema},
  prompt: `You are an AI assistant specializing in refining leave requests.

  Please reword the following leave request to be more clear, concise, and professional. Ensure that the reworded request maintains the original intent while improving its overall quality.

  Leave Request: {{{leaveRequest}}}`,
});

const rewordLeaveRequestFlow = ai.defineFlow(
  {
    name: 'rewordLeaveRequestFlow',
    inputSchema: RewordLeaveRequestInputSchema,
    outputSchema: RewordLeaveRequestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
