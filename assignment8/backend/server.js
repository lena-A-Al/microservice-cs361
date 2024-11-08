const express = require("express");
const zmq = require("zeromq");

const app = express();
const port = 4000;

/**create a zeromq request to communicate with the microservice */

const sock = new zmq.Request();
sock.connect("tcp://127.0.0.1:5555");

/**end point to get the current date and time based on location */

app.get("/api/time", async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: "location is required" });
  }

  try {
    //send the location to the microservice and receive the date and time
    await sock.send(location)
    const [response] = await sock.receive();
    res.json({datetime: response.toString()})
  } catch (error) {
    res.status(500).json({ error: "Failed to connect to time service" });
  }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
