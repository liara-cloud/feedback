import { Request } from "express";
import { AnyZodObject } from "zod";
import { z } from "zod";

export async function zBodyParse<T extends AnyZodObject>(schema: T, req: Request): Promise<z.infer<T>> {
  return await schema.parseAsync(req.body);
}