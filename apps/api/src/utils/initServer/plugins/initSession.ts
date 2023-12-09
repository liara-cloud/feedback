import { Express } from "express";
import expressSession from "express-session";
import { EnvVars } from "../../EnvVars";


export const initSession = (app: Express) => {
  app.use(expressSession({
    secret: EnvVars.COOKIE_SECRET,
    cookie: {
      maxAge: 31556952000,
      httpOnly: true
    },
    resave: false,
    saveUninitialized: false
  }));
};