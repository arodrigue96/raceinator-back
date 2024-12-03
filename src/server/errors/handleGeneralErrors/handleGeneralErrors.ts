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

  const statusCode = error.statusCode ?? serverErrorStatusCode;
  const errorMessage =
    statusCode === serverErrorStatusCode ? serverErrorMessage : error.message;

  res.status(statusCode).json({ message: errorMessage });
};

export default handleGeneralErrors;
