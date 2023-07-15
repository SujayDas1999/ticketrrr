import {
  NotFoundError,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@ticketrrr/common";
import Listener from "@ticketrrr/common/build/events/base-listener";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../src/models/order";

export class PaymentCompleteListener extends Listener<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  readonly queueGroupName: string = queueGroupName;
  async onMessage(
    data: { orderId: string; id: string; stripeId: string },
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new NotFoundError();
    }

    order.set({
      status: OrderStatus.Complete,
    });

    await order.save();

    msg.ack();
  }
}
