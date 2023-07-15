import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "../events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "../events/listeners/ticket-updated-listener";
import { ExpirationCompletedListener } from "../events/listeners/expiration-completed-listener";
import { PaymentCompleteListener } from "../events/listeners/payment-complete-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT Must be defined");
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MongoDB URI must be defined");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompletedListener(natsWrapper.client).listen();
    new PaymentCompleteListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log(error);
  }
};

app.listen(3000, () => {
  console.log(`Tickets :=> 3000!!`);
});

start();
