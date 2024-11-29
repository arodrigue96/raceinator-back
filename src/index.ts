import startServer from "./server/startServer.js";
import { app } from "./server/index.js";

const port = process.env.PORT;

if (!port) {
  throw new Error("Env variable does not exist");
}

startServer(app, Number(port));
