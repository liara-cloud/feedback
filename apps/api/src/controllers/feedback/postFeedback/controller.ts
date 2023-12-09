import { Request, Response } from "express";
import { assertUserExists } from "../../../utils/assertUserExists";
import { zBodyParse } from "../../../utils/zBodyParse";
import { postFeedbackSchema } from "./schema";
import path from "path";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { EnvVars } from "../../../utils/EnvVars";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "../../../utils/prisma";

export const postFeedback = async (req: Request, res: Response) => {
  assertUserExists(req);
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
      userId: req.user.id,
      title,
      description,
      attachmentUrl: fileUrl,
    }
  })
  return res.send("success");
};