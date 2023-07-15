import { OrderCreatedEvent, OrderStatus, Subjects } from "@ticketrrr/common";
import Listener from "@ticketrrr/common/build/events/base-listener";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName: string = "expiration-service";
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
    const delay = new Date(data.expiredAt).getTime() - new Date().getTime();
    console.log("waiting ms to process the job", delay);
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delay,
      }
    );
    msg.ack();
  }
}
