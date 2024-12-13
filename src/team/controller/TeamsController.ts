import { type Model } from "mongoose";
import { type Request, type Response } from "express";
import { type TeamsControllerStructure } from "./types";
import { type TeamStructure } from "../types";
import ServerError from "../../server/errors/ServerError/ServerError.js";

class TeamsController implements TeamsControllerStructure {
  constructor(private readonly teamModel: Model<TeamStructure>) {}

  getTeams = async (_req: Request, res: Response): Promise<void> => {
    const statusCode = 200;

    const teams = await this.teamModel.find().sort({ name: 1 }).exec();

    res.status(statusCode).json({ teams });
  };

  createTeam = async (req: Request, res: Response): Promise<void> => {
    const statusCodeError = 409;
    const statusCode = 201;

    const { name } = req.body as TeamStructure;

    const teamInDataBase = await this.teamModel.findOne({ name });

    if (teamInDataBase) {
      throw new ServerError(
        "A team with this name already exists",
        statusCodeError,
      );
    }

    const newTeam = await this.teamModel.create(req.body);

    res.status(statusCode).json({ teams: newTeam });
  };
}

export default TeamsController;
