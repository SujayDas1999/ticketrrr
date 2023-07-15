import express, { Request, Response } from "express";
import { currentUser } from "@ticketrrr/common";
const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUser,
  async (req: Request, res: Response) => {
    return res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
