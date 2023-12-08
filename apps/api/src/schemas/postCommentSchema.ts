import { z } from "zod";

export const postCommentSchema = z.object({
  feedbackId: z.string(),
  content: z.string()
});