import mongoose from "mongoose";

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
  userId: string;
}

interface PaymentDocument extends mongoose.Document {
  orderId: string;
  stripeId: string;
  userId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDocument> {
  build(attrs: PaymentAttrs): PaymentDocument;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: String,
    },
    stripeId: {
      required: true,
      type: String,
    },
    userId: {
      required: true,
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDocument, PaymentModel>(
  "Payment",
  paymentSchema
);

export { Payment };
