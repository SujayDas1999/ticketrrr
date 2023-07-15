import request from "supertest";
import { app } from "../../app";

beforeEach(async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test1234",
    })
    .expect(200);
});

it("should return 200 on successful signin", async () => {
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "test1234",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("should return 400 on invalid email/password", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "test12345",
    })
    .expect(400);
});
