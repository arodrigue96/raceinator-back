import { readFileSync } from "node:fs";
import path from "node:path";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import connectToDatabase from "../../../database/connectToDatabase";
import { app } from "../../../server";
import Team from "../../model/Team";
import { type TeamStructure, type TeamWithoutId } from "../../types";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const connectionString = server.getUri();

  await connectToDatabase(connectionString);
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

const defaultTeams = JSON.parse(
  readFileSync(path.join(process.cwd(), "data/teams2026.json"), "utf8"),
) as TeamWithoutId[];

const defaultNames = defaultTeams.map(({ name }) => name).sort();

describe("Given the POST /teams/reset endpoint", () => {
  describe("When the collection has a junk team and is missing defaults", () => {
    test("Then it should respond 200 with exactly the 11 default teams and store only them", async () => {
      await Team.create({
        ...defaultTeams[0],
        name: "Junk team",
      });

      const response = await request(app)
        .post("/teams/reset")
        .set("x-client-ip", "reset")
        .expect(200);

      const { teams } = response.body as { teams: TeamStructure[] };
      const storedNames = (await Team.find()).map(({ name }) => name).sort();

      expect(teams).toHaveLength(11);
      expect(teams.map(({ name }) => name).sort()).toEqual(defaultNames);
      expect(storedNames).toEqual(defaultNames);
    });
  });

  describe("When it receives more resets than the limit from one client", () => {
    afterEach(() => {
      delete process.env.RESET_RATE_LIMIT;
    });

    test("Then it should respond 429", async () => {
      process.env.RESET_RATE_LIMIT = "1";

      await request(app).post("/teams/reset").set("x-client-ip", "spam");

      await request(app)
        .post("/teams/reset")
        .set("x-client-ip", "spam")
        .expect(429);
    });
  });
});
