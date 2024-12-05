import chalk from "chalk";
import cors from "cors";
import { type Express } from "express";

const detectEnviromentForCors = (app: Express) => {
  const enviroment = process.env.NODE_ENV;

  if (enviroment !== "test") {
    const url = process.env.ALLOWED_URLS;

    if (!url) {
      throw new Error(
        chalk.bgRed("Enviroment variable ALLOWED_URLS does not exist"),
      );
    }

    const urls = url.split(",");

    app.use(
      cors({
        origin: urls,
      }),
    );
  }
};

export default detectEnviromentForCors;
