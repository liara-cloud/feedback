import { Request, Response } from "express";
import { assertUserExists } from "../../../utils/assertUserExists";
import { zBodyParse } from "../../../utils/zBodyParse";
import prisma from "../../../utils/prisma";
import { deleteVoteSchema } from "./schema";

export const deleteVote = async (req: Request, res: Response) => {
  assertUserExists(req);
  const { feedbackId } = await zBodyParse(deleteVoteSchema, req);
  await prisma.votes.delete({
    where: {
      userId_feedbackId: {
        userId: req.user.id,
        feedbackId
      }
    }
  });
  return res.json("vote removed");
};