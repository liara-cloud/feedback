import { Request, Response } from "express";
import { assertUserExists } from "../../../utils/assertUserExists";
import prisma from "../../../utils/prisma";

export const getMe = async (req: Request, res: Response) => {
  assertUserExists(req);
  return res.json(await prisma.users.findUnique({
    where: {
      id: req.user.id
    }
  }));
};