import { Router } from "express";
import TeamsController from "../controller/TeamsController.js";
import Team from "../model/Team.js";

const teamsRouter = Router();

const teamsController = new TeamsController(Team);

teamsRouter.get("/", teamsController.getTeams);

export default teamsRouter;
