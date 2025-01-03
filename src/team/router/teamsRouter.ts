import { Router } from "express";
import TeamsController from "../controller/TeamsController.js";
import Team from "../model/Team.js";

const teamsRouter = Router();

const teamsController = new TeamsController(Team);

teamsRouter.get("/", teamsController.getTeams);
teamsRouter.post("/", teamsController.createTeam);
teamsRouter.delete("/:_id", teamsController.deleteTeamById);
teamsRouter.get("/:_id", teamsController.getTeamById);

export default teamsRouter;
