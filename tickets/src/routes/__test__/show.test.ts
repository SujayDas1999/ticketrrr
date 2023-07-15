import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("should have a route handler listening to /api/tickets/:id for post requests", async () => {
  const response = await request(app)
    .get("/api/tickets/42334")
    .set("Cookie", global.signin())
    .send({});
  expect(response.status).toEqual(200);
});

it("should result in 401 if user is not authenticated", async () => {
  const response = await request(app).get("/api/tickets/234234").send({});

  expect(response.status).toEqual(401);
});

it("should fetch a ticket id for the id provided", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.signin())
    .send({
      title: "test title",
      price: 20,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .expect(200);

  expect(ticketResponse.body.title).toEqual("test title");
});

it("should throw error for user if ticket is not present with the given id", async () => {
  const response = await request(app)
    .get("/api/tickets/234233242")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).toBe(404);
});
