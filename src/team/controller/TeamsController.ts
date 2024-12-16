import { type Model } from "mongoose";
import { type Request, type Response } from "express";
import {
  type RequestWithId,
  type RequestWithTeam,
  type TeamsControllerStructure,
} from "./types";
import { type TeamStructure } from "../types";
import ServerError from "../../server/errors/ServerError/ServerError.js";

class TeamsController implements TeamsControllerStructure {
  constructor(private readonly teamModel: Model<TeamStructure>) {}

  getTeams = async (_req: Request, res: Response): Promise<void> => {
    const statusCode = 200;

    const teams = await this.teamModel.find().sort({ name: 1 }).exec();

    res.status(statusCode).json({ teams });
  };

  createTeam = async (req: RequestWithTeam, res: Response): Promise<void> => {
    const statusCodeError = 409;
    const statusCode = 201;

    const { name } = req.body;

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

  deleteById = async (req: RequestWithId, res: Response): Promise<void> => {
    const idLength = 24;
    const statusCode = 200;

    const { _id } = req.params;

    if (_id.length !== idLength) {
      throw new ServerError("ID is not correct", 400);
    }

    const team = await this.teamModel.findByIdAndDelete(_id);

    if (!team) {
      throw new ServerError("Team not found", 404);
    }

    res.status(statusCode).json({ team });
  };
}

export default TeamsController;
