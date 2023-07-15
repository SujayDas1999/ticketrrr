import { Message } from "node-nats-streaming";
import Listener from "./base-listener";
import { Subjects } from "./subjects";
import { TicketUpdatedEvent } from "./ticket-updated-event";

class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName: string = "payments-service";
  onMessage(data: TicketUpdatedEvent["data"], msg: Message): void {
    console.log(data);
    msg.ack();
  }
}

export default TicketUpdatedListener;
