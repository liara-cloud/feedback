import { Request, Response } from "express";
import { zBodyParse } from "../../../utils/zBodyParse";
import { getAllFeedbacksSchema } from "./schema";
import prisma from "../../../utils/prisma";
import { exclude } from "../../../utils/exclude";
import { setCountKey } from "../../../utils/setCountKey";


export const getAllFeedbacks = async (req: Request, res: Response) => {
  const { page } = await zBodyParse(getAllFeedbacksSchema, req);
  // https://medium.com/@aliammariraq/prisma-exclude-with-typesafety-8484ea6d0c42
  const feedbacks = await prisma.feedbacks.findMany({
    include: {
      user: {
        select: {
          name: true,
          color: true
        }
      },
      _count: {
        select: {
          votes: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 20,
    skip: 20 * (page - 1)
  });
  return res.json(
    feedbacks.map(feedback => {
      const excluded = exclude(feedback, ["attachmentUrl", "userId"]);
      return setCountKey(excluded, "votes");
    })
  );
};