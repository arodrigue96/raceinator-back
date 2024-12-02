import { createDefaultPreset, JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  verbose: true,
  rootDir: "src",
  preset: "ts-jest",
  collectCoverageFrom: [
    "**/*.ts",
    "!server/startServer.ts",
    "!index.ts",
    "!database/**.ts",
    "!team/model/**.ts",
  ],
  coverageDirectory: "../coverage",

  ...createDefaultPreset(),
};

export default jestConfig;
