import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import connectToDatabase from "../../../database/connectToDatabase";
import { app } from "../../../server";
import Team from "../../model/Team";
import { type TeamWithoutId } from "../../types";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const connectionString = server.getUri();

  await connectToDatabase(connectionString);
});

beforeEach(async () => {
  await Team.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

const validTeam: TeamWithoutId = {
  name: "Hardening Racing",
  ridersNames: ["Rider One", "Rider Two"],
  championshipTitles: 3,
  imageUrl: "/images/teams/hardening-racing.webp",
  altImageText: "Hardening Racing bike",
  description: "A team used to test input validation.",
  debutYear: 2001,
  isOfficialTeam: false,
};

// A fresh client per request keeps these tests clear of the write limit
const post = async (body: unknown, clientIp = `client-${Math.random()}`) =>
  request(app)
    .post("/teams")
    .set("x-client-ip", clientIp)
    .send(body as Record<string, unknown>);

describe("Given the POST /teams endpoint with crafted payloads", () => {
  const abusePayloads: Array<[string, unknown]> = [
    ["a Mongo operator as name", { ...validTeam, name: { $gt: "" } }],
    ["a number as name", { ...validTeam, name: 42 }],
    ["a one character name", { ...validTeam, name: "a" }],
    ["a 61 characters name", { ...validTeam, name: "x".repeat(61) }],
    ["a blank name", { ...validTeam, name: "     " }],
    ["an unknown _id key", { ...validTeam, _id: "6760222c9f350126a80dcb71" }],
    ["an unknown $where key", { ...validTeam, $where: "sleep(1000)" }],
    [
      "a __proto__ key",
      JSON.parse(
        `{"__proto__":{"isAdmin":true},${JSON.stringify(validTeam).slice(1)}`,
      ) as unknown,
    ],
    ["no riders", { ...validTeam, ridersNames: [] }],
    [
      "five riders",
      { ...validTeam, ridersNames: ["aa", "bb", "cc", "dd", "ee"] },
    ],
    ["an operator inside riders", { ...validTeam, ridersNames: [{ $ne: 1 }] }],
    ["titles as a string", { ...validTeam, championshipTitles: "3" }],
    ["decimal titles", { ...validTeam, championshipTitles: 1.5 }],
    ["100 titles", { ...validTeam, championshipTitles: 100 }],
    ["negative titles", { ...validTeam, championshipTitles: -1 }],
    ["a debut year before 1949", { ...validTeam, debutYear: 1948 }],
    [
      "a debut year in the future",
      { ...validTeam, debutYear: new Date().getFullYear() + 1 },
    ],
    [
      "a javascript: imageUrl",
      { ...validTeam, imageUrl: "javascript:alert(1)" },
    ],
    [
      "an http imageUrl",
      { ...validTeam, imageUrl: "http://example.com/a.webp" },
    ],
    [
      "a path traversal imageUrl",
      { ...validTeam, imageUrl: "/images/teams/../../etc/passwd.webp" },
    ],
    [
      "a too long imageUrl",
      { ...validTeam, imageUrl: `https://example.com/${"a".repeat(500)}` },
    ],
    ["a short description", { ...validTeam, description: "short" }],
    ["isOfficialTeam as a string", { ...validTeam, isOfficialTeam: "true" }],
    ["a missing field", { ...validTeam, altImageText: undefined }],
    ["an array body", [validTeam]],
  ];

  test.each(abusePayloads)(
    "Then it should respond 400 to %s and store nothing",
    async (_label, body) => {
      const response = await post(body);

      expect(response.status).toBe(400);
      expect(typeof (response.body as { message: string }).message).toBe(
        "string",
      );
      expect(await Team.countDocuments()).toBe(0);
    },
  );

  test("Then it should respond 201 to a valid team with an https imageUrl", async () => {
    const response = await post({
      ...validTeam,
      imageUrl: "https://example.com/team.webp",
    });

    expect(response.status).toBe(201);
  });

  test("Then it should respond 400 to malformed JSON", async () => {
    const response = await request(app)
      .post("/teams")
      .set("x-client-ip", "hardening")
      .set("content-type", "application/json")
      .send('{"name": ');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid JSON body" });
  });

  test("Then it should respond 413 to a body over 10 kB", async () => {
    const response = await post({
      ...validTeam,
      description: "x".repeat(11 * 1024),
    });

    expect(response.status).toBe(413);
    expect(response.body).toEqual({ message: "Request body is too large" });
  });

  test("Then it should respond 422 when there are already 50 teams", async () => {
    await Team.insertMany(
      Array.from({ length: 50 }, (_, index) => ({
        ...validTeam,
        name: `Team ${index}`,
      })),
    );

    const response = await post(validTeam);

    expect(response.status).toBe(422);
    expect(await Team.countDocuments()).toBe(50);
  });
});

describe("Given the GET and DELETE /teams/:id endpoints with bad ids", () => {
  const badIds = [
    "aaaaaaaaaaaa",
    "6760222c9f350126a80dcb7z",
    "%7B%24gt%3A1%7D",
  ];

  test.each(badIds)("Then GET /teams/%s should respond 400", async (id) => {
    const response = await request(app).get(`/teams/${id}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "ID is not correct" });
  });

  test.each(badIds)("Then DELETE /teams/%s should respond 400", async (id) => {
    const response = await request(app)
      .delete(`/teams/${id}`)
      .set("x-client-ip", "hardening");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "ID is not correct" });
  });
});

describe("Given more writes than the limit from one client", () => {
  afterEach(() => {
    delete process.env.WRITE_RATE_LIMIT;
  });

  test("Then it should respond 429 once the limit is reached, keyed by x-client-ip", async () => {
    process.env.WRITE_RATE_LIMIT = "2";

    await post({ ...validTeam, name: "Limit One" }, "limited");
    await post({ ...validTeam, name: "Limit Two" }, "limited");
    const blocked = await post(
      { ...validTeam, name: "Limit Three" },
      "limited",
    );
    const otherClient = await post(
      { ...validTeam, name: "Limit Four" },
      "other",
    );

    expect(blocked.status).toBe(429);
    expect(blocked.body).toEqual({
      message: "Too many requests, try again later",
    });
    expect(otherClient.status).toBe(201);
  });
});

describe("Given any response", () => {
  test("Then it should carry the helmet security headers", async () => {
    const response = await request(app).get("/teams");

    expect(response.headers["x-content-type-options"]).toBe("nosniff");
  });
});
