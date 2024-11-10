## Current Date Microservice:

This microservice provides the current date in the following format Month, day,year;such as November 9, 2024 using ZeroMQ's.

## Prerequisties:

- Node.js installed on the machine.
- ZeroMQ installed on the project.
- Axios installed on the project.
- Express installed on the project.

## Installation:

Clone the whole repository to the local machine:

```bash
 git clone https://github.com/lena-A-Al/microservice-cs361
 cd backend
 cd frontend
 cd microservice
```

## How to run the repository locally:

```
inside backend folder run the following command:
npm install
node server.js


inside microservice folder run the following command:
npm install
node DateServer.js


inside backend folder run the following command:
npm install
npm start
```

## How to request data from the microservice:

```
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
```

## How to recieve data from the microservice:

```
  const fetchDate = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/date");
      console.log("Received response:", response.data);
      setDate(response.data.date);
    } catch (error) {
      console.error("Error fetching date:", error.response || error.message);
      setDate("Error fetching date");
    }
  };
```

## Message Formats:

The microservice will send the message/date in the following format (month, day, year)
(e.g, November 9, 2024)
