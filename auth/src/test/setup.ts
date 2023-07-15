import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "assadasd";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongo) {
    await mongo.stop();
  }
});

global.signin = async () => {
  const email = "test@test.com";
  const password = "test1234";

  await request(app).post("/api/users/signup").send({
    email,
    password,
  });

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email,
      password,
    })
    .expect(200);

  const cookie = response.get("Set-Cookie");
  return cookie;
};
