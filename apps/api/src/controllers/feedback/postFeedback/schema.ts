import { z } from "zod";

export const postFeedbackSchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().min(30).max(1000)
});