import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import teamsRouter from "../team/router/teamsRouter.js";
import handleEndpointNotFoundError from "./errors/handleEndpointNotFoundError/handleEndpointNotFoundError.js";
import handleGeneralErrors from "./errors/handleGeneralErrors/handleGeneralErrors.js";
import detectEnviromentForCors from "./detectEnviromentForCors.js";

export const app = express();
app.disable("x-powered-by");

app.use(helmet());
app.use(morgan("dev"));

app.use(express.json({ limit: "10kb" }));

detectEnviromentForCors(app);

app.use("/teams", teamsRouter);

app.use(handleEndpointNotFoundError);
app.use(handleGeneralErrors);
