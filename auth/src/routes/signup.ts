import express, { Request, Response } from "express";
import { User } from "../models/user";
import { body } from "express-validator";
import { BadRequestError, validateRequest } from "@ticketrrr/common";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid!"),
    body("password")
      .isAlphanumeric()
      .isLength({ min: 4 })
      .withMessage("Password must be min 4 chars"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }

    const user = User.build({ email, password });
    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    return res.status(200).json(user);
  }
);

export { router as SignUpRouter };
