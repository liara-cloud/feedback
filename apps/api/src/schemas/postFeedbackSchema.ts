import { z } from "zod";

export const postFeedbackSchema = z.object({
  title: z.string(),
  description: z.string()
});