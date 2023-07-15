import { Publisher, OrderCreatedEvent, Subjects } from "@ticketrrr/common";
import { Order } from "../src/models/order";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
