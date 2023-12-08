import express, { Request, Response } from 'express';
import passport from 'passport';
import jsonwebtoken from "jsonwebtoken";
import { EnvVars } from "./utils/EnvVars";
import { initSession } from "./utils/initServer/initSession";
import { initPassport } from "./utils/initServer/initPassport";
import { initJwt } from "./utils/initServer/initJwt";
import prisma from "./utils/prisma";
import multer from "multer";
import { GetObjectCommand, PutObjectAclCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import path from "path";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { exclude } from "./utils/exclude";
import { setCountKey } from "./utils/setCountKey";

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
], async (req: Request<{}, {}, {
  title: string;
  description: string;
}>, res: Response) => {
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
      title: req.body.title,
      description: req.body.description,
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
      ...rest,
      comments
    }
  )
});

app.post("/comment", passport.authenticate("jwt", { session: true }), async (req: Request<{}, {}, {
  feedbackId: string,
  content: string
}>, res) => {
  await prisma.comments.create({
    data: {
      userId: req.user?.id!,
      feedbackId: req.body.feedbackId,
      content: req.body.content
    }
  });
  return res.json("comment posted");
});

app.post("/vote", passport.authenticate("jwt", { session: true }), async (req: Request<{}, {}, {
  feedbackId: string
}>, res) => {
  // check for uniqueness
  await prisma.votes.create({
    data: {
      userId: req.user?.id!,
      feedbackId: req.body.feedbackId
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

app.post("/me", passport.authenticate("jwt", { session: true }), async (req: Request<{}, {}, {
  name: string,
  color: string
}>, res) => {
  await prisma.users.update({
    where: {
      id: req.user?.id!
    },
    data: {
      name: req.body.name,
      color: req.body.color
    }
  });
  return res.json("profile updated");
});

app.listen(EnvVars.PORT || 3000, () => {
  console.log(`app is up and running on ${EnvVars.HOST}:${EnvVars.PORT}`);
});