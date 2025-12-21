import { io } from "socket.io-client";

// Backend URL
const socket = io("http://localhost:5000", {
  autoConnect: true,
});

export default socket;
