import express from "express";
import cors from "cors";
import morgan from "morgan";
import teamsRouter from "../team/router/teamsRouter.js";
import handleEndpointNotFoundError from "./errors/handleEndpointNotFoundError/handleEndpointNotFoundError.js";
import handleGeneralErrors from "./errors/handleGeneralErrors/handleGeneralErrors.js";

export const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://aniol-rodriguez-202409-front.netlify.app",
    ],
  }),
);

app.use(morgan("dev"));

app.use("/teams", teamsRouter);

app.use(handleEndpointNotFoundError);

app.use(handleGeneralErrors);
