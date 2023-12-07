import { Express } from "express";
import passport from "passport";
import { Profile, Strategy as GoogleStrategy } from "passport-google-oauth20";
import { EnvVars } from "../EnvVars";
import prisma from "../prisma";

export const initPassport = (app: Express) => {
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new GoogleStrategy({
    clientID: EnvVars.CLIENT_ID,
    clientSecret: EnvVars.CLIENT_SECRET,
    callbackURL: `/login/callback`
  }, async (_accessToken, _refreshToken, profile, done) => {
    const user = await prisma.users.upsert({
      where: {
        email: profile._json.email!,
      },
      create: {
        email: profile._json.email!,
        name: profile.displayName,
        color: "#FFF",
      },
      update: {}
    });
    return done(null, { id: user.id });
  }));
  
  passport.serializeUser((user, done) => {
    return done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    return done(null, user as { id: string });
  });
};