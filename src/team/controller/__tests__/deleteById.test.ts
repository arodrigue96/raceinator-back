import { type Model } from "mongoose";
import { type Response } from "express";
import { type TeamStructure } from "../../types";
import { type RequestWithId } from "../types";
import TeamsController from "../TeamsController";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given the deleteById method of the TeamsController class", () => {
  const aniolTeam: TeamStructure = {
    _id: "6760222c9f350126a80dcb71",
    name: "Aniol's team",
    ridersNames: ["juan", "berto"],
    championshipTitles: 2,
    imageUrl: "https://refractor.com",
    altImageText: "Aniol's images",
    description: "Aniol's hola hola",
    debutYear: 1996,
    isOfficialTeam: true,
  };

  const teamModelMock: Partial<Model<TeamStructure>> = {
    findByIdAndDelete: jest.fn().mockResolvedValue(aniolTeam),
  };

  const teamsController = new TeamsController(
    teamModelMock as Model<TeamStructure>,
  );

  const req: Partial<RequestWithId> = {
    params: { _id: aniolTeam._id },
  };

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When it receives a request with a valid id'", () => {
    test("Then it should call the response's method with status 200", async () => {
      const expectedStatusCode = 200;

      await teamsController.deleteById(req as RequestWithId, res as Response);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call the response's method json with the 'Team deleted'", async () => {
      const expectedMessage = "Team deleted";

      await teamsController.deleteById(req as RequestWithId, res as Response);

      expect(res.json).toHaveBeenCalledWith({ message: expectedMessage });
    });
  });
});
