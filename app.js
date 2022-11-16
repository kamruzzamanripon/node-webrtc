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
    //console.log('app.js', calleePersonalCode)
    if(connectedPeer){
      const data = {
        callerSocketId: socket.id, //1st person
        callType
      };
      console.log('app.js2, Nashwan', calleePersonalCode) //2nd person
      console.log('app.js2, ripon', data) //1st person
      io.to(calleePersonalCode).emit('pre-offer', data);
    }else {
      const data = { preOfferAnswer: 'CALLEE_NOT_FOUND'}
      io.to(socket.id).emit('pre-offer-answer', data);
    }
  })

  socket.on('pre-offer-answer', (data)=>{
    const {callerSocketId} = data //1st user
    const connectedPeer = connectedPeers.find((peerSocketId)=> peerSocketId === callerSocketId);
    if(connectedPeer){
      io.to(callerSocketId).emit("pre-offer-answer", data); //2nd user
    }
  })

  socket.on("webRTC-signaling", (data)=>{
    const {connectedUserSocketId} = data;
    const connectedPeer = connectedPeers.find((peerSocketId)=> peerSocketId === connectedUserSocketId);
    if(connectedPeer){
      io.to(connectedUserSocketId).emit("webRTC-signaling", data); 
    }
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");

    const newConnectedPeers = connectedPeers.filter((peerSocketId) =>(
       peerSocketId !== socket.id 
       ));

    connectedPeers = newConnectedPeers;
    console.log(connectedPeers);
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
