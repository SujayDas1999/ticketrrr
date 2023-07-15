import request from "supertest";
import { app } from "../../app";

beforeEach(async () => {
  await request(app).post("/api/users/signup").send({
    email: "test@test.com",
    password: "test1234",
  });

  await request(app).post("/api/users/signin").send({
    email: "test@test.com",
    password: "test1234",
  });
});

it("should remove cookie after user signs out", async () => {
  const response = await request(app).post("/api/users/signout").send({});

  expect(response.get("Set-Cookie")[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
