import {
  ExpirationCompleteEvent,
  OrderStatus,
  Subjects,
} from "@ticketrrr/common";
import Listener from "@ticketrrr/common/build/events/base-listener";
import { Message } from "node-nats-streaming";
import { Order } from "../../src/models/order";
import { OrderCancelledPublisher } from "../order-cancelled-publisher";
import { natsWrapper } from "../../src/nats-wrapper";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompletedListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName: string = queueGroupName;

  async onMessage(data: { orderId: string }, msg: Message): Promise<void> {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw Error("Order not found");
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: data.orderId,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });

    msg.ack();
  }
}
