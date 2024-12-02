import { type Request, type Response } from "express";
import { type Model } from "mongoose";
import { type TeamStructure } from "../../types";
import TeamsController from "../TeamsController";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given the getTeams method of TeamsController class", () => {
  describe("When it receives a response", () => {
    const teamModelMock: Partial<Model<TeamStructure>> = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          teams: [
            {
              name: "Aniol's team",
            },
          ],
        }),
      }),
    };

    const teamsController = new TeamsController(
      teamModelMock as Model<TeamStructure>,
    );

    const _req: Partial<Request> = {};
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    test("Then it should call the response's method with status 200", async () => {
      const expectedStatusCode = 200;

      await teamsController.getTeams(_req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call json method with a team with name 'Aniol's team'", async () => {
      const teams = {
        teams: [
          {
            name: "Aniol's team",
          },
        ],
      };

      await teamsController.getTeams(_req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({ teams });
    });
  });
});
