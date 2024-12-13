import { type Model } from "mongoose";
import { type Response, type Request } from "express";
import { type TeamStructure, type TeamWithoutId } from "../../types";
import TeamsController from "../TeamsController";
import Team from "../../model/Team";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given the method createTeam of TeamsController class", () => {
  describe("When it receives a request with the 'Aniol's team'", () => {
    const aniolTeam: TeamWithoutId = {
      name: "Aniol's team",
      ridersNames: ["juan", "berto"],
      championshipTitles: 2,
      imageUrl: "http://refactor",
      altImageText: "Aniol's images",
      description: "Aniol's hola hola",
      debutYear: 1996,
      isOfficialTeam: true,
    };

    const teamModelMock: Partial<Model<TeamStructure>> = {
      findOne: (Team.findOne = jest.fn().mockResolvedValue(null)),
      create: jest.fn().mockResolvedValue(aniolTeam),
    };

    const teamsController = new TeamsController(
      teamModelMock as Model<TeamStructure>,
    );

    const req: Partial<Request> = { body: aniolTeam };
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    test("Then it should call the response's method status with 201", async () => {
      const expectedStatusCode = 201;

      await teamsController.createTeam(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call the response's method json with the 'Aniol's team'", async () => {
      await teamsController.createTeam(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({ teams: aniolTeam });
    });
  });
});
