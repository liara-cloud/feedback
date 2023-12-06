import express from 'express';
import passport from 'passport';
import jsonwebtoken from "jsonwebtoken";
import { EnvVars } from "./utils/EnvVars";
import { initSession } from "./utils/initServer/initSession";
import { initPassport } from "./utils/initServer/initPassport";
import { initJwt } from "./utils/initServer/initJwt";

const app = express();
initSession(app);
initPassport(app);
initJwt(app);

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