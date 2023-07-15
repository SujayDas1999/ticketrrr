import axios from "axios";
import Link from "next/link";

const LandingPage = ({ currentUser, tickets, userName }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link
            href={{ pathname: "/tickets/[ticketId]", query: { id: ticket.id } }}
            legacyBehavior
            as={`/tickets/${ticket.id}`}
          >
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return currentUser ? (
    <div>
      <h1>Welcome {userName[0]}! Tickets</h1>
      <hr></hr>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Show Details</th>
          </tr>
        </thead>
        <tbody>{tickets && ticketList}</tbody>
        <tbody></tbody>
      </table>
    </div>
  ) : (
    <div>You are not signed in</div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");
  const userName = currentUser?.email.split("@");

  return { tickets: data, userName: userName };
};

export default LandingPage;
