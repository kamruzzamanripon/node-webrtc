const socket = io("/");
import * as store from './store.js';

socket.on("connect", () => {
  console.log("succesfully connected to socket.io server");
  console.log("info", socket);
  console.log(socket.id);
  store.setSocketId(socket.id)
});
