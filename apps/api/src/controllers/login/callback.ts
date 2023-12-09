import { Request, Response } from "express";
import { assertUserExists } from "../../utils/assertUserExists";
import jsonwebtoken from "jsonwebtoken";
import { EnvVars } from "../../utils/EnvVars";

export const loginCallback = async (req: Request, res: Response) => {
  assertUserExists(req);
  const id = req.user.id;
  return res.json(jsonwebtoken.sign({ id }, EnvVars.JWT_SECRET));
}