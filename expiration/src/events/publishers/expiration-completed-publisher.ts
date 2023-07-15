import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@ticketrrr/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
