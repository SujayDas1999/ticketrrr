import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import userequest from "../../hooks/use-request";
import Router from "next/router";

const OrderDetail = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [STRIPE_KEY, setStripeKey] = useState(
    process.env.NEXT_PUBLIC_STRIPE_KEY
  );

  const { doRequest, errors } = userequest({
    url: `/api/payments`,
    method: `post`,
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const duration = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(duration / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return timeLeft <= 0 ? (
    <div> Sorry the order is expired!</div>
  ) : (
    <>
      <div>Time left to pay: {timeLeft} seconds</div>
      <StripeCheckout
        token={(token) =>
          doRequest({
            token: token.id,
          })
        }
        stripeKey={STRIPE_KEY}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </>
  );
};

OrderDetail.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  //console.log(order)
  return { order: data };
};

export default OrderDetail;
