import {
  BadRequestError,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@ticketrrr/common";
import Listener from "@ticketrrr/common/build/events/base-listener";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import TicketUpdatedPublisher from "../publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName: string = queueGroupName;
  async onMessage(
    data: {
      id: string;
      status: OrderStatus;
      userId: string;
      expiredAt: string;
      version: number;
      ticket: { id: string; price: number };
    },
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new BadRequestError("Ticket not found");
    }

    ticket.set({ orderId: data.id });

    await ticket.save();

    const { id, price, version, orderId, title, userId } = ticket;

    await new TicketUpdatedPublisher(this.client).publish({
      id: id,
      price: price,
      version: version,
      orderId: orderId,
      title: title,
      userId: userId,
    });

    msg.ack();
  }
}
