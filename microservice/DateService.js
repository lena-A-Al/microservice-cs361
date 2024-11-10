const zmq = require("zeromq");

const sock = new zmq.Reply();

/** Function to format the current date */
const getCurrentDate = () => {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/** Function to start the Date Service */
const startDateService = async () => {
  console.log("Starting Date Service...");
  await sock.bind("tcp://127.0.0.1:5556");
  console.log("Date Service is listening on port 5556");

  for await (const [msg] of sock) {
    console.log("Received request for current date");
    const currentDate = getCurrentDate();
    console.log("Sending response:", currentDate);
    await sock.send(currentDate);
  }
};

// Proper cleanup on shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down Date Service...");
  await sock.close();
  process.exit(0);
});

// Start the service
startDateService();
