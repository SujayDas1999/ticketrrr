import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { requireAuth } from "@ticketrrr/common";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined,
  });

  return res.status(200).send(tickets);
});

router.get(
  "/api/tickets/showmy",
  requireAuth,
  async (req: Request, res: Response) => {
    const tickets = await Ticket.findById({
      userId: req.currentUser?.id,
    }).exec();

    return res.status(200).send(tickets);
  }
);

export { router as getTicketsRoute };
