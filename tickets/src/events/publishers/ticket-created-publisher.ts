import { Subjects, TicketCreatedEvent, Publisher } from "@ticketrrr/common";

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

export default TicketCreatedPublisher;
