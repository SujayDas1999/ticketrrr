import request from "supertest";
import { app } from "../../app";

it("returns 200 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test1234",
    })
    .expect(200);
});

it("returns 400 on invalid input", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test",
      password: "",
    })
    .expect(400);
});

it("does not allows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test1234",
    })
    .expect(200);

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test1234",
    })
    .expect(400);
});

it("should have a header of set-cookies after signing up successfully", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test1234",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
