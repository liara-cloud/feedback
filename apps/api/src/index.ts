import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import jsonwebtoken from "jsonwebtoken";
import { EnvVars } from "./utils/EnvVars";
import { initSession } from "./utils/initServer/initSession";
import { initPassport } from "./utils/initServer/initPassport";
import { initJwt } from "./utils/initServer/initJwt";
import prisma from "./utils/prisma";
import multer from "multer";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import path from "path";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { exclude } from "./utils/exclude";
import { setCountKey } from "./utils/setCountKey";
import { zBodyParse } from "./utils/zBodyParse";

import "express-async-errors";
import { ZodError } from "zod";
import { postCommentSchema } from "./schemas/postCommentSchema";
import { postVoteSchema } from "./schemas/postVoteSchema";
import { updateUserSchema } from "./schemas/updateUserSchema";
import { postFeedbackSchema } from "./schemas/postFeedbackSchema";

declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

const app = express();
app.use(express.json())
initSession(app);
initPassport(app);
initJwt(app);
const upload = multer({ storage: multer.memoryStorage() });

// this should be a post req
app.get("/login", passport.authenticate("google", { scope: ['profile', 'email'] }));
app.get("/login/callback",
  passport.authenticate("google", { session: true, keepSessionInfo: true }),
  async (req, res) => {
    const id = req.user?.id!;
    return res.json(jsonwebtoken.sign({ id }, EnvVars.JWT_SECRET));
  });

// cursor pagination in the future
app.get("/feedbacks", async (req, res) => {
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
    }
  });
  return res.json(
    feedbacks.map(feedback => {
      const excluded = exclude(feedback, ["attachmentUrl", "userId"]);
      return setCountKey(excluded, "votes");
    })
  );
});

// validation with zod, only zod.
app.post("/feedbacks", [
  passport.authenticate("jwt", { session: false }),
  upload.single("attachment")
], async (req: Request, res: Response) => {
  const { title, description } = await zBodyParse(postFeedbackSchema, req);
  let fileUrl: string | undefined = undefined;
  if (req.file) {
    const name = path.parse(req.file.originalname);
    const key = name.name + Date.now() + name.ext;
    const client = new S3Client({
      region: "default",
      endpoint: EnvVars.S3_ENDPOINT,
      credentials: {
        accessKeyId: EnvVars.S3_ACCESS_KEY,
        secretAccessKey: EnvVars.S3_SECRET_KEY
      }
    });
    await client.send(new PutObjectCommand({
      Body: req.file.buffer,
      Bucket: EnvVars.S3_BUCKET_NAME,
      Key: key
    }));
    fileUrl = await getSignedUrl(client, new GetObjectCommand({
      Bucket: EnvVars.S3_BUCKET_NAME,
      Key: key
    }));
  }
  await prisma.feedbacks.create({
    data: {
      userId: req.user?.id!,
      title,
      description,
      attachmentUrl: fileUrl,
    }
  })
  return res.send("success");
});

// guard against the existence of the feedback
app.get("/feedbacks/:feedbackId", async (req, res) => {
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
  const { comments: unExcludedComments, ...rest } = setCountKey(feedback!, "votes");
  const comments = unExcludedComments.map(comment => exclude(comment, ["userId", "feedbackId"]))
  return res.json(
    {
      ...exclude(rest, ["userId"]),
      comments
    }
  )
});

app.post("/comment", passport.authenticate("jwt", { session: true }), async (req, res) => {
  const { feedbackId, content } = await zBodyParse(postCommentSchema, req);
  await prisma.comments.create({
    data: {
      userId: req.user?.id!,
      feedbackId,
      content
    }
  });
  return res.json("comment posted");
});

app.post("/vote", passport.authenticate("jwt", { session: true }), async (req, res) => {
  const { feedbackId } = await zBodyParse(postVoteSchema, req);
  // check for uniqueness
  await prisma.votes.create({
    data: {
      userId: req.user?.id!,
      feedbackId
    }
  });
  return res.json("vote casted");
});

app.get("/me", passport.authenticate("jwt", { session: true }), async (req, res) => {
  return res.json(prisma.users.findUnique({
    where: {
      id: req.user?.id!
    }
  }));
});

app.post("/me", passport.authenticate("jwt", { session: true }), async (req, res) => {
  const { name, color } = await zBodyParse(updateUserSchema, req);
  await prisma.users.update({
    where: {
      id: req.user?.id!
    },
    data: {
      name,
      color
    }
  });
  return res.json("profile updated");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    const firstError = err.errors[0];
    const { path, message } = firstError;
    res.status(400).json(`${path.join()}: ${message}.`);
  } else
    res.status(500).json("something went wrong.");
  return next();
});

app.listen(EnvVars.PORT || 3000, () => {
  console.log(`app is up and running on ${EnvVars.HOST}:${EnvVars.PORT}`);
});