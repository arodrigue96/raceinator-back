import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import connectToDatabase from "../../../database/connectToDatabase";
import { app } from "../../../server";
import { type TeamWithoutId, type TeamStructure } from "../../types";

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

describe("Given the POST /teams endpoint", () => {
  const path = "/teams";

  const aniolTeam: TeamWithoutId = {
    name: "Aniol's team",
    ridersNames: ["juan", "berto"],
    championshipTitles: 2,
    imageUrl: "https://refractor.com",
    altImageText: "kljkl",
    description: "kljkl",
    debutYear: 1996,
    isOfficialTeam: true,
  };
  describe("When it receives a request with the team name 'Aniol's team'", () => {
    test("Then it should response with the status 201 and a new team with the name 'Aniol's team'", async () => {
      const expectedStatusCode = 201;
      const expectedTeamName = "Aniol's team";

      const response = await request(app)
        .post(path)
        .send(aniolTeam)
        .expect(expectedStatusCode);

      const responseBody = response.body as { teams: TeamStructure };

      expect(responseBody.teams.name).toBe(expectedTeamName);
    });

    describe("When it receives a request with 'Aniol's team' and it already exists in the database", () => {
      test("Then it should respond with status code 409 and the error 'A team with this name already exists'", async () => {
        const expectedErrorMessage = "A team with this name already exists";
        const expectedStatusCode = 409;

        const response = await request(app)
          .post(path)
          .send(aniolTeam)
          .expect(expectedStatusCode);

        const responseBody = response.body as { teams: TeamStructure };

        expect(responseBody).toEqual({
          message: expectedErrorMessage,
        });
      });
    });
  });
});
