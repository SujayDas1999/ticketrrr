import { Message } from "node-nats-streaming";
import Listener from "./base-listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName: string = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event Data!", data);
    //console.log(data.price);
    msg.ack();
  }
}

export default TicketCreatedListener;
