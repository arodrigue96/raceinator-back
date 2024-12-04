import { type Request, type Response } from "express";
import ServerError from "../ServerError/ServerError";
import handleGeneralErrors from "./handleGeneralErrors";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given the handleGeneralErrors middleware", () => {
  const request: Partial<Request> = {};
  const response: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const _next = jest.fn();

  describe("When it receives a 404 'Endpoint not found' error", () => {
    const error = new ServerError("Endpoint not found", 404);

    test("Then it should call the status method with the status code 404", () => {
      const expectedStatusCode = 404;

      handleGeneralErrors(
        error,
        request as Request,
        response as Response,
        _next,
      );

      expect(response.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call the json method with message 'Endpoint not found'", () => {
      const expectedErrorMessage = {
        message: "Endpoint not found",
      };

      handleGeneralErrors(
        error,
        request as Request,
        response as Response,
        _next,
      );

      expect(response.json).toHaveBeenCalledWith(expectedErrorMessage);
    });
  });

  describe("When it receives an error with the message 'Type Error'", () => {
    const error = new Error("Type Error");

    test("Then it should call status method with status code 500", () => {
      const expectedStatusCode = 500;

      handleGeneralErrors(
        error as ServerError,
        request as Request,
        response as Response,
        _next,
      );

      expect(response.status).toHaveBeenLastCalledWith(expectedStatusCode);
    });

    test("Then it should call json method with message 'Server Error'", () => {
      const expectedErrorMessage = "Server Error";

      handleGeneralErrors(
        error as ServerError,
        request as Request,
        response as Response,
        _next,
      );

      expect(response.json).toHaveBeenCalledWith({
        message: expectedErrorMessage,
      });
    });
  });
});
