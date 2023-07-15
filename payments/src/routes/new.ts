import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  BadRequestError,
  validateRequest,
  NotFoundError,
  UnAuthorizedError,
  OrderStatus,
} from "@ticketrrr/common";
import { Order } from "../model/order.model";
import { stripe } from "../stripe";
import { Payment } from "../model/payment.model";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { token, orderId } = req.body;
      const order = await Order.findById(orderId);

      if (!order) {
        throw new NotFoundError();
      }

      if (order.userId !== req.currentUser!.id) {
        throw new UnAuthorizedError("Not authorized");
      }

      if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError("Order is cancelled");
      }

      const customer = await stripe.customers.create({
        name: "Jenny Rosen",
        address: {
          line1: "510 Townsend St",
          postal_code: "98140",
          city: "San Francisco",
          state: "CA",
          country: "US",
        },
      });

      console.log(token);

      const card = await stripe.customers.createSource(customer.id, {
        source: token,
      });

      const charge = await stripe.charges.create({
        currency: "usd",
        amount: order!.price * 100,
        source: card.id,
        description: "TEST TRANS",
        customer: customer.id,
      });

      const payment = await Payment.build({
        orderId: orderId,
        stripeId: charge.id,
        userId: req.currentUser!.id,
      });

      await payment.save();

      await new PaymentCreatedPublisher(natsWrapper.client).publish({
        orderId: payment.orderId,
        id: payment.id,
        stripeId: payment.stripeId,
      });

      res.status(201).send({ id: payment.id });
    } catch (ex) {
      console.log(ex);
    }
  }
);

export { router as createChargeRouter };
