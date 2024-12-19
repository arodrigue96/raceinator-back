import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import connectToDatabase from "../../../database/connectToDatabase";
import { app } from "../../../server";
import Team from "../../model/Team";
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

describe("Given the DELETE /teams/:id endpoint", () => {
  describe("When it receives a request with a valid id", () => {
    test("Then it should respond with the status 200 and a 'Aniol's team''", async () => {
      const expectedStatusCode = 200;

      const newTeam = await Team.create({
        name: "Aniol's team",
        ridersNames: ["juan", "berto"],
        championshipTitles: 2,
        imageUrl: "http://refactor",
        altImageText: "kljkl",
        description: "kljkl",
        debutYear: 1996,
        isOfficialTeam: true,
      });

      const response = await request(app)
        .delete(`/teams/${newTeam._id}`)
        .expect(expectedStatusCode);

      expect(response.body).toMatchObject<{ team: Partial<TeamStructure> }>({
        team: {
          name: newTeam.name,
        },
      });
    });
  });

  describe("When it receive a request with an '123456789123456789123456' inexistent id", () => {
    test("Then it should respond with the status 404 and a 'Team not found'", async () => {
      const response = await request(app)
        .delete("/teams/123456789123456789123456")
        .expect(404);

      expect(response.body).toEqual({
        message: "Team not found",
      });
    });
  });

  describe("When it receive a request with an '1234567891234567891234' incorrect id", () => {
    test("Then it should respond with the status 400 and a 'ID is not correct'", async () => {
      const response = await request(app)
        .delete("/teams/1234567891234567891234")
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "ID is not correct",
      });
    });
  });
});
