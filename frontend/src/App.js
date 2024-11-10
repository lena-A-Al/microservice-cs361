import React, { useState } from "react";
import axios from "axios";

function App() {
  const [date, setDate] = useState("");

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

  return (
    <div>
      <h1>Get Current Date</h1>
      <button onClick={fetchDate}>Get Date</button>
      <div>
        <h2>Current Date:</h2>
        <p>{date}</p>
      </div>
    </div>
  );
}

export default App;
