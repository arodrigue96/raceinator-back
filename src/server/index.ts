import express from "express";
import cors from "cors";
import morgan from "morgan";
import chalk from "chalk";
import teamsRouter from "../team/router/teamsRouter.js";
import handleEndpointNotFoundError from "./errors/handleEndpointNotFoundError/handleEndpointNotFoundError.js";
import handleGeneralErrors from "./errors/handleGeneralErrors/handleGeneralErrors.js";

export const app = express();
app.disable("x-powered-by");

app.use(morgan("dev"));

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

app.use("/teams", teamsRouter);

app.use(handleEndpointNotFoundError);
app.use(handleGeneralErrors);
