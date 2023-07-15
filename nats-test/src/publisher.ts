// import nats from "node-nats-streaming";
// import TicketCreatedPublisher from "./events/ticket-created-publisher";

// console.clear();
// const stan = nats.connect("ticketing", "abc", {
//   url: "http://localhost:4222",
// });

// stan.on("connect", async () => {
//   try {
//     let data: any = {
//       id: "1234",
//       title: "concert",
//       price: 30,
//     };

//     const publish = new TicketCreatedPublisher(stan);
//     console.log("Publisher connected to NATS");
//     await publish.publish(data);
//   } catch (err) {
//     console.error(err);
//   }
// });
