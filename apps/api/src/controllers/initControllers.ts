import { Express } from "express";
import { getAllFeedbacks } from "./feedback/getAllFeedbacks/controller";
import { getFeedbackById } from "./feedback/getFeedbackById/controller";
import { protectedRoute } from "../middlewares/protectedRoute";
import { uploader } from "../middlewares/uploader";
import { postFeedback } from "./feedback/postFeedback/controller";
import { postComment } from "./comment/postComment/controller";
import { postVote } from "./vote/postVote/controller";
import { deleteVote } from "./vote/deleteVote/controller";
import { getMe } from "./me/getMe/controller";
import { updateMe } from "./me/updateMe/controller";
import passport from "passport";
import { loginCallback } from "./login/callback";

export const initControllers = (app: Express) => {
  app.get("/login", passport.authenticate("google", { scope: ['profile', 'email'] }));
  app.get("/login/callback",
    passport.authenticate("google", { session: true, keepSessionInfo: true }),
    loginCallback
  );
  
  app.get("/feedbacks", getAllFeedbacks);
  app.get("/feedbacks/:feedbackId", getFeedbackById);
  app.post("/feedbacks", [protectedRoute, uploader.single("attachment")], postFeedback);
  
  app.post("/comment", protectedRoute, postComment);
  
  app.post("/vote", protectedRoute, postVote);
  app.delete("/vote", protectedRoute, deleteVote);
  
  app.get("/me", protectedRoute, getMe);
  app.post("/me", protectedRoute, updateMe);
};