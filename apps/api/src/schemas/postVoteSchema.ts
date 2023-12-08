import { z } from "zod";

export const postVoteSchema = z.object({
  feedbackId: z.string(),
});