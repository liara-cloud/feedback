import express from 'express';
import expressSession from "express-session";
import passport from 'passport';
import jsonwebtoken from "jsonwebtoken";
import { Profile, Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { EnvVars } from "./EnvVars";

const app = express();
app.use(expressSession({
  secret: EnvVars.COOKIE_SECRET,
  cookie: {
    maxAge: 31556952000,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: EnvVars.CLIENT_ID,
  clientSecret: EnvVars.CLIENT_SECRET,
  callbackURL: `/login/callback`
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.use(new JwtStrategy({
  // this could be a custom extractor so the client doesn't have to be concerned about sending it when requesting
  jwtFromRequest: ExtractJwt.fromUrlQueryParameter("token"),
  secretOrKey: EnvVars.JWT_SECRET
}, (payload, done) => {
  return done(null, payload)
}));

passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser((user, done) => {
  return done(null, user as Profile);
});

// this should be a post req
app.get("/login", passport.authenticate("google", { scope: ['profile', 'email'] }));
app.get("/login/callback",
  passport.authenticate("google", { session: true, keepSessionInfo: true }),
  async (req, res) => {
    // @ts-ignore
    const name = req.user.displayName;
    return res.json(jsonwebtoken.sign({ name }, EnvVars.JWT_SECRET));
  });

app.listen(EnvVars.PORT, () => {
  console.log(`app is up and running on ${EnvVars.HOST}:${EnvVars.PORT}`);
});