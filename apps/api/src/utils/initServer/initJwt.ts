import { Express } from "express";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { EnvVars } from "../EnvVars";


export const initJwt = (app: Express) => {
  passport.use(new JwtStrategy({
    // this could be a custom extractor so the client doesn't have to be concerned about sending it when requesting
    jwtFromRequest: ExtractJwt.fromHeader("token"),
    secretOrKey: EnvVars.JWT_SECRET
  }, (payload, done) => {
    return done(null, { id: payload.id })
  }));
};