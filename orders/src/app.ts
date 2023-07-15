import express from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import { json } from "body-parser";

import { NotFoundError, currentUser, errorHandler } from "@ticketrrr/common";
import { deleteOrderRouter } from "./routes/delete.routes";
import { showOrderRouter } from "./routes/show.routes";
import { listOrderRouter } from "./routes/list.routes";
import { newOrderRouter } from "./routes/new.routes";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);
app.use(deleteOrderRouter);
app.use(showOrderRouter);
app.use(listOrderRouter);
app.use(newOrderRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
