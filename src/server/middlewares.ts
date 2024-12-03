import express from "express";
import morgan from "morgan";
import teamsRouter from "../team/router/teamsRouter.js";
import handleEndpointNotFoundError from "./errors/handleEndpointNotFoundError/handleEndpointNotFoundError.js";
import handleGeneralErrors from "./errors/handleGeneralErrors/handleGeneralErrors.js";

export const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use("/teams", teamsRouter);

app.use(handleEndpointNotFoundError);

app.use(handleGeneralErrors);
