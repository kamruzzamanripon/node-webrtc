const express = require("express");
const http = require("http");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

let connectedPeers = [];

io.on("connection", (socket) => {
  connectedPeers.push(socket.id);
  console.log("1st conncection Server", connectedPeers);

  socket.on("pre-offer", (data)=>{
    const {calleePersonalCode, callType} = data;
    const connectedPeer = connectedPeers.find((peerSocketId)=> peerSocketId === calleePersonalCode);
    console.log('app.js', calleePersonalCode)
    if(connectedPeer){
      const data = {
        callerSocketId: socket.id,
        callType
      };
      console.log('app.js2, Nashwan', calleePersonalCode)
      console.log('app.js2, ripon', data)
      io.to(calleePersonalCode).emit('pre-offer', data);
    }
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");

    const newConnectedPeers = connectedPeers.filter((peerSocketId) => {
      peerSocketId !== socket.id;
    });

    connectedPeers = newConnectedPeers;
    console.log(connectedPeers);
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
