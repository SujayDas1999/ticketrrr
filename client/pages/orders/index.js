import Link from "next/link";

const Order = ({ orders }) => {
  const orderList = orders.map((order) => {
    return (
      <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.ticket.title}</td>
        <td>
          <Link
            href={{
              pathname: "/tickets/[ticketId]",
              query: { id: order.ticket.id },
            }}
            legacyBehavior
            as={`/tickets/${order.ticket.id}`}
          >
            <a>View</a>
          </Link>
        </td>
        <td>${order.ticket.price}</td>
        <td>{order.status}</td>
      </tr>
    );
  });

  return orders ? (
    <div>
      <h1>Your Orders</h1>
      <hr></hr>
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Ticket Name</th>
            <th>View Ticket</th>
            <th>Price</th>
            <th>Order Status</th>
          </tr>
        </thead>
        <tbody>{orders && orderList}</tbody>
        <tbody></tbody>
      </table>
    </div>
  ) : (
    <div>You have no orders</div>
  );
};

Order.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default Order;
