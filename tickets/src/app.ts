import express from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import { json } from "body-parser";

import { NotFoundError, currentUser, errorHandler } from "@ticketrrr/common";
import { createTicketRouter } from "./routes/new.routes";
import { showTicketRouter } from "./routes/show.routes";
import { getTicketsRoute } from "./routes/list.routes";
import { updateTicketRouter } from "./routes/update.routes";

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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(getTicketsRoute);
app.use(updateTicketRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
