const zmq = require("zeromq");
const axios = require("axios");

const sock = new zmq.Reply();

/**Function to get the current date and time based on a location */
const getCurrentDateTime = async (location) => {
  try {
    const response = await axios.get(
      `http://worldtimeapi.org/api/timezone/${location}`
    );
    console.log("response.data.dateTime", response.data.dateTime);
    return response.data.datetime;
  } catch (error) {
    return "Invalid location or unable to retrieve date and time";
  }
};

async () => {
  await sock.bind("tcp://127.0.0.1:5555");
  console.log("Time service is listening on port 5555");

  for await (const [msg] of sock) {
    const location = msg.toString();
    console.log(`Received request for location: ${location}`);

     // Get the date and time for the requested location
     const response = await getCurrentDateTime(location);
     await sock.send(response);
  }
};
