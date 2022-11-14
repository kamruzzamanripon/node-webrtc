import * as store from './store.js';
import * as ui from './ui.js';
import * as webRTCHandler from './webRTCHandler.js';

let socketIO = null;

export const registerSocketEvents = (socket) =>{
  socketIO = socket;
    
  socket.on("connect", () => {
      console.log("successfully connecte to socket.io server")
      console.log('wss.js1', socket.id)
        store.setSocketId(socket.id);
        ui.updatePersonalCode(socket.id);
      });

    socket.on('pre-offer', (data)=>{
      console.log('wss.js2')
      console.log('wss.js2', data)
      webRTCHandler.handlePreOffer(data);
    })  
      
}

export const sendPreOffer = (data)=>{
  console.log('wss.js3', data)
  socketIO.emit("pre-offer", data);
}



