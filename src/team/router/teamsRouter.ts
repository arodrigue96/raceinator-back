import { Router } from "express";
import TeamsController from "../controller/TeamsController.js";
import Team from "../model/Team.js";
import validate from "../../server/middlewares/validate.js";
import {
  resetLimiter,
  writeLimiter,
} from "../../server/middlewares/rateLimits.js";
import { teamBodySchema, teamIdParamsSchema } from "../schemas/teamSchema.js";

const teamsRouter = Router();

const teamsController = new TeamsController(Team);

const validateId = validate({ params: teamIdParamsSchema });

teamsRouter.get("/", teamsController.getTeams);
teamsRouter.post(
  "/",
  writeLimiter,
  validate({ body: teamBodySchema }),
  teamsController.createTeam,
);
teamsRouter.post("/reset", resetLimiter, teamsController.resetTeams);
teamsRouter.delete(
  "/:_id",
  writeLimiter,
  validateId,
  teamsController.deleteTeamById,
);
teamsRouter.get("/:_id", validateId, teamsController.getTeamById);

export default teamsRouter;
