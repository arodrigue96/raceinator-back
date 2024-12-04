import request from "supertest";
import { app } from "../index.js";

describe("Given a non existing endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a 'Endpoint not found' 404 error", async () => {
      const expectedStatusCode = 404;
      const endpoint = "/example";
      const expectedMessage = "Endpoint not found";

      const response = await request(app)
        .get(endpoint)
        .expect(expectedStatusCode);

      const responseBody = response.body as { message: string };

      expect(responseBody.message).toBe(expectedMessage);
    });
  });
});
