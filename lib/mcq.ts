import { z } from 'zod';

export type MCQRecord = {
  id: string;
  subject: string;
  topic: string;
  subtopic: string;
  type: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: 'Very Easy' | 'Easy' | 'Medium' | 'Hard' | 'Challenge';
};

const requiredText = (label: string) => z.string().trim().min(1, `${label} is required`);

export const mcqPayloadSchema = z.object({
  subject: requiredText('Subject'),
  topic: requiredText('Topic'),
  subtopic: z.string().trim().optional().default(''),
  type: requiredText('Type'),
  question: requiredText('Question'),
  optionA: requiredText('Option A'),
  optionB: requiredText('Option B'),
  optionC: requiredText('Option C'),
  optionD: requiredText('Option D'),
  correctOption: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string().trim().optional().default(''),
  difficulty: z.enum(['Very Easy', 'Easy', 'Medium', 'Hard', 'Challenge']),
});

export type MCQPayload = z.infer<typeof mcqPayloadSchema>;
