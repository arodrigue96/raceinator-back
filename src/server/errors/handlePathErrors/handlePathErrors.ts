import { type NextFunction, type Request, type Response } from "express";
import ServerError from "../ServerError/ServerError.js";

const handlePathErrors = (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const error = new ServerError("Endpoint not found", 404);

  next(error);
};

export default handlePathErrors;
