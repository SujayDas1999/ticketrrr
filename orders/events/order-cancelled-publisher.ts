import { OrderCancelledEvent, Publisher, Subjects } from "@ticketrrr/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
