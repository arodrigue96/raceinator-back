import express from "express";
import morgan from "morgan";
import teamsRouter from "../team/router/teamsRouter.js";

export const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use("/teams", teamsRouter);
