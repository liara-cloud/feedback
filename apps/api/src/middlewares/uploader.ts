import multer from "multer";

export const uploader = multer({ storage: multer.memoryStorage() });
