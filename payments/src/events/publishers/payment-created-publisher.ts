import { PaymentCreatedEvent, Publisher, Subjects } from "@ticketrrr/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
