import { Subjects, Publisher, TicketUpdatedEvent } from "@ticketrrr/common";

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

export default TicketUpdatedPublisher;
