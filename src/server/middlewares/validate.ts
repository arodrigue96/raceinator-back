import { type NextFunction, type Request, type Response } from "express";
import { type ZodType } from "zod";
import ServerError from "../errors/ServerError/ServerError.js";

interface Schemas {
  body?: ZodType;
  params?: ZodType;
}

const validate =
  ({ body, params }: Schemas) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (params) {
      const result = params.safeParse(req.params);

      if (!result.success) {
        next(new ServerError(result.error.issues[0].message, 400));
        return;
      }
    }

    if (body) {
      const result = body.safeParse(req.body);

      if (!result.success) {
        const [issue] = result.error.issues;
        const field = issue.path.join(".");

        next(
          new ServerError(
            field ? `${field}: ${issue.message}` : issue.message,
            400,
          ),
        );
        return;
      }

      req.body = result.data;
    }

    next();
  };

export default validate;
