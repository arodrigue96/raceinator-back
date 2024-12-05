import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import connectToDatabase from "../../../database/connectToDatabase";
import { app } from "../../../server";
import Team from "../../model/Team.js";
import { type TeamStructure } from "../../types";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const connectionString = server.getUri();

  await connectToDatabase(connectionString);
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

describe("Given the GET /teams endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should response with the status 200 and a list of teams with the names 'Aniol's team' and 'Erik's team'", async () => {
      const expectedStatusCode = 200;
      const path = "/teams";

      await Team.create(
        {
          name: "Aniol's team",
          ridersNames: ["juan", "berto"],
          championshipTitles: 2,
          imageUrl: "http://refactor",
          altImageText: "kljkl",
          description: "kljkl",
          debutYear: 1996,
          isOfficialTeam: true,
        },
        {
          name: "Erik's team",
          ridersNames: ["juanillo", "pedrillo"],
          championshipTitles: 3,
          imageUrl: "http://google",
          altImageText: "Asdkl",
          description: "lñjkl",
          debutYear: 2005,
          isOfficialTeam: true,
        },
      );

      const response = await request(app).get(path).expect(expectedStatusCode);

      const responseBody = response.body as { teams: TeamStructure[] };

      expect(responseBody.teams).toMatchObject<Array<Partial<TeamStructure>>>([
        {
          name: "Aniol's team",
          ridersNames: ["juan", "berto"],
        },
        {
          name: "Erik's team",
          ridersNames: ["juanillo", "pedrillo"],
        },
      ]);
    });
  });
});
