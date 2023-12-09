import { Request, Response } from "express";
import { assertUserExists } from "../../../utils/assertUserExists";
import { zBodyParse } from "../../../utils/zBodyParse";
import { postCommentSchema } from "./schema";
import prisma from "../../../utils/prisma";

export const postComment = async (req: Request, res: Response) => {
  assertUserExists(req);
  const { feedbackId, content } = await zBodyParse(postCommentSchema, req);
  await prisma.comments.create({
    data: {
      userId: req.user.id,
      feedbackId,
      content
    }
  });
  return res.json("comment posted");
};