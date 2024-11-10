const express = require("express");
const zmq = require("zeromq");

const app = express();
const port = 4000;

const cors = require("cors");
app.use(cors());


// ZeroMQ Request socket
const sock = new zmq.Request();

// Connect to the ZeroMQ microservice
const connectToDateService = async () => {
  console.log("Connecting to Date Service...");
  await sock.connect("tcp://127.0.0.1:5556");
  console.log("Connected to Date Service");
};

// Route to get the current date
app.get("/api/date", async (req, res) => {
  try {
    console.log("Requesting date from ZeroMQ service...");
    await sock.send("Get date");
    const [reply] = await sock.receive();
    console.log("Received response from ZeroMQ service:", reply.toString());

    res.json({ date: reply.toString() });
  } catch (error) {
    console.error("Error communicating with ZeroMQ service:", error);
    res.status(500).json({ error: "Failed to retrieve date" });
  }
});



// Start Express server
app.listen(port, async () => {
  console.log(`Express server is running on http://localhost:${port}`);
  await connectToDateService();
});
