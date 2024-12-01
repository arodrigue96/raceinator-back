import express from "express";
import teamsRouter from "../team/router/teamsRouter.js";

export const app = express();

app.disable("x-powered-by");

app.use("/teams", teamsRouter);
