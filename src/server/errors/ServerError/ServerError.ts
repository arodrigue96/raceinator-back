import { type ServerErrorStructure } from "./types";

class ServerError extends Error implements ServerErrorStructure {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
  }
}

export default ServerError;
