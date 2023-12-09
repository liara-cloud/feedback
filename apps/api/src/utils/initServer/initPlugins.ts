import express, { Express } from "express";
import { initSession } from "./plugins/initSession";
import { initPassport } from "./plugins/initPassport";
import { initJwt } from "./plugins/initJwt";

export const initPlugins = (app: Express) => {
  app.use(express.json());
  initSession(app);
  const passport = initPassport(app);
  initJwt(passport);
};