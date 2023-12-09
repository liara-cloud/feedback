import { z } from "zod";

export const getFeedbacksSchema = z.object({
  page: z.number().min(1).default(1)
});