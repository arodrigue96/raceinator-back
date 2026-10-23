import { readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { teamBodySchema } from "./schemas/teamSchema.js";

const seedPath = path.join(process.cwd(), "data/teams2026.json");

// Parsed once at startup: an invalid seed file stops the server instead of serving bad defaults
const defaultTeams = z
  .array(teamBodySchema)
  .parse(JSON.parse(readFileSync(seedPath, "utf8")));

export default defaultTeams;
