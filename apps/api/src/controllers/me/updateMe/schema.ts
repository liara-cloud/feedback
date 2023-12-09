import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().optional(),
  color: z.string().startsWith("#").min(4).max(7).optional(),
});