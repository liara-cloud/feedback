import express from 'express';
import { EnvVars } from "./utils/EnvVars";
import "express-async-errors";
import { errorHandler } from "./middlewares/errorHandler";
import { initPlugins } from "./utils/initServer/initPlugins";
import { initControllers } from "./controllers/initControllers";

declare global {
  namespace Express {
    export interface User {
      id: string;
    }
  }
}

const app = express();
initPlugins(app);
initControllers(app);
app.use(errorHandler);

app.listen(EnvVars.PORT || 3000, () => {
  console.log(`app is up and running on ${EnvVars.HOST}:${EnvVars.PORT}`);
});