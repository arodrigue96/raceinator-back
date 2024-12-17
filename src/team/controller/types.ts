import { type Request, type Response } from "express";
import { type TeamWithoutId } from "../types";

export interface TeamsControllerStructure {
  getTeams: (_req: Request, res: Response) => Promise<void>;
  createTeam: (req: Request, res: Response) => Promise<void>;
  deleteTeamById: (req: Request, res: Response) => Promise<void>;
  getTeamById: (req: Request, res: Response) => Promise<void>;
}

export type RequestWithTeam = Request<unknown, unknown, TeamWithoutId>;

export type RequestWithId = Request<{
  _id: string;
}>;
