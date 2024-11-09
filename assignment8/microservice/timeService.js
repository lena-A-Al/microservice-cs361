const zmq = require("zeromq");
const axios = require("axios");

const sock = new zmq.Reply();

/** Function to get the current date and time based on a location */
const getCurrentDateTime = async (location) => {
  try {
    // Use default timezone if location is empty or invalid
    const timeZone = location.trim() ? location : "America/New_York";

    // Fetch the time for the given location
    const response = await axios.get(`http://worldtimeapi.org/api/timezone/${timeZone}`);

    console.log("API Response Status Code:", response.status);

    if (response.status === 200) {
      console.log("response.data.datetime:", response.data.datetime);
      return response.data.datetime;
    } else {
      return `Error: Received status code ${response.status}`;
    }
  } catch (error) {
    // Log error details for debugging
    console.error("API error:", error.response ? error.response.data : error.message);

    // Return fallback Eastern Time
    const easternTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    return `Error: Defaulting to Eastern Time: ${easternTime}`;
  }
};

/** Function to start the time service */
const startTimeService = async () => {
  console.log("Running time service...");
  await sock.bind("tcp://127.0.0.1:5555");
  console.log("Time service is listening on port 5555");

  for await (const [msg] of sock) {
    const location = msg.toString();
    console.log(`Received request for location: ${location}`);

    // Get the date and time for the requested location
    const response = await getCurrentDateTime(location);

    // Log and send the response back to the client
    console.log("Sending response:", response);
    await sock.send(response);
  }
};

// Call the function to start the service
startTimeService();
