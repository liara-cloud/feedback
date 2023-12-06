import { Express } from "express";
import passport from "passport";
import { Profile, Strategy as GoogleStrategy } from "passport-google-oauth20";
import { EnvVars } from "../EnvVars";

export const initPassport = (app: Express) => {
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new GoogleStrategy({
    clientID: EnvVars.CLIENT_ID,
    clientSecret: EnvVars.CLIENT_SECRET,
    callbackURL: `/login/callback`
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));
  
  passport.serializeUser((user, done) => {
    return done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    return done(null, user as Profile);
  });
};