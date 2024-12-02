import chalk from "chalk";
import startServer from "./server/startServer.js";
import connectToDatabase from "./database/connectToDatabase.js";
import { app } from "./server/middlewares.js";

const port = process.env.PORT;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(chalk.bgRedBright("MongoDB url does not exist"));
}

await connectToDatabase(databaseUrl);

startServer(app, Number(port));
