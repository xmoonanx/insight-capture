import { z } from 'zod';

export enum Theme {
  MINIMA = 'minima',
  CHIRPY = 'chirpy',
  MINIMAL_MISTAKES = 'minimal-mistakes',
  GENERIC = 'generic',
}

export enum PostPattern {
  PROBLEM_SOLUTION = 'problem-solution',
  LEARNING_NOTE = 'learning-note',
  TUTORIAL = 'tutorial',
  TIPS = 'tips',
}

export const InsightSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  pattern: z.nativeEnum(PostPattern),
  summary: z.string().min(1),
  body: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  categories: z.array(z.string().min(1)).default([]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lang: z.enum(['ko', 'en']).default('ko'),
  slugSuggestion: z.string().optional(),
});

export type Insight = z.infer<typeof InsightSchema>;
