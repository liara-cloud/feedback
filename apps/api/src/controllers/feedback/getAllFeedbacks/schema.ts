import { z } from "zod";

export const getAllFeedbacksSchema = z.object({
  page: z.number().min(1).default(1)
});