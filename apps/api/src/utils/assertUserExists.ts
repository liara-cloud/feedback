import { Request } from "express";

export function assertUserExists(req: Request): asserts req is Request & { user: { id: string } } {
  if (!req.user) {
    throw "user is not defined"
  }
}