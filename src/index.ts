import chalk from "chalk";
import startServer from "./server/startServer.js";
import { app } from "./server/index.js";
import connectToDatabase from "./database/connectToDatabase.js";

const port = process.env.PORT;
const databaseUrl = process.env.DATA_BASE;

if (!databaseUrl) {
  throw new Error(chalk.bgRedBright("MongoDB url does not exist"));
}

await connectToDatabase(databaseUrl);

startServer(app, Number(port));
