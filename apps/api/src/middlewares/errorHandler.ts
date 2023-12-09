import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { NullError } from "../utils/NullError";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    const firstError = err.errors[0];
    const { path, message } = firstError;
    res.status(400).json(`${path.join()}: ${message}.`);
  } else if (err instanceof NullError) {
    console.log(err)
    res.status(404).json(err.message)
  } else {
    console.log(err)
    res.status(500).json("something went wrong.");
  }
  return next();
}