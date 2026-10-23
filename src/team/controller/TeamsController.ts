import { type Model } from "mongoose";
import { type Request, type Response } from "express";
import {
  type RequestWithId,
  type RequestWithTeam,
  type TeamsControllerStructure,
} from "./types";
import { type TeamStructure } from "../types";
import ServerError from "../../server/errors/ServerError/ServerError.js";
import defaultTeams from "../defaultTeams.js";

const maxTeams = 50;

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

    if ((await this.teamModel.countDocuments()) >= maxTeams) {
      throw new ServerError("Maximum number of teams reached", 422);
    }

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

  // Ponytail: delete + insert is not atomic; a create in between can 500 on the unique name, retry fixes it
  resetTeams = async (_req: Request, res: Response): Promise<void> => {
    await this.teamModel.deleteMany({});
    await this.teamModel.insertMany(defaultTeams);

    const teams = await this.teamModel.find().sort({ name: 1 }).exec();

    res.status(200).json({ teams });
  };

  deleteTeamById = async (req: RequestWithId, res: Response): Promise<void> => {
    const statusCode = 200;

    const { _id } = req.params;

    const team = await this.teamModel.findByIdAndDelete(_id);

    if (!team) {
      throw new ServerError("Team not found", 404);
    }

    res.status(statusCode).json({ team });
  };

  getTeamById = async (req: RequestWithId, res: Response): Promise<void> => {
    const statusCode = 200;

    const { _id } = req.params;

    const team = await this.teamModel.findById(_id);

    if (!team) {
      throw new ServerError("Team not found", 404);
    }

    res.status(statusCode).json({ team });
  };
}

export default TeamsController;
