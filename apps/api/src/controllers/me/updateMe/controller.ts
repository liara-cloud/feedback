import { Request, Response } from "express";
import { assertUserExists } from "../../../utils/assertUserExists";
import { zBodyParse } from "../../../utils/zBodyParse";
import { updateUserSchema } from "./schema";
import prisma from "../../../utils/prisma";

export const updateMe = async (req: Request, res: Response) => {
  assertUserExists(req);
  const { name, color } = await zBodyParse(updateUserSchema, req);
  await prisma.users.update({
    where: {
      id: req.user.id
    },
    data: {
      name,
      color
    }
  });
  return res.json("profile updated");
};