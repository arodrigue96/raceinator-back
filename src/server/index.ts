import express from "express";
import morgan from "morgan";
import teamsRouter from "../team/router/teamsRouter.js";
import handleEndpointNotFoundError from "./errors/handleEndpointNotFoundError/handleEndpointNotFoundError.js";
import handleGeneralErrors from "./errors/handleGeneralErrors/handleGeneralErrors.js";
import detectEnviromentForCors from "./detectEnviromentForCors.js";

export const app = express();
app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

detectEnviromentForCors(app);

app.use("/teams", teamsRouter);

app.use(handleEndpointNotFoundError);
app.use(handleGeneralErrors);
