import * as constants from './constants.js';
import * as store from './store.js';
import * as ui from './ui.js';
import * as webRTCHandler from './webRTCHandler.js';

let socketIO = null;

export const registerSocketEvents = (socket) =>{
  socketIO = socket;
    
  socket.on("connect", () => {
      console.log("successfully connecte to socket.io server")
      //console.log('wss.js1', socket.id)
        store.setSocketId(socket.id);
        ui.updatePersonalCode(socket.id);
      });

    socket.on('pre-offer', (data)=>{
      webRTCHandler.handlePreOffer(data);
    })  

    socket.on("pre-offer-answer", (data)=>{
      webRTCHandler.handlePreOfferAnswer(data);
    })

    socket.on("webRTC-signaling", (data)=>{
      switch(data.type){
        case constants.webRTCSingnaling.OFFER:
          webRTCHandler.handleWebRTCOffer(data);
          break;
        case constants.webRTCSingnaling.ANSWER:
          webRTCHandler.handleWebRTCAnswer(data);
          break;
        case constants.webRTCSingnaling.ICE_CANDIDATE:
          webRTCHandler.handleWebRTCCandidate(data);
          break;
            
        default:
          return;  
      }
    })   

    //hang up
    socket.on("user-hanged-up", ()=>{
      webRTCHandler.handleConnectedUserHangedUp();
    })
      
}

export const sendPreOffer = (data)=>{
  console.log('wss.js3', data)
  socketIO.emit("pre-offer", data);
}

export const sendPreOfferAnswer = (data)=>{
  socketIO.emit("pre-offer-answer", data);
}

export const sendDataUsingWebRTCSignaling = (data)=>{
  socketIO.emit("webRTC-signaling", data);
}

//hang up
export const sendUserHangedUp =(data)=>{
  socketIO.emit("user-hanged-up", data);
}

