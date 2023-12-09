import { Request, Response } from "express";
import prisma from "../../../utils/prisma";
import { assertNull } from "../../../utils/assertNull";
import { setCountKey } from "../../../utils/setCountKey";
import { exclude } from "../../../utils/exclude";

export const getFeedbackById = async (req: Request, res: Response) => {
  const feedback = await prisma.feedbacks.findUnique({
    where: {
      id: req.params.feedbackId
    },
    include: {
      user: {
        select: {
          name: true,
          color: true
        }
      },
      comments: {
        include: {
          user: {
            select: {
              name: true,
              color: true
            }
          },
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      _count: {
        select: {
          votes: true
        }
      }
    }
  });
  assertNull(feedback, "feedback not found");
  const { comments: unExcludedComments, ...rest } = setCountKey(feedback, "votes");
  const comments = unExcludedComments.map(comment => exclude(comment, ["userId", "feedbackId"]))
  return res.json(
    {
      ...exclude(rest, ["userId"]),
      comments
    }
  )
};