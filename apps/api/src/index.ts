import express from 'express';
import passport from 'passport';
import jsonwebtoken from "jsonwebtoken";
import { EnvVars } from "./utils/EnvVars";
import { initSession } from "./utils/initServer/initSession";
import { initPassport } from "./utils/initServer/initPassport";
import { initJwt } from "./utils/initServer/initJwt";

declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

const app = express();
initSession(app);
initPassport(app);
initJwt(app);

// this should be a post req
app.get("/login", passport.authenticate("google", { scope: ['profile', 'email'] }));
app.get("/login/callback",
  passport.authenticate("google", { session: true, keepSessionInfo: true }),
  async (req, res) => {
    const id = req.user?.id!;
    return res.json(jsonwebtoken.sign({ id }, EnvVars.JWT_SECRET));
  });

app.get("/protected", passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log(req.user)
  return res.json("you got access!");
});

app.listen(EnvVars.PORT || 3000, () => {
  console.log(`app is up and running on ${EnvVars.HOST}:${EnvVars.PORT}`);
});