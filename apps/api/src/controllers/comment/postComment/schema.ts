import { z } from "zod";

export const postCommentSchema = z.object({
  feedbackId: z.string().uuid(),
  content: z.string().min(30).max(1000)
});