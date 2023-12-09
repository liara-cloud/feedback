import { z } from "zod";

export const deleteVoteSchema = z.object({
  feedbackId: z.string().uuid(),
});