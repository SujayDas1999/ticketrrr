import {
  Subjects,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from "@ticketrrr/common";
import Listener from "@ticketrrr/common/build/events/base-listener";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../src/models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  readonly queueGroupName: string = queueGroupName;
  async onMessage(
    data: {
      id: string;
      title: string;
      price: number;
      userId: string;
      version: number;
    },
    msg: Message
  ): Promise<void> {
    const { id, title, price, version } = data;
    const ticket = await Ticket.findByEvent(id, version);
    if (!ticket) {
      throw new Error("Ticket not found!");
    }

    ticket.set({ title, price });

    await ticket.save();
    msg.ack();
  }
}
