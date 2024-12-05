import { type Model } from "mongoose";
import { type Request, type Response } from "express";
import { type TeamsControllerStructure } from "./types";
import { type TeamStructure } from "../types";

class TeamsController implements TeamsControllerStructure {
  constructor(private readonly teamModel: Model<TeamStructure>) {}

  getTeams = async (_req: Request, res: Response): Promise<void> => {
    const statusCode = 200;

    const teams = await this.teamModel.find().sort({ name: 1 }).exec();

    res.status(statusCode).json({ teams });
  };
}

export default TeamsController;
