import { type Request, type Response } from "express";

export interface TeamsControllerStructure {
  getTeams: (_req: Request, res: Response) => void;
}
