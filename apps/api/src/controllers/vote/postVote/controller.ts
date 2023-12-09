import { Request, Response } from "express";
import { assertUserExists } from "../../../utils/assertUserExists";
import { zBodyParse } from "../../../utils/zBodyParse";
import { postVoteSchema } from "./schema";
import prisma from "../../../utils/prisma";

export const postVote = async (req: Request, res: Response) => {
  assertUserExists(req);
  const { feedbackId } = await zBodyParse(postVoteSchema, req);
  const alreadyVoted = await prisma.votes.findUnique({
    where: {
      userId_feedbackId: {
        userId: req.user.id,
        feedbackId
      }
    }
  });
  if (alreadyVoted) {
    return res.status(409).json("you have already voted");
  }
  await prisma.votes.create({
    data: {
      userId: req.user.id,
      feedbackId
    }
  });
  return res.json("vote casted");
};