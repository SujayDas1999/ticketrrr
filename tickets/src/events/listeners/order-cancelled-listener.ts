import {
  BadRequestError,
  OrderCancelledEvent,
  Subjects,
} from "@ticketrrr/common";
import Listener from "@ticketrrr/common/build/events/base-listener";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import TicketUpdatedPublisher from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  readonly queueGroupName: string = queueGroupName;
  async onMessage(
    data: { id: string; version: number; ticket: { id: string } },
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new BadRequestError("Ticket not found");
    }

    ticket.set({ orderId: undefined });

    await ticket.save();

    const { id, title, price, version, userId, orderId } = ticket;

    await new TicketUpdatedPublisher(this.client).publish({
      id,
      title,
      price,
      version,
      userId,
      orderId,
    });

    msg.ack();
  }
}
