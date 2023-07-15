import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT Must be defined");
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MongoDB URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log(error);
  }
};

app.listen(3000, () => {
  console.log(`Auth :=> 3000!!`);
});

start();
