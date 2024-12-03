import { type NextFunction, type Response, type Request } from "express";
import handleEndpointNotFoundError from "./handleEndpointNotFoundError";
import ServerError from "../ServerError/ServerError";

describe("Given the handlePathErrors middleware", () => {
  describe("When it receives a next function", () => {
    test("Then it should call the next function with a 'Endpoint not found' 404 error", () => {
      const _req: Partial<Request> = {};
      const _res: Partial<Response> = {};
      const next: NextFunction = jest.fn();

      const expectedError = new ServerError("Endpoint not found", 404);

      handleEndpointNotFoundError(_req as Request, _res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expectedError.message,
          statusCode: expectedError.statusCode,
        }),
      );
    });
  });
});
