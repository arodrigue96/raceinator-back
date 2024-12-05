import { createDefaultPreset, JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  verbose: true,
  rootDir: "src",
  preset: "ts-jest",
  resolver: "ts-jest-resolver",
  collectCoverageFrom: [
    "**/*.ts",
    "!server/startServer.ts",
    "!index.ts",
    "!database/connectToDatabase.ts",
    "!server/detectEnviromentForCors.ts",
  ],
  coverageDirectory: "../coverage",
  ...createDefaultPreset(),
};

export default jestConfig;
