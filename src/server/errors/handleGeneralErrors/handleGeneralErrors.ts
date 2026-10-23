import { type NextFunction, type Request, type Response } from "express";
import type ServerError from "../ServerError/ServerError";
import chalk from "chalk";

const handleGeneralErrors = (
  error: ServerError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.log(chalk.bgRed(error.message));
  console.log(chalk.red(error.stack));

  const serverErrorStatusCode = 500;
  const serverErrorMessage = "Server Error";

  const bodyParserMessages = new Map([
    ["entity.too.large", "Request body is too large"],
    ["entity.parse.failed", "Invalid JSON body"],
  ]);

  const statusCode = error.statusCode ?? serverErrorStatusCode;
  const errorMessage =
    statusCode >= serverErrorStatusCode
      ? serverErrorMessage
      : (bodyParserMessages.get((error as { type?: string }).type ?? "") ??
        error.message);

  res.status(statusCode).json({ message: errorMessage });
};

export default handleGeneralErrors;
