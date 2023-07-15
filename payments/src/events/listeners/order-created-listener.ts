import { OrderCreatedEvent, OrderStatus, Subjects } from "@ticketrrr/common";
import Listener from "@ticketrrr/common/build/events/base-listener";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../model/order.model";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
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
    try {
      const order = Order.build({
        id: data.id,
        price: data.ticket.price,
        status: data.status,
        userId: data.userId,
        version: data.version,
      });

      await order.save();

      msg.ack();
    } catch (ex) {
      console.log(ex);
    }
  }
}
